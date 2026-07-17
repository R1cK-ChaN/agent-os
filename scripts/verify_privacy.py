#!/usr/bin/env python3
"""Reject private task metadata and obvious credential artifacts."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PRIVATE_IDENTIFIER = re.compile(r"\b(?:RIC|AOS)-\d+\b")
PRIVATE_URL = re.compile(r"https://linear\.app/")
FORBIDDEN_CREDENTIAL_FILES = {
    ".env",
    ".env.local",
    ".env.production",
    ".git-credentials",
    "credentials.json",
    "id_ed25519",
    "id_rsa",
    "service-account.json",
}
SECRET_MARKERS = (
    "-----BEGIN PRIVATE KEY-----",
    "-----BEGIN OPENSSH PRIVATE KEY-----",
)


def indexed_paths() -> list[Path]:
    """Return tracked files plus staged additions and modifications."""
    paths: set[Path] = set()
    commands = (
        ("ls-files", "-z"),
        ("diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"),
    )
    for arguments in commands:
        result = subprocess.run(
            ("git", *arguments),
            cwd=ROOT,
            check=True,
            capture_output=True,
        )
        paths.update(
            Path(value.decode(errors="surrogateescape"))
            for value in result.stdout.split(b"\0")
            if value
        )
    return sorted(paths)


def main() -> int:
    failures: list[str] = []
    for relative in indexed_paths():
        path = ROOT / relative
        if path.name in FORBIDDEN_CREDENTIAL_FILES:
            failures.append(f"credential artifact is tracked: {relative}")
            continue
        if not path.is_file() or path.is_symlink():
            continue
        if path.resolve() == Path(__file__).resolve():
            continue
        try:
            content = path.read_text()
        except UnicodeDecodeError:
            continue
        if PRIVATE_IDENTIFIER.search(content):
            failures.append(f"private task identifier appears in {relative}")
        if PRIVATE_URL.search(content):
            failures.append(f"private tracker URL appears in {relative}")
        if any(marker in content for marker in SECRET_MARKERS):
            failures.append(f"private key material appears in {relative}")

    if failures:
        print("Privacy verification failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Privacy verification passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
