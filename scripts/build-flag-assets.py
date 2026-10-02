#!/usr/bin/env python3
"""Build every flag variant, then package SVG/PNG/WebP/AVIF release archives."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile

REPO = Path(__file__).resolve().parents[1]
SITE = REPO / "apps/php"
SIZES = [16, 24, 32, 48, 64, 128, 256, 512]
FORMATS = ["png", "webp", "avif"]


def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def render_original(source, width):
    output = SITE / "raster/original" / str(width)
    output.mkdir(parents=True, exist_ok=True)
    png = output / (source.stem + ".png")
    run("rsvg-convert", "-w", str(width), "-a", str(source), "-o", str(png))
    run("cwebp", "-lossless", "-exact", "-q", "90", "-quiet", "-m", "6", str(png), "-o", str(png.with_suffix(".webp")))
    run("avifenc", "--lossless", "-j", "2", "-s", "6", str(png), str(png.with_suffix(".avif")))


def package(name, entries, manifest, readme):
    target = SITE / "download" / name
    # Readers continue to get the previous complete archive during a rebuild.
    with tempfile.NamedTemporaryFile(dir=target.parent, suffix=".zip", delete=False) as temp:
        temporary = Path(temp.name)
    try:
        with zipfile.ZipFile(temporary, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
            for path, entry in entries:
                archive.write(path, entry)
            archive.write(REPO / "LICENSE", "LICENSE")
            archive.writestr("README.txt", readme)
            archive.writestr("assets-manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
        with zipfile.ZipFile(temporary) as archive:
            bad = archive.testzip()
            if bad:
                raise RuntimeError("ZIP integrity failed: " + bad)
        temporary.replace(target)
        target.chmod(0o644)
    finally:
        temporary.unlink(missing_ok=True)
    return {"file": name, "bytes": target.stat().st_size, "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--package-only", action="store_true", help="Validate and package existing exports without regenerating")
    args = parser.parse_args()
    if args.workers < 1:
        parser.error("workers must be positive")
    originals = sorted((SITE / "flags").glob("*.svg"))
    if not args.package_only:
        # Rebuild old lossy exports even when their file headers look valid.
        subprocess.run(["go", "run", "./cmd/rastergen", "-root", str(SITE), "-workers", str(args.workers), "-skip-existing=false"], cwd=REPO, check=True)
        with ThreadPoolExecutor(max_workers=min(args.workers, 4)) as pool:
            list(pool.map(lambda job: render_original(*job), [(p, w) for p in originals for w in SIZES]))
    subprocess.run(["go", "run", "./cmd/rastergen", "-root", str(SITE), "-verify"], cwd=REPO, check=True)
    # File signatures are insufficient: gate release packaging on exact pixels.
    with tempfile.TemporaryDirectory(prefix="flagcdn-release-validation.") as report_dir:
        subprocess.run(["python3", str(REPO / "scripts/validate-flag-images.py"), "--site", str(SITE), "--workers", str(min(args.workers, 8)), "--require-lossless", "--report-dir", report_dir], check=True)
        report = json.loads((Path(report_dir) / "report.json").read_text())
        validation = {
            "created_at": report["created_at"],
            "svg_count": report["svg_count"],
            "comparisons": report["comparisons"],
            "require_lossless": True,
            "pillow_version": report["pillow_version"],
            "summary": {format: {key: value for key, value in detail.items() if key != "worst_by_mae"} for format, detail in report["summary"].items()},
        }
    subprocess.run(["python3", str(REPO / "scripts/build-flag-css.py")], check=True)

    entries = {format: [] for format in ["svg", *FORMATS]}
    for source in sorted((SITE / "flags").rglob("*.svg")):
        relative = source.relative_to(SITE / "flags")
        entry = "svg/" + str(relative if len(relative.parts) > 1 else Path("original") / relative)
        entries["svg"].append((source, entry))
    for source in sorted((SITE / "raster").rglob("*")):
        if source.is_file() and source.suffix[1:] in FORMATS:
            format = source.suffix[1:]
            entries[format].append((source, format + "/" + str(source.relative_to(SITE / "raster"))))

    expected = len(entries["svg"]) * len(SIZES)
    for format in FORMATS:
        if len(entries[format]) != expected:
            raise RuntimeError(f"Incomplete {format}: expected {expected}, got {len(entries[format])}")
    manifest = {
        "repository": "https://github.com/gentpan/flagcdn",
        "svg_count": len(entries["svg"]),
        "flag_codes": len({p.stem for p, _ in entries["svg"]}),
        "widths": SIZES,
        "ratios": ["1x1", "4x3"],
        "original_variants": len(originals),
        "encoding": {"png": "lossless", "webp": "lossless-exact", "avif": "lossless-rgb"},
        "asset_revision": "lossless-1",
        "validation": validation,
        "format_counts": {format: len(items) for format, items in entries.items()},
        "raster_count": sum(len(entries[format]) for format in FORMATS),
        "file_hashes": {entry: hashlib.sha256(path.read_bytes()).hexdigest() for items in entries.values() for path, entry in items},
    }
    readme = (
        "flagcdn.io flag assets\nRepository: https://github.com/gentpan/flagcdn\n"
        "SVG sources originate from lipis/flag-icons (MIT), with additional variants.\n"
        "Widths: " + ", ".join(map(str, SIZES)) + " px.\n"
        "1x1 and 4x3 variants retain those ratios. original/ preserves native SVG proportions.\n"
        "SVG/PNG/WebP/AVIF are under separate format directories.\n"
        "All raster formats are lossless. Every decoded RGBA pixel is verified against a fresh SVG render before packaging.\n"
        "assets-manifest.json lists exact counts and SHA-256 hashes.\n"
    )
    summaries = [package(f"flags-{format}.zip", items, manifest, readme) for format, items in entries.items()]
    all_entries = [entry for items in entries.values() for entry in items]
    summaries.append(package("flags-all-formats.zip", all_entries, manifest, readme))
    (SITE / "download/assets-manifest.json").write_text(json.dumps({**{k:v for k,v in manifest.items() if k != "file_hashes"}, "archives": summaries}, indent=2) + "\n")
    print(json.dumps({k:v for k,v in manifest.items() if k != "file_hashes"}, indent=2))
    print(json.dumps(summaries, indent=2))


if __name__ == "__main__":
    main()
