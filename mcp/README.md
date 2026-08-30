# Kamnev Apps remote MCP servers

These manifests describe four public Streamable HTTP endpoints hosted at `kamnevapps.com`. They are intentionally small and single-purpose.

| Server | Registry name | Remote endpoint |
| --- | --- | --- |
| Metadata Remover | `io.github.KamnevVladimir/metadata-remover` | `https://kamnevapps.com/mcp/metadata-remover` |
| SendShrink | `io.github.KamnevVladimir/sendshrink` | `https://kamnevapps.com/mcp/sendshrink` |
| Image Converter | `io.github.KamnevVladimir/image-converter` | `https://kamnevapps.com/mcp/image-converter` |
| YouTube Transcript | `io.github.KamnevVladimir/youtube-transcript` | `https://kamnevapps.com/mcp/youtube-transcript` |

The remote endpoint negotiates MCP and exposes a structured tool plus an interactive client workspace. Selected media bytes and pasted transcript content remain in that client workspace. Read each server README for precise limits.

Publishing targets the official MCP Registry preview. A committed manifest is not evidence that registry review or publication has completed.
