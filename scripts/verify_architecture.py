#!/usr/bin/env python3
"""Verify the first Agent OS plugin architecture slice."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "plugins" / "agent-os"
SKILL = PLUGIN / "skills" / "execute-linear-issue"

REQUIRED_FILES = (
    ROOT / ".agents" / "plugins" / "marketplace.json",
    ROOT / "AGENTS.md",
    ROOT / "docs" / "architecture.md",
    PLUGIN / ".codex-plugin" / "plugin.json",
    SKILL / "SKILL.md",
    SKILL / "agents" / "openai.yaml",
    SKILL / "references" / "authority-policy.md",
    SKILL / "references" / "completion-checkpoint.md",
    SKILL / "references" / "github-privacy.md",
    SKILL / "references" / "implementation-lifecycle.md",
)


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)


def main() -> int:
    failures: list[str] = []

    for path in REQUIRED_FILES:
        if not path.is_file():
            fail(f"missing required file: {path.relative_to(ROOT)}", failures)

    marketplace_path = ROOT / ".agents" / "plugins" / "marketplace.json"
    plugin_path = PLUGIN / ".codex-plugin" / "plugin.json"

    if marketplace_path.is_file():
        marketplace = json.loads(marketplace_path.read_text())
        if marketplace.get("name") != "agent-os":
            fail("marketplace name must be agent-os", failures)
        entries = marketplace.get("plugins", [])
        if len(entries) != 1 or entries[0].get("name") != "agent-os":
            fail("marketplace must expose exactly one agent-os plugin", failures)
        elif entries[0].get("source", {}).get("path") != "./plugins/agent-os":
            fail("marketplace plugin path must be ./plugins/agent-os", failures)

    if plugin_path.is_file():
        manifest = json.loads(plugin_path.read_text())
        if manifest.get("name") != "agent-os":
            fail("plugin manifest name must be agent-os", failures)
        if manifest.get("skills") != "./skills/":
            fail("plugin manifest must expose ./skills/", failures)
        for unsupported in ("apps", "mcpServers", "hooks"):
            if unsupported in manifest:
                fail(f"plugin manifest must not declare absent {unsupported}", failures)

    text_files = [path for path in ROOT.rglob("*") if path.is_file() and ".git" not in path.parts]
    placeholder = re.compile(r"\[TODO:|\bTODO\b")
    private_identifier = re.compile(r"\b(?:RIC|AOS)-\d+\b")
    private_url = re.compile(r"https://linear\.app/")

    for path in text_files:
        if path.resolve() == Path(__file__).resolve():
            continue
        try:
            content = path.read_text()
        except UnicodeDecodeError:
            continue
        relative = path.relative_to(ROOT)
        if placeholder.search(content):
            fail(f"placeholder remains in {relative}", failures)
        if private_identifier.search(content):
            fail(f"real private task identifier appears in {relative}", failures)
        if private_url.search(content):
            fail(f"private Linear URL appears in {relative}", failures)

    if failures:
        print("Architecture verification failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Architecture verification passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
