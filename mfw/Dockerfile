FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Stage 1: Bundle serve.ts → a single serve.js (precompiled, no runtime transpile).
# Override the .html loader to "text" so index.html is inlined as a string
# (matching `import index from "./static/index.html"`), instead of being
# treated as an HTML entrypoint whose asset output collides with serve.js.
FROM base AS bundle
COPY serve.ts .
COPY static static
RUN bun build ./serve.ts --outfile=serve.js --target=bun --loader .html:text

# Stage 2: Minimal runtime. serve.js has index.html inlined; static/ ships
# only for the runtime Bun.file("./static/favicon.ico") read.
FROM oven/bun:distroless AS release
WORKDIR /usr/src/app
COPY --from=bundle /usr/src/app/serve.js .
COPY static static

USER nonroot
ENTRYPOINT [ "bun", "run", "serve.js" ]
