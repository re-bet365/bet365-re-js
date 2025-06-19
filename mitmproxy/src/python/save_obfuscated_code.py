#!/usr/bin/env python3

import os
import shutil
from pathlib import Path

project_dir = (Path(__file__).parent / "../../..").resolve()
output_dir = project_dir / "output"
obfuscated_dir = project_dir / "mitmproxy/src/javascript/obfuscated"
obfuscated_file = project_dir / "mitmproxy/src/javascript/obfuscated-new-raw.js"

print("project_dir: " + str(project_dir))


def find_first_obfuscated_js():
    """Find first JavaScript file containing '(function(){' pattern."""
    try:
        for file in output_dir.glob("*.js"):
            with open(file, "r", encoding="utf-8") as f:
                content = f.read()
                if content.startswith("(function(){"):
                    return file
    except Exception as e:
        print(f"Error processing files: {e}")
    return None


def copy_obfuscated_js():
    target_file = obfuscated_dir / first_obfuscated_js_file.name
    shutil.copy2(first_obfuscated_js_file, target_file)
    if os.path.lexists(obfuscated_file):
        os.unlink(obfuscated_file)
    os.symlink(target_file, obfuscated_file)


if __name__ == "__main__":
    first_obfuscated_js_file = find_first_obfuscated_js()
    if first_obfuscated_js_file:
        print(f"Found matching file: {first_obfuscated_js_file}")
        copy_obfuscated_js()
    else:
        print("No JavaScript files with '(function(){' pattern found in output directory")
