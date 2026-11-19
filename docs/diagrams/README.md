# Pre-rendered diagrams

Mermaid images exported with `@mermaid-js/mermaid-cli` 11.17.1, for exports that
cannot render Mermaid themselves (PDF/Word submission copies). GitHub renders
the fenced blocks in the source docs directly, so these files are the fallback,
not the source of truth — edit the `.md`, then re-export.

| Rendered file | Source | Section |
| --- | --- | --- |
| `services-topology.svg` / `.png` | [`../future-health-challenge/SYSTEM_DIAGRAM.md`](../future-health-challenge/SYSTEM_DIAGRAM.md) | Services |
| `request-paths.svg` / `.png` | [`../future-health-challenge/SYSTEM_DIAGRAM.md`](../future-health-challenge/SYSTEM_DIAGRAM.md) | Request paths worth knowing |
| `privacy-by-design.svg` / `.png` | [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | 1 → Privacy by Design |
| `data-flow.svg` / `.png` | [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | 1 → High-Level Data Flow |
| `erd.svg` / `.png` | [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | 4 → Entity-Relationship Diagram (ERD) |

## Regenerating

Copy a fenced `mermaid` block from the source doc into `<name>.mmd`, then, from
this directory:

```bash
cat > puppeteer.json <<'JSON'
{ "executablePath": "/usr/bin/google-chrome",
  "args": ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] }
JSON

mmdc() {
  PUPPETEER_SKIP_DOWNLOAD=true npx -y @mermaid-js/mermaid-cli@11 \
    -i "$1.mmd" -o "$1.$2" -p puppeteer.json -b white ${3:-}
}

mmdc services-topology svg
mmdc services-topology png -s 2
```

Repeat for `request-paths`, `privacy-by-design`, `data-flow` and `erd`, swapping
the `-i` argument. `executablePath` matters on machines where mermaid-cli's own
Chromium download is skipped or unavailable; point it at any installed Chrome.
The SVG is the version to keep for print (sharp at any zoom); the PNG at
`-s 2` is for tools that only accept raster images.
