We are here: https://mfw.ddns.net

# Deploy

```bash
helm dependency build ./k3s-helm
helm upgrade --install homelab ./k3s-helm
```

## Secrets

Secrets live in Bitwarden Secrets Manager and are synced into the cluster by
External Secrets Operator (see `externalSecrets:` in `k3s-helm/values.yaml`).
One-time bootstrap on a fresh cluster — put the machine-account token in place:

```bash
kubectl create secret generic bitwarden-access-token \
  --from-literal=token='<machine account access token>'
```

On the very first deploy (before the ESO CRDs exist), install in two passes:

```bash
helm upgrade --install homelab ./k3s-helm --set externalSecrets.enabled=false
helm upgrade --install homelab ./k3s-helm
```

Note: rotating a secret in Bitwarden updates the k8s Secret within
`refreshInterval`, but pods only read env vars at startup — run
`kubectl rollout restart deploy/<app>` (or statefulset) to pick up changes.


# Local Services (*.home domains)

## Internal Services (Running in Kubernetes)

- **[homepage.home](http://homepage.home)** - Homepage dashboard (port 3000)
- **[metrics.home](http://metrics.home)** - Grafana metrics & monitoring dashboard
- **[registry.home](http://registry.home)** - Docker container registry (port 5000)
- **[wg.home](http://wg.home)** - WireGuard VPN management interface

## External Services (Proxied to external devices)

- **[router.home](http://router.home)** - Network router interface (192.168.0.1)
- **[snapmaker.home](http://snapmaker.home)** - Snapmaker 3D printer interface (192.168.0.68)
- **[k1max.home](http://k1max.home)** - K1 Max 3D printer interface (192.168.0.86:4408)
