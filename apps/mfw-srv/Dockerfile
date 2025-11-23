# Builder
FROM ghcr.io/astral-sh/uv:python3.11-alpine AS builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
ENV UV_PYTHON_DOWNLOADS=0

WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev


# Runner
FROM python:3.11-alpine

RUN addgroup -S -g 1001 nonroot && \
    adduser -S -u 1001 -G nonroot nonroot

COPY --from=builder --chown=nonroot:nonroot /app /app

ENV PATH="/app/.venv/bin:$PATH"

USER nonroot

WORKDIR /app

EXPOSE 3000

CMD ["fastapi", "run", "--host", "0.0.0.0", "--proxy-headers", "--port", "3000", "main.py"]