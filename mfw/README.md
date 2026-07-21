# mfw

Personal site served at <https://mfw.ddns.net>. A tiny [Bun](https://bun.com)
server (`serve.ts`) serving `static/index.html`.

## Run locally

```bash
bun install
bun run dev
```

## Deploy

```bash
./deploy.sh            # build + push image to registry.home
just deploy-app mfw    # from repo root, roll out to the cluster
```
