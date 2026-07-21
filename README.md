We are here: https://mfw.ddns.net

# Deploy

The repo is split into **infra/** (cluster plumbing) and **apps/** (your
workloads). Every app is a separate Helm release of the generic chart in
`charts/homelab/`, so you can upgrade one without touching the others.

```bash
just deploy                # deploy everything
just deploy-infra          # just infrastructure
just deploy-apps           # all apps
just deploy-app postgres   # one app
```

First-time bootstrap (ESO CRDs must exist before `externalSecrets` resources):

```bash
just bootstrap
```

## Secrets

Secrets live in Bitwarden Secrets Manager and are synced into the cluster by
External Secrets Operator (see `externalSecrets:` in
`infra/external-secrets/values.yaml`).
One-time bootstrap on a fresh cluster — put the machine-account token in place:

```bash
kubectl create secret generic bitwarden-access-token \
  --from-literal=token='<machine account access token>'
```

Then run `just bootstrap` (see above).

Note: rotating a secret in Bitwarden updates the k8s Secret within
`refreshInterval`, but pods only read env vars at startup — run
`kubectl rollout restart deploy/<app>` (or statefulset) to pick up changes.


# Local Services (*.home domains)

## Internal Services (Running in Kubernetes)

- **[homepage.home](http://homepage.home)** - Homepage dashboard (port 3000)
- **[metrics.home](http://metrics.home)** - Grafana metrics & monitoring dashboard
- **[registry.home](http://registry.home)** - Docker container registry (port 5000)
- **[registry-ui.home](http://registry-ui.home)** - Web UI for the registry (browse/delete images)
- **[wg.home](http://wg.home)** - WireGuard VPN management interface

## Direct Access (MetalLB LoadBalancer)

- **[postgres.home](postgres.home:5432)** - PostgreSQL on `192.168.0.241:5432`
  (MetalLB VIP; credentials in the `postgres-secret` k8s secret)
- **[redis.home](redis.home:6379)** - Redis on `192.168.0.242:6379` (MetalLB VIP)

## External Services (Proxied to external devices)

- **[router.home](http://router.home)** - Network router interface (192.168.0.1)
- **[snapmaker.home](http://snapmaker.home)** - Snapmaker 3D printer interface (192.168.0.68)
- **[k1max.home](http://k1max.home)** - K1 Max 3D printer interface (192.168.0.86:4408)
