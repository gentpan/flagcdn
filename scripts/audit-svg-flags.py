#!/usr/bin/env python3
"""Read-only structural and render audit of both checked-in SVG flag trees.

Requires Pillow and rsvg-convert. This verifies technical integrity, not the
historical or legal correctness of each flag design. Identical source bytes
share render results; every physical file receives its own report record.
Only the requested report directory is written.
"""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import hashlib
import io
import json
import math
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ET

from PIL import Image, ImageColor, ImageDraw

REPO = Path(__file__).resolve().parents[1]
SVG_NS = "http://www.w3.org/2000/svg"
URL = re.compile(r"url\(\s*['\"]?([^)'\"\s]+)['\"]?\s*\)", re.I)
CSS_URL = re.compile(r"url\(\s*['\"]?\.\./flags/(1x1|4x3)/([a-z0-9-]+)\.svg['\"]?\s*\)")
PAINT_ATTRIBUTES = {"fill", "stroke", "stop-color", "flood-color", "lighting-color", "color"}
DRAW_TAGS = {"path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "use", "image", "text"}


def local_name(value):
    return value.rsplit("}", 1)[-1]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_svg(path, repository):
    data = path.read_bytes()
    result = {"file": str(path.relative_to(repository)), "sha256": hashlib.sha256(data).hexdigest(),
              "bytes": len(data), "errors": [], "review": [], "notes": []}
    if re.search(rb"<!DOCTYPE|<!ENTITY", data, re.I):
        result["errors"].append("DTD or entity declaration is not permitted in standalone public SVG")
    try:
        root = ET.fromstring(data)
    except ET.ParseError as exc:
        result["errors"].append("Invalid XML: " + str(exc))
        return result
    if root.tag != "{" + SVG_NS + "}svg":
        result["errors"].append("Root must be SVG in the standard SVG namespace")
    try:
        view_box = [float(value) for value in re.split(r"[\s,]+", root.get("viewBox", "").strip())]
        if len(view_box) != 4 or not all(math.isfinite(value) for value in view_box) or min(view_box[2:]) <= 0:
            raise ValueError("viewBox must contain four finite values and positive dimensions")
        result["viewBox"] = view_box
        result["aspect_ratio"] = view_box[2] / view_box[3]
        ratio = path.parent.name
        expected_ratio = {"1x1": 1, "4x3": 4 / 3}.get(ratio)
        if ratio == "flags" and path.stem == "gy":
            expected_ratio = 5 / 3
        if expected_ratio and not math.isclose(result["aspect_ratio"], expected_ratio, rel_tol=1e-8):
            result["errors"].append("viewBox does not match directory aspect ratio")
    except ValueError as exc:
        result["errors"].append("Invalid viewBox: " + str(exc))
    result["declared_dimensions"] = {key: root.get(key) for key in ("width", "height")}
    numeric_dimensions = []
    for key in ("width", "height"):
        value = root.get(key)
        if value is not None:
            match = re.fullmatch(r"([+-]?(?:[0-9]*\.)?[0-9]+)(px)?", value.strip())
            if match:
                dimension = float(match[1])
                if dimension <= 0:
                    result["errors"].append("Declared " + key + " must be positive")
                numeric_dimensions.append(dimension)
            else:
                result["review"].append("Relative or non-pixel declared " + key + ": " + value)
    if len(numeric_dimensions) == 2 and numeric_dimensions[1] > 0 and "aspect_ratio" in result:
        if not math.isclose(numeric_dimensions[0] / numeric_dimensions[1], result["aspect_ratio"], rel_tol=1e-8):
            result["errors"].append("Declared dimensions differ from viewBox aspect ratio")
    ids, references, hidden, external, unsafe, paints = Counter(), [], [], [], [], set()
    tags = Counter()
    for node in root.iter():
        tag = local_name(node.tag)
        tags[tag] += 1
        if node.get("id"):
            ids[node.get("id")] += 1
        if tag in {"script", "foreignObject", "animate", "animateMotion", "animateTransform", "set"}:
            unsafe.append(tag)
        declarations = dict(node.attrib)
        style = node.get("style", "")
        declarations.update({name.strip(): value.strip() for name, value in re.findall(r"([^:;]+):([^;]+)", style)})
        for name, value in declarations.items():
            attr = local_name(name)
            if attr.lower().startswith("on"):
                unsafe.append("Event attribute " + attr)
            if attr == "href":
                if value.startswith("#"):
                    references.append(value[1:])
                elif value:
                    external.append(value)
            for target in URL.findall(value):
                if target.startswith("#"):
                    references.append(target[1:])
                else:
                    external.append(target)
            if attr in PAINT_ATTRIBUTES:
                paint = value.strip()
                paints.add(paint)
                if not URL.search(paint) and paint.lower() not in {"none", "currentcolor", "inherit", "transparent"}:
                    try:
                        ImageColor.getrgb(paint)
                    except ValueError:
                        # Pillow does not cover all newer CSS color syntaxes.
                        result["review"].append("Paint requires manual review: " + paint)
        hidden_reason = []
        if declarations.get("display", "").strip().lower() == "none":
            hidden_reason.append("display:none")
        if declarations.get("visibility", "").strip().lower() in {"hidden", "collapse"}:
            hidden_reason.append("visibility:" + declarations["visibility"])
        for opacity_name in ("opacity", "fill-opacity", "stroke-opacity"):
            try:
                opacity = float(declarations.get(opacity_name, "1"))
                if opacity == 0:
                    hidden_reason.append(opacity_name + ":0")
                elif not 0 <= opacity <= 1:
                    result["review"].append(opacity_name + " outside 0..1")
            except ValueError:
                result["review"].append("Non-numeric " + opacity_name)
        if hidden_reason:
            hidden.append({"tag": tag, "id": node.get("id"), "reason": hidden_reason})
    result["tags"] = dict(tags)
    result["ids"] = len(ids)
    result["local_references"] = sorted(set(references))
    result["paints"] = sorted(paints)
    result["hidden_nodes"] = hidden
    duplicate_ids = sorted(name for name, count in ids.items() if count > 1)
    if duplicate_ids:
        result["errors"].append("Duplicate ids: " + ", ".join(duplicate_ids))
    unresolved = sorted(set(references) - set(ids))
    result["unresolved_local_references"] = unresolved
    if unresolved:
        result["errors"].append("Unresolved local references: " + ", ".join(unresolved))
    if external:
        result["errors"].append("External resource references: " + ", ".join(sorted(set(external))))
    if unsafe:
        result["errors"].append("Active/non-standalone elements: " + ", ".join(sorted(set(unsafe))))
    if not sum(count for tag, count in tags.items() if tag in DRAW_TAGS):
        result["errors"].append("No drawing elements")
    if hidden:
        result["notes"].append("Hidden nodes are listed for review; they can be intentional construction layers")
    result["review"] = sorted(set(result["review"]))
    return result


def render_svg(path, width, destination):
    command = ["rsvg-convert", "--width", str(width), "--keep-aspect-ratio", str(path)]
    result = {"errors": []}
    renders = []
    for repeat in range(2):
        try:
            process = subprocess.run(command, capture_output=True, timeout=30, check=True)
            with Image.open(io.BytesIO(process.stdout)) as opened:
                image = opened.convert("RGBA")
                image.load()
            renders.append(image)
            if process.stderr:
                result.setdefault("diagnostics", []).append(process.stderr.decode(errors="replace").strip())
        except (subprocess.SubprocessError, OSError, ValueError) as exc:
            result["errors"].append("Render failed: " + str(exc))
            return result
    image = renders[0]
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination)
    result["dimensions"] = list(image.size)
    result["deterministic_rgba"] = image.size == renders[1].size and image.tobytes() == renders[1].tobytes()
    if not result["deterministic_rgba"]:
        result["errors"].append("Repeated renders produce different pixels")
    alpha = image.getchannel("A")
    result["alpha_extrema"] = list(alpha.getextrema())
    result["visible_bounds"] = alpha.getbbox()
    histogram = alpha.histogram()
    pixels = image.width * image.height
    result["fully_transparent_percent"] = histogram[0] * 100 / pixels
    result["partly_transparent_percent"] = sum(histogram[1:255]) * 100 / pixels
    result["opaque_percent"] = histogram[255] * 100 / pixels
    result["visible_rgba_sha256"] = hashlib.sha256(image.tobytes()).hexdigest()
    result["colors"] = len(image.getcolors(pixels) or [])
    if not result["visible_bounds"]:
        result["errors"].append("Render is fully transparent")
    if result["colors"] <= 1:
        result["errors"].append("Render has at most one RGBA color")
    return result


