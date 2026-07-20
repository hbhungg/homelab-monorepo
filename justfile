# Homelab deploy commands. Run `just` (no args) to list recipes.

app-chart := "charts/homelab"

# List available recipes.
default:
    @just --list

# Deploy everything: infra + all apps.
deploy:
    @just deploy-infra
    @just deploy-apps

# First-time bootstrap: two-pass External Secrets install (CRDs before
# ExternalSecret resources), then all apps.
bootstrap:
    @echo "=== Bootstrap ==="
    @just _deps-infra
    @just _deploy-infra-core
    @echo "  bootstrapping external-secrets (CRDs first)..."
    helm upgrade --install external-secrets infra/external-secrets -f infra/external-secrets/values.yaml --set externalSecrets.enabled=false
    helm upgrade --install external-secrets infra/external-secrets -f infra/external-secrets/values.yaml
    @just deploy-apps

# Deploy all infrastructure charts.
deploy-infra:
    @echo "=== Infra ==="
    @just _deps-infra
    @just _deploy-infra-core
    helm upgrade --install external-secrets infra/external-secrets -f infra/external-secrets/values.yaml

# Deploy every app under apps/.
deploy-apps:
    #!/usr/bin/env bash
    set -euo pipefail
    echo "=== Apps ==="
    for dir in apps/*/; do
        [ -d "$dir" ] || continue
        just _deploy-app "$(basename "$dir")"
    done

# Deploy a single app by name (e.g. `just deploy-app postgres`).
deploy-app name:
    @just _deploy-app {{name}}

# (private) Build helm deps for every infra chart that declares any.
_deps-infra:
    #!/usr/bin/env bash
    set -euo pipefail
    for chart in infra/namespaces infra/cert-manager infra/external-secrets infra/monitoring infra/external-services; do
        just _build-deps "$chart"
    done

# (private) Build helm deps for a chart if its Chart.yaml declares dependencies.
_build-deps chart:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ -f "{{chart}}/Chart.yaml" ] && grep -q "^dependencies:" "{{chart}}/Chart.yaml" 2>/dev/null; then
        echo "  deps: {{chart}}"
        helm dependency build "{{chart}}" >/dev/null 2>&1 || echo "    (warning: dep build failed, continuing)"
    fi

# (private) Deploy the non-ESO infra charts in dependency order.
_deploy-infra-core:
    helm upgrade --install namespaces        infra/namespaces
    helm upgrade --install cert-manager      infra/cert-manager       -f infra/cert-manager/values.yaml
    helm upgrade --install external-services infra/external-services -f infra/external-services/values.yaml
    helm upgrade --install monitoring        infra/monitoring        -f infra/monitoring/values.yaml
    helm upgrade --install registry          {{app-chart}}           -f infra/registry/values.yaml

# (private) Deploy one app release from charts/homelab.
_deploy-app name:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -f "apps/{{name}}/values.yaml" ]; then
        echo "Unknown app: {{name}} (no apps/{{name}}/values.yaml)" >&2
        exit 1
    fi
    just _build-deps {{app-chart}}
    echo "  app: {{name}}"
    helm upgrade --install "{{name}}" {{app-chart}} -f "apps/{{name}}/values.yaml"
