FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Stage 1: Install production dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Stage 2: Bundle everything into a single file
FROM base AS prerelease
COPY --from=install /usr/src/app/node_modules node_modules
COPY serve.ts .
# This compiles serve.ts and its dependencies into a single output file
RUN bun build ./serve.ts --outfile=serve.js --target=bun

# Stage 3: The absolute smallest runtime footprint
FROM oven/bun:distroless AS release
WORKDIR /usr/src/app

# Notice: We do NOT copy node_modules here anymore!
COPY --from=prerelease /usr/src/app/serve.js .
COPY static static

USER nonroot
ENTRYPOINT [ "bun", "run", "serve.js" ]