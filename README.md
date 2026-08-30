# Kamnev Apps GitHub Pages

Static GitHub Pages site for App Store support, privacy, and marketing pages.

## Developer tools

- Public MCP manifests and implementation notes: [`mcp/`](mcp/)
- Human-readable MCP and embed documentation: `https://kamnevvladimir.github.io/developer-tools/`
- Canonical browser tools: `https://kamnevapps.com/tools/`

The MCP entries describe four public Streamable HTTP endpoints. Their interactive media and transcript workspaces run in the client; the manifests state the privacy boundary and limitations rather than promising server-side file processing.

## Sitemap

Regenerate the submitted XML sitemap after adding, removing, or moving public pages:

```sh
python3 scripts/generate_sitemaps.py
python3 scripts/generate_sitemaps.py --check
```

The generator scans public `index.html` pages and skips legacy aliases whose canonical URL points elsewhere. Submit only `https://kamnevvladimir.github.io/google-sitemap.xml` in Google Search Console.

## Expiry Keeper: Documents

- Portfolio: `https://kamnevvladimir.github.io/`
- Marketing: `https://kamnevvladimir.github.io/expiry-keeper/`
- Privacy: `https://kamnevvladimir.github.io/expiry-keeper/privacy/`
- Support: `https://kamnevvladimir.github.io/expiry-keeper/support/`

Legacy root-level `/privacy/` and `/support/` pages remain available for App Store compatibility.