def make_contact_sheets(repository, report_dir, countries, codes):
    """Create labeled diagnostic sheets from rendered source images."""
    names = {row["code"]: row.get("name", row["code"]) for row in countries}
    names["xx"] = "Unknown placeholder"
    sheets = []
    cell_width, cell_height, columns, rows = 360, 172, 3, 10
    ordered = sorted(codes)
    for offset in range(0, len(ordered), columns * rows):
        page_codes = ordered[offset:offset + columns * rows]
        sheet = Image.new("RGB", (columns * cell_width, 40 + cell_height * math.ceil(len(page_codes) / columns)), "#e9edf1")
        draw = ImageDraw.Draw(sheet)
        draw.text((12, 12), "SVG inspection: 4:3 left, 1:1 right; checkerboard = source transparency", fill="#182e40")
        for index, code in enumerate(page_codes):
            x, y = index % columns * cell_width, 40 + index // columns * cell_height
            draw.text((x + 10, y + 3), code.upper() + " | " + names.get(code, "Unknown"), fill="#182e40")
            for ratio, left, available_width in (("4x3", 10, 180), ("1x1", 205, 135)):
                path = report_dir / "renders" / ratio / (code + ".png")
                if not path.exists():
                    draw.text((x + left, y + 45), "RENDER MISSING", fill="red")
                    continue
                with Image.open(path) as source:
                    image = source.convert("RGBA")
                image.thumbnail((available_width, 135), Image.Resampling.LANCZOS)
                background = Image.new("RGBA", image.size, "white")
                checker = ImageDraw.Draw(background)
                for bx in range(0, image.width, 10):
                    for by in range(0, image.height, 10):
                        if (bx // 10 + by // 10) % 2:
                            checker.rectangle((bx, by, bx + 9, by + 9), fill="#c6cdd4")
                sheet.paste(Image.alpha_composite(background, image).convert("RGB"), (x + left, y + 25))
        target = report_dir / f"contact-sheet-{offset // (columns * rows) + 1:02d}.png"
        sheet.save(target)
        sheets.append(str(target.resolve()))
    return sheets


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=REPO)
    parser.add_argument("--report-dir", type=Path)
    parser.add_argument("--width", type=int, default=512)
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()
    if args.width <= 0 or args.workers <= 0:
        parser.error("width and workers must be positive")
    if not shutil.which("rsvg-convert"):
        parser.error("rsvg-convert is required")
    repository = args.repo.resolve()
    report_dir = args.report_dir or Path(tempfile.mkdtemp(prefix="flagcdn-svg-audit."))
    report_dir.mkdir(parents=True, exist_ok=True)
    countries = json.loads((repository / "data/country.json").read_text())
    expected_codes = {row["code"] for row in countries}
    expected_codes.add("xx")  # Explicit unknown-country fallback in the CSS icon set.
    inventory_errors, inventory = [], {}
    if len(countries) != len({row["code"] for row in countries}):
        inventory_errors.append("Duplicate country codes in data/country.json")
    php_countries = json.loads((repository / "apps/php/data/country.json").read_text())
    if {row["code"] for row in php_countries} != {row["code"] for row in countries}:
        inventory_errors.append("Root/PHP country codes differ")
    for data_file, rows in (("data/country.json", countries), ("apps/php/data/country.json", php_countries)):
        for row in rows:
            for ratio in ("1x1", "4x3"):
                field = "flag_" + ratio
                expected_path = f"flags/{ratio}/{row['code']}.svg"
                if row.get(field) != expected_path:
                    inventory_errors.append(f"{data_file}: country {row['code']} {field} points to {row.get(field)}, expected {expected_path}")
    records = []
    for tree in (Path("flags"), Path("apps/php/flags")):
        paths = sorted((repository / tree).rglob("*.svg"))
        inventory[str(tree)] = {"files": len(paths)}
        for ratio in ("1x1", "4x3"):
            codes = {path.stem for path in (repository / tree / ratio).glob("*.svg")}
            inventory[str(tree)][ratio] = {"codes": len(codes), "missing": sorted(expected_codes - codes),
                                          "extra": sorted(codes - expected_codes)}
            if codes != expected_codes:
                inventory_errors.append(str(tree / ratio) + " code inventory differs from country data and xx fallback")
        records.extend(parse_svg(path, repository) for path in paths)
    for site in (Path("."), Path("apps/php")):
        css = (repository / site / "css/flag-icons.min.css").read_text()
        references = CSS_URL.findall(css)
        for ratio in ("1x1", "4x3"):
            codes = [code for entry_ratio, code in references if entry_ratio == ratio]
            if set(codes) != expected_codes or len(codes) != len(set(codes)):
                inventory_errors.append(str(site / "css/flag-icons.min.css") + " code coverage or duplicate CSS URL problem")
        inventory[str(site / "css/flag-icons.min.css")] = {"backgrounds": len(references)}
    parity = []
    root_files = {str(path.relative_to(repository / "flags")): path for path in (repository / "flags").rglob("*.svg")}
    php_files = {str(path.relative_to(repository / "apps/php/flags")): path for path in (repository / "apps/php/flags").rglob("*.svg")}
    for relative in sorted(set(root_files) | set(php_files)):
        equal = relative in root_files and relative in php_files and digest(root_files[relative]) == digest(php_files[relative])
        parity.append({"file": relative, "identical": equal})
        if not equal:
            inventory_errors.append("Root/PHP source mismatch: " + relative)
    groups = {}
    for record in records:
        groups.setdefault(record["sha256"], []).append(record)
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {}
        for items in groups.values():
            representative = Path(items[0]["file"])
            if representative.parts[0] == "flags":
                destination = report_dir / "renders" / representative.relative_to("flags").with_suffix(".png")
            else:
                destination = report_dir / "php-renders" / representative.relative_to("apps/php/flags").with_suffix(".png")
            futures[executor.submit(render_svg, repository / representative, args.width, destination)] = items
        for number, future in enumerate(as_completed(futures), 1):
            rendering = future.result()
            for record in futures[future]:
                record["render"] = rendering
                record["errors"].extend(rendering["errors"])
                if record["file"].endswith("/np.svg") and rendering.get("fully_transparent_percent", 0) > 0:
                    record["notes"].append("Nepal's nonrectangular outline intentionally leaves transparent canvas")
                elif rendering.get("fully_transparent_percent", 0) > 0:
                    record["review"].append("Rectangular flag contains fully transparent pixels; inspect source edge geometry")
            if number % 100 == 0:
                print(f"Rendered {number}/{len(groups)} unique SVG byte streams", flush=True)
    records.sort(key=lambda item: item["file"])
    unique_records = [items[0] for items in groups.values()]
    contact_sheets = make_contact_sheets(repository, report_dir, countries, expected_codes)
    report = {"created_at": datetime.now(timezone.utc).isoformat(),
              "scope": "SVG technical integrity; flag-design authenticity requires separate source verification",
              "rsvg_version": subprocess.run(["rsvg-convert", "--version"], capture_output=True, text=True, check=True).stdout.strip(),
              "width": args.width, "inventory": inventory, "inventory_errors": inventory_errors,
              "summary": {"physical_svg_files": len(records), "unique_svg_streams": len(groups),
                          "render_runs": len(groups) * 2, "physical_files_with_errors": sum(bool(item["errors"]) for item in records),
                          "unique_files_with_errors": sum(bool(item["errors"]) for item in unique_records),
                          "unique_xml_error_files": sum(any(error.startswith(("Invalid XML", "Root must be SVG")) for error in item["errors"]) for item in unique_records),
                          "unique_render_error_files": sum(bool(item.get("render", {}).get("errors")) for item in unique_records),
                          "unique_missing_reference_files": sum(bool(item.get("unresolved_local_references")) for item in unique_records),
                          "missing_reference_targets": sum(len(item.get("unresolved_local_references", [])) for item in unique_records),
                          "files_requiring_paint_review": sum(any(value.startswith("Paint requires") for value in item["review"]) for item in unique_records),
                          "unique_files_requiring_review": sum(bool(item["review"]) for item in unique_records),
                          "source_pairs_compared": len(parity), "source_pair_mismatches": sum(not item["identical"] for item in parity)},
              "contact_sheets": contact_sheets, "parity": parity, "files": records}
    target = report_dir / "report.json"
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"report": str(target.resolve()), "summary": report["summary"], "inventory_errors": inventory_errors}, indent=2), flush=True)
    raise SystemExit(1 if inventory_errors or report["summary"]["physical_files_with_errors"] else 0)


if __name__ == "__main__":
    main()
