#!/usr/bin/env python3
"""Generate raster flag-icon stylesheets from the unchanged SVG stylesheet.

Each generated stylesheet is a standalone replacement with the same selectors.
The 64px URL works without image-set(); supporting browsers can select 128px
images for higher pixel densities. Run with --check to validate without writes.
"""

import argparse
import os
from pathlib import Path
import re
import tempfile


FORMATS = ("png", "webp", "avif")
RULE = re.compile(r"([^{}]+)\{([^{}]*)\}")
SVG_BACKGROUND = re.compile(
    r"background-image:url\(\.\./flags/(1x1|4x3)/([a-z0-9-]+)\.svg\)"
)
URL = re.compile(r"url\(([^)]+)\)")


def render_stylesheet(template, css_dir, image_format):
    """Preserve selectors and layout declarations; replace every flag URL."""
    rules = list(RULE.finditer(template))
    if not rules or RULE.sub("", template).strip():
        raise ValueError("SVG stylesheet contains unsupported CSS structure")

    replaced = []
    seen = set()

    def replace_rule(match):
        selector, declarations = match.groups()
        if "background-image" not in declarations:
            if URL.search(declarations):
                raise ValueError(f"Unexpected image URL in selector {selector}")
            return match.group(0)
        background = SVG_BACKGROUND.fullmatch(declarations)
        if background is None:
            raise ValueError(f"Unexpected SVG background rule: {selector}")
        ratio, code = background.groups()
        expected_selector = f".fi-{code}" + (".fis" if ratio == "1x1" else "")
        if selector != expected_selector:
            raise ValueError(f"Flag selector does not match its image: {selector}")
        key = (ratio, code)
        if key in seen:
            raise ValueError(f"Duplicate flag rule: {selector}")
        seen.add(key)
        source = css_dir / f"../flags/{ratio}/{code}.svg"
        if not source.is_file():
            raise ValueError(f"Missing source SVG: {source}")
        normal = f"../{ratio}/64/{code}.{image_format}"
        dense = f"../{ratio}/128/{code}.{image_format}"
        for relative_path in (normal, dense):
            if not (css_dir / relative_path).is_file():
                raise ValueError(f"Missing raster image: {css_dir / relative_path}")
        replaced.append((selector, normal, dense))
        return (
            f"{selector}{{background-image:url({normal});"
            f"background-image:image-set(url({normal}) 1x,url({dense}) 2x)}}"
        )

    output = RULE.sub(replace_rule, template)
    if not replaced:
        raise ValueError("SVG stylesheet contains no flag background rules")
    rectangle_codes = {code for ratio, code in seen if ratio == "4x3"}
    square_codes = {code for ratio, code in seen if ratio == "1x1"}
    if rectangle_codes != square_codes:
        raise ValueError("4:3 and 1:1 stylesheets must cover the same flag codes")
    if ".svg" in output or len(URL.findall(output)) != 3 * len(replaced):
        raise ValueError("Not all SVG background URLs were converted")

    original_rules = [(rule[1], rule[2]) for rule in rules]
    generated_rules = RULE.findall(output)
    if [selector for selector, _ in original_rules] != [
        selector for selector, _ in generated_rules
    ]:
        raise ValueError("Generated stylesheet changed selectors or their order")
    expected_backgrounds = {
        selector: (
            f"background-image:url({normal});"
            f"background-image:image-set(url({normal}) 1x,url({dense}) 2x)"
        )
        for selector, normal, dense in replaced
    }
    for original, generated in zip(original_rules, generated_rules):
        selector, original_body = original
        expected_body = expected_backgrounds.get(selector, original_body)
        if generated[1] != expected_body:
            raise ValueError(f"Generated declarations differ: {selector}")
    return output, len(rectangle_codes), len(replaced), len(generated_rules)


def write_atomic(path, content):
    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", encoding="utf-8", newline="", dir=path.parent, delete=False
        ) as temporary_file:
            temporary_path = Path(temporary_file.name)
            temporary_file.write(content)
        temporary_path.chmod(0o644)
        os.replace(temporary_path, path)
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root", type=Path, default=Path(__file__).resolve().parents[1] / "apps/php"
    )
    parser.add_argument("--check", action="store_true", help="Check without writing")
    args = parser.parse_args()
    css_dir = args.root.resolve() / "css"
    template = (css_dir / "flag-icons.min.css").read_text(encoding="utf-8")
    # Validate every format before writing any generated stylesheet.
    outputs = [
        (image_format, *render_stylesheet(template, css_dir, image_format))
        for image_format in FORMATS
    ]
    for image_format, content, code_count, background_count, rule_count in outputs:
        path = css_dir / f"flag-icons-{image_format}.min.css"
        if args.check:
            if not path.is_file() or path.read_text(encoding="utf-8") != content:
                raise ValueError(f"Generated stylesheet needs rebuilding: {path}")
        else:
            write_atomic(path, content)
        print(
            f"{path.name}: {code_count} codes, {background_count} backgrounds, "
            f"{rule_count} rules, {background_count * 2} unique image URLs verified"
        )


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError) as error:
        raise SystemExit(str(error)) from error
