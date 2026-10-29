# Windows PowerShell Container Sandbox Runner
param(
    [string]$DocsDir = "$PWD\docs",
    [string]$Engine = "docker"
)
if (!(Test-Path $DocsDir)) { New-Item -ItemType Directory -Path $DocsDir | Out-Null }
& $Engine run --rm `
  --network=none `
  --read-only `
  --user 10001:10001 `
  --cap-drop=ALL `
  --security-opt=no-new-privileges:true `
  -v "${DocsDir}:/workspace/docs:rw" `
  architect-skill-sandbox:latest
