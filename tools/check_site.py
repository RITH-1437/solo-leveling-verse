"""Static integrity check for Solo Leveling Verse.

    python tools/check_site.py

Checks, without a browser:
  * the site root holds only index.html; every other page lives in html/
  * every local href/src in the HTML pages points at an existing file
    (resolved from the page's own folder, so html/ pages need ../)
  * page links built in JS (SLV.page("archive.html#…")) name real pages
  * every page loads the same data/core script order
  * every path in js/media-index.js exists on disk
  * the data layer loads in Node and SLV.validate() reports no broken ids
    (skipped with a note if `node` is not installed)
Exits non-zero when anything fails.
"""
from pathlib import Path
import json
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
PAGES = ["index.html", "html/archive.html", "html/hunters.html", "html/timeline.html", "html/network.html"]
CORE = ["js/data/world.js", "js/data/characters.js", "js/data/monarchs.js", "js/data/shadows.js",
        "js/data/gates.js", "js/data/items.js", "js/data/skills.js", "js/data/timeline.js",
        "js/media-index.js", "js/core.js", "js/viewer.js", "js/shell.js"]

NODE_CHECK = r"""
global.window = global; global.localStorage = { getItem(){return null}, setItem(){} };
global.document = { documentElement: { classList: { toggle(){} } } };
global.matchMedia = () => ({ matches: false });
const files = process.argv.slice(1);
for (const f of files) require(f);
const api = global.SLV;
const problems = api.validate();
const ids = api.all.map(e => e.id);
console.log(JSON.stringify({ entities: ids.length, problems }));
"""


def main():
    errors = []
    stray = sorted(p.name for p in ROOT.glob("*.html") if p.name != "index.html")
    if stray:
        errors.append("root: only index.html belongs at the root, move to html/: " + ", ".join(stray))
    for page in PAGES:
        path = ROOT / page
        if not path.exists():
            errors.append(f"{page}: page missing")
            continue
        html = path.read_text(encoding="utf-8")
        for ref in re.findall(r'(?:href|src)="([^"#?:]+)(?:[#?][^"]*)?"', html):
            if ref.startswith(("http", "//", "mailto")) or ref == "":
                continue
            if not (path.parent / ref).resolve().exists():
                errors.append(f"{page}: missing {ref}")
        scripts = [(path.parent / re.sub(r'\.min\.js$', '.js', s)).resolve() for s in re.findall(r'<script src="([^"]+)"', html)]
        if scripts[: len(CORE)] != [(ROOT / c).resolve() for c in CORE]:
            errors.append(f"{page}: script order differs from the shared core list")

    # page names used by the JS link builders resolve to html/<name> (or index.html at the root)
    for js in sorted((ROOT / "js").glob("*.js")):
        src = js.read_text(encoding="utf-8")
        for name in set(re.findall(r'["`]((?:index|archive|hunters|timeline|network)\.html)', src)):
            target = ROOT / name if name == "index.html" else ROOT / "html" / name
            if not target.exists():
                errors.append(f"js/{js.name}: links to {name}, but {target.relative_to(ROOT)} is missing")

    idx = (ROOT / "js" / "media-index.js").read_text(encoding="utf-8")
    listed = json.loads(idx[idx.index("["): idx.rindex("]") + 1])
    for p in listed:
        if not (ROOT / p).exists():
            errors.append(f"media-index: {p} does not exist (run tools/build_media_index.py)")

    node = shutil.which("node")
    if node:
        files = [str(ROOT / f) for f in CORE if "viewer" not in f and "shell" not in f]
        res = subprocess.run([node, "-e", NODE_CHECK, *files], capture_output=True, text=True)
        if res.returncode:
            errors.append("node data check failed:\n" + res.stderr.strip())
        else:
            info = json.loads(res.stdout.strip().splitlines()[-1])
            print(f"data: {info['entities']} entities")
            errors += [f"data: {p}" for p in info["problems"]]
    else:
        print("note: node not found, data reference check skipped")

    if errors:
        print("\n".join(errors))
        print(f"FAILED ({len(errors)} problems)")
        sys.exit(1)
    print(f"OK: {len(PAGES)} pages, {len(listed)} media files, no broken references")


if __name__ == "__main__":
    main()
