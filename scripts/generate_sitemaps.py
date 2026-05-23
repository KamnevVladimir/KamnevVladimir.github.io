#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path
from re import IGNORECASE, search
from xml.sax.saxutils import escape

BASE_URL = "https://kamnevvladimir.github.io"
EXCLUDED_PREFIXES = ("batchframe/",)
SITEMAP_FILENAME = "sitemap-pages.xml"


@dataclass(frozen=True)
class SitemapEntry:
    path: Path
    url: str


def relative_url(path: Path) -> str:
    parent = path.parent.as_posix()
    if parent == ".":
        return "/"
    return f"/{parent}/"


def html_attr(pattern: str, html: str) -> str | None:
    match = search(pattern, html, IGNORECASE)
    if not match:
        return None
    return match.group(1).strip()


def canonical_url(html: str) -> str | None:
    return html_attr(r"<link\s+rel=[\"']canonical[\"']\s+href=[\"']([^\"']+)[\"']", html)


def robots_content(html: str) -> str | None:
    return html_attr(r"<meta\s+name=[\"']robots[\"']\s+content=[\"']([^\"']+)[\"']", html)


def should_exclude(path: Path) -> bool:
    value = path.as_posix()
    return any(value.startswith(prefix) for prefix in EXCLUDED_PREFIXES)


def discover_entries(root: Path) -> list[SitemapEntry]:
    entries: list[SitemapEntry] = []
    for path in sorted(root.rglob("index.html")):
        if ".git" in path.parts:
            continue

        rel_path = path.relative_to(root)
        if should_exclude(rel_path):
            continue

        html = path.read_text(encoding="utf-8")
        robots = (robots_content(html) or "").lower()
        if "noindex" in robots:
            continue

        url = f"{BASE_URL}{relative_url(rel_path)}"
        canonical = canonical_url(html)
        if canonical and canonical.rstrip("/") != url.rstrip("/"):
            continue

        entries.append(SitemapEntry(path=rel_path, url=url))
    return sorted(entries, key=lambda entry: (entry.path.as_posix() != "index.html", entry.path.as_posix()))


def render_xml(entries: list[SitemapEntry]) -> str:
    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for entry in entries:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(entry.url)}</loc>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def metadata_errors(root: Path, entries: list[SitemapEntry]) -> list[str]:
    errors: list[str] = []
    for entry in entries:
        html = (root / entry.path).read_text(encoding="utf-8")

        canonical = canonical_url(html)
        if not canonical:
            errors.append(f"{entry.path}: missing canonical")
        elif canonical.rstrip("/") != entry.url.rstrip("/"):
            errors.append(f"{entry.path}: canonical {canonical} != {entry.url}")

        robots = robots_content(html)
        if not robots:
            errors.append(f"{entry.path}: missing robots")
        elif "noindex" in robots.lower() or "nofollow" in robots.lower():
            errors.append(f"{entry.path}: robots blocks indexing ({robots})")
    return errors


def write_if_changed(path: Path, content: str) -> bool:
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return False
    path.write_text(content, encoding="utf-8")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate the GitHub Pages sitemap.xml.")
    parser.add_argument("--check", action="store_true", help="Fail when generated sitemaps differ from files on disk.")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    entries = discover_entries(root)
    xml = render_xml(entries)

    sitemap_xml = root / SITEMAP_FILENAME

    if args.check:
        stale = []
        if not sitemap_xml.exists() or sitemap_xml.read_text(encoding="utf-8") != xml:
            stale.append(sitemap_xml.name)
        meta_errors = metadata_errors(root, entries)
        if stale:
            print(f"Stale sitemap files: {', '.join(stale)}", file=sys.stderr)
            print("Run: python3 scripts/generate_sitemaps.py", file=sys.stderr)
            return 1
        if meta_errors:
            print("Sitemap pages have incomplete SEO metadata:", file=sys.stderr)
            for error in meta_errors:
                print(f"- {error}", file=sys.stderr)
            return 1
        print(f"OK: {len(entries)} sitemap URLs")
        return 0

    changed = [sitemap_xml.name] if write_if_changed(sitemap_xml, xml) else []
    if changed:
        print(f"Updated {', '.join(changed)} with {len(entries)} URLs")
    else:
        print(f"Already up to date: {len(entries)} URLs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
