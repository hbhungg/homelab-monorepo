We are here: https://mfw.ddns.net

# 1. Pull secrets from Bitwarden
python pull_secrets.py
# 2. Deploy with secrets
helm upgrade --install homelab ./k3s-helm -f ./k3s-helm/values-secrets.yaml


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
