FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# serve.ts has no runtime npm dependencies — it only imports a local HTML
# file, which Bun resolves natively at runtime. So we skip the install +
# bundling stages entirely and run the .ts directly. Tiny image, no build step.
FROM oven/bun:distroless AS release
WORKDIR /usr/src/app
COPY serve.ts .
COPY static static

USER nonroot
ENTRYPOINT [ "bun", "run", "serve.ts" ]
