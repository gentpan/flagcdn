#!/usr/bin/env python3
"""Compare every encoded flag to a fresh SVG render, including visible pixels.

Requires Pillow with PNG, WebP and AVIF decoders and rsvg-convert on PATH.
PNG pixels must match the source render exactly. Lossy formats are measured,
not required to be identical. Color errors are measured over both black and
white backgrounds so RGB values of fully transparent pixels cannot distort
the result. Alpha changes, missing files and dimension errors are failures.
The JSON report includes every file and flags lossy samples for visual review.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import json
import math
from pathlib import Path
import shutil
import subprocess
import tempfile
import time

from PIL import Image, ImageChops, ImageDraw, features
import PIL

REPO = Path(__file__).resolve().parents[1]
WIDTHS = (16, 24, 32, 48, 64, 128, 256, 512)
FORMATS = ("png", "webp", "avif")


def histogram_metrics(histogram):
    count = sum(histogram)
    if not count:
        return {"mae": 0.0, "mse": 0.0, "max_error": 0, "samples": 0}
    total = sum(i * n for i, n in enumerate(histogram))
    squares = sum(i * i * n for i, n in enumerate(histogram))
    maximum = max(i for i, n in enumerate(histogram) if n)
    return {"mae": total / count, "mse": squares / count,
            "max_error": maximum, "samples": count}


def color_histogram(reference, image):
    # Alpha-composited colors reflect what browsers actually display. Testing
    # opposite backgrounds also makes dark and light edge artifacts visible.
    histogram = [0] * 256
    for background in (0, 255):
        canvas = Image.new("RGBA", reference.size,
                           (background, background, background, 255))
        expected = Image.alpha_composite(canvas, reference).convert("RGB")
        actual = Image.alpha_composite(canvas, image).convert("RGB")
        channels = ImageChops.difference(expected, actual).histogram()
        for channel in range(3):
            for value, number in enumerate(channels[channel * 256:(channel + 1) * 256]):
                histogram[value] += number
    return histogram


def compare_job(site, source, width, report_dir, keep_references, require_lossless):
    relative = source.relative_to(site / "flags")
    ratio = relative.parts[0] if len(relative.parts) > 1 else "original"
    stem = source.stem
    reference_path = report_dir / "reference" / ratio / str(width) / (stem + ".png")
    reference_path.parent.mkdir(parents=True, exist_ok=True)
    command = ["rsvg-convert", "-w", str(width)]
    if ratio in ("1x1", "4x3"):
        command += ["-h", str(width if ratio == "1x1" else width * 3 // 4)]
    command += ["-a", str(source), "-o", str(reference_path)]
    try:
        subprocess.run(command, check=True, capture_output=True)
        with Image.open(reference_path) as rendered:
            reference = rendered.convert("RGBA")
    except Exception as exc:
        return {"source": str(relative), "width": width,
                "errors": ["Reference SVG render failed: " + str(exc)], "files": []}

    results = []
    for format in FORMATS:
        path = site / "raster" / ratio / str(width) / (stem + "." + format)
        result = {"file": str(path.relative_to(site)), "format": format,
                  "source": str(relative), "width": width,
                  "expected_size": list(reference.size), "errors": []}
        try:
            with Image.open(path) as encoded:
                encoded.load()
                result["detected_format"] = encoded.format.lower()
                image = encoded.convert("RGBA")
            if result["detected_format"] != format:
                result["errors"].append("File content does not match extension")
            result["actual_size"] = list(image.size)
            if image.size != reference.size:
                result["errors"].append("Dimensions differ from fresh source render")
                results.append(result)
                continue

            alpha_hist = ImageChops.difference(reference.getchannel("A"), image.getchannel("A")).histogram()
            result["alpha"] = histogram_metrics(alpha_hist)
            if result["alpha"]["max_error"]:
                result["errors"].append("Alpha channel differs from source render")
            result["identical_rgba"] = reference.tobytes() == image.tobytes()
            histogram = color_histogram(reference, image)
            result["visible_color"] = histogram_metrics(histogram)
            mse = result["visible_color"]["mse"]
            result["visible_color"]["psnr_db"] = 10 * math.log10(255 * 255 / mse) if mse else None
            result["changed_visible_sample_percent"] = (sum(histogram) - histogram[0]) * 100 / sum(histogram)
            if (format == "png" or require_lossless) and not result["identical_rgba"]:
                result["errors"].append("Lossless pixels differ from source render")
            # This is a review prompt, not a claim of a missing design element.
            result["visual_review_recommended"] = (
                format != "png" and (result["visible_color"]["mae"] > 8 or
                (result["visible_color"]["psnr_db"] is not None and result["visible_color"]["psnr_db"] < 30)))
        except Exception as exc:
            result["errors"].append("Missing or undecodable image: " + str(exc))
        results.append(result)

    if not keep_references:
        reference_path.unlink(missing_ok=True)
    return {"source": str(relative), "width": width, "errors": [], "files": results}


def summarize(records):
    summary = {}
    for format in FORMATS:
        items = [item for item in records if item["format"] == format]
        measured = [item for item in items if "visible_color" in item]
        samples = sum(item["visible_color"]["samples"] for item in measured)
        mae = sum(item["visible_color"]["mae"] * item["visible_color"]["samples"] for item in measured) / samples if samples else 0
        mse = sum(item["visible_color"]["mse"] * item["visible_color"]["samples"] for item in measured) / samples if samples else 0
        summary[format] = {
            "files": len(items), "measured_files": len(measured),
            "files_with_errors": sum(bool(item["errors"]) for item in items),
            "exact_rgba_matches": sum(item.get("identical_rgba", False) for item in items),
            "alpha_mismatches": sum(item.get("alpha", {}).get("max_error", 0) > 0 for item in items),
            "pixel_weighted_visible_mae": mae,
            "pixel_weighted_visible_psnr_db": 10 * math.log10(255 * 255 / mse) if mse else None,
            "visual_review_files": sum(item.get("visual_review_recommended", False) for item in items),
            "worst_by_mae": sorted(measured, key=lambda item: item["visible_color"]["mae"], reverse=True)[:8],
        }
    return summary


def contact_sheet(site, records, report_dir):
    chosen = []
    seen = set()
    for format in ("webp", "avif"):
        ranked = sorted((item for item in records if item["format"] == format and "visible_color" in item),
                        key=lambda item: item["visible_color"]["mae"], reverse=True)
        for item in ranked:
            # Avoid filling the sheet with eight resolutions of the same flag.
            if item["source"] in seen:
                continue
            chosen.append(item)
            seen.add(item["source"])
            if len(chosen) >= (3 if format == "webp" else 6):
                break
    if not chosen:
        return None
    cell_w, cell_h, head_h = 330, 255, 60
    sheet = Image.new("RGB", (cell_w * 3, head_h + cell_h * len(chosen)), "#e9edf1")
    draw = ImageDraw.Draw(sheet)
    for index, title in enumerate(("Fresh SVG render (PNG)", "WebP", "AVIF")):
        draw.text((index * cell_w + 12, 15), title, fill="#182e40")
    for row, selected in enumerate(chosen):
        ratio = selected["file"].split("/")[1]
        stem = Path(selected["source"]).stem
        width = selected["width"]
        reference_path = report_dir / "reference" / ratio / str(width) / (stem + ".png")
        for col, format in enumerate(FORMATS):
            path = reference_path if format == "png" else site / "raster" / ratio / str(width) / (stem + "." + format)
            with Image.open(path) as source:
                image = source.convert("RGBA")
            target_w = 288
            scale = min(target_w / image.width, 190 / image.height)
            image = image.resize((int(image.width * scale), int(image.height * scale)), Image.Resampling.NEAREST)
            x = col * cell_w + (cell_w - image.width) // 2
            y = head_h + row * cell_h + 43
            background = Image.new("RGBA", image.size, "white")
            if image.getextrema()[3][0] < 255:
                checker = ImageDraw.Draw(background)
                for bx in range(0, image.width, 12):
                    for by in range(0, image.height, 12):
                        if (bx // 12 + by // 12) % 2:
                            checker.rectangle((bx, by, bx + 11, by + 11), fill="#bfc8d1")
            sheet.paste(Image.alpha_composite(background, image).convert("RGB"), (x, y))
            draw.text((col * cell_w + 12, head_h + row * cell_h + 8),
                      f"{selected['source']} @ {width}px (nearest zoom)", fill="#182e40")
            record = next((item for item in records if item["source"] == selected["source"] and
                           item["width"] == width and item["format"] == format), None)
            if record and "visible_color" in record:
                metrics = record["visible_color"]
                label = f"MAE {metrics['mae']:.2f}/255"
                if metrics["psnr_db"] is not None:
                    label += f"; PSNR {metrics['psnr_db']:.1f} dB"
                draw.text((col * cell_w + 12, head_h + row * cell_h + 233), label, fill="#182e40")
    target = report_dir / "worst-samples.png"
    sheet.save(target)
    return str(target)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, default=REPO / "apps/php")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--widths", default=",".join(map(str, WIDTHS)))
    parser.add_argument("--codes", default="", help="Optional comma-separated source stems")
    parser.add_argument("--report-dir", type=Path)
    parser.add_argument("--keep-references", action="store_true")
    parser.add_argument("--require-lossless", action="store_true",
                        help="Require exact RGBA matches for WebP and AVIF as well as PNG")
    args = parser.parse_args()
    if args.workers < 1:
        parser.error("workers must be positive")
    widths = [int(value) for value in args.widths.split(",")]
    if any(width < 1 for width in widths):
        parser.error("widths must be positive")
    if not shutil.which("rsvg-convert"):
        parser.error("rsvg-convert is required")
    if not features.check("webp") or not features.check("avif"):
        parser.error("Pillow must include WebP and AVIF decoders")
    site = args.site.resolve()
    report_dir = args.report_dir or Path(tempfile.mkdtemp(prefix="flagcdn-pixel-audit."))
    report_dir = report_dir.resolve()
    report_dir.mkdir(parents=True, exist_ok=True)
    selected_codes = set(filter(None, args.codes.split(",")))
    sources = sorted((site / "flags").rglob("*.svg"))
    if selected_codes:
        sources = [source for source in sources if source.stem in selected_codes]
    if not sources:
        parser.error("No source SVGs found")
    jobs = [(source, width) for source in sources for width in widths]
    started = time.monotonic()
    records, reference_errors = [], []
    print(f"SVGs={len(sources)} renders={len(jobs)} comparisons={len(jobs) * len(FORMATS)} report={report_dir}", flush=True)
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = [executor.submit(compare_job, site, source, width, report_dir,
                                    args.keep_references, args.require_lossless) for source, width in jobs]
        for number, future in enumerate(as_completed(futures), 1):
            result = future.result()
            records.extend(result["files"])
            if result["errors"]:
                reference_errors.append(result)
            if number % 250 == 0 or number == len(jobs):
                print(f"progress={number}/{len(jobs)} elapsed={time.monotonic() - started:.1f}s", flush=True)
    records.sort(key=lambda item: item["file"])
    selected_files = {item["file"] for item in records}
    unexpected = []
    if not selected_codes and set(widths) == set(WIDTHS):
        unexpected = sorted(str(path.relative_to(site)) for path in (site / "raster").rglob("*")
                            if path.is_file() and path.suffix[1:] in FORMATS and str(path.relative_to(site)) not in selected_files)
    summary = summarize(records)
    sheet = contact_sheet(site, records, report_dir) if args.keep_references else None
    report = {
        "created_at": datetime.now(timezone.utc).isoformat(), "site": str(site),
        "pillow_version": PIL.__version__, "svg_count": len(sources), "widths": widths,
        "require_lossless": args.require_lossless,
        "comparisons": len(records), "reference_errors": reference_errors,
        "unexpected_raster_files": unexpected, "elapsed_seconds": time.monotonic() - started,
        "measurement": "8-bit RGB absolute differences after alpha compositing onto both black and white; MAE pixel-weighted; PNG requires exact RGBA; lossy review threshold MAE>8 or PSNR<30dB",
        "summary": summary, "contact_sheet": sheet, "files": records,
    }
    path = report_dir / "report.json"
    path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    compact = {format: {key: value for key, value in detail.items() if key != "worst_by_mae"}
               for format, detail in summary.items()}
    print(json.dumps({"summary": compact, "report": str(path), "contact_sheet": sheet}, indent=2), flush=True)
    failures = len(reference_errors) + len(unexpected) + sum(bool(item["errors"]) for item in records)
    raise SystemExit(1 if failures else 0)


if __name__ == "__main__":
    main()
