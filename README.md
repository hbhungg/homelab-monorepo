We are here: https://mfw.ddns.net

# 1. Pull secrets from Bitwarden
python pull_secrets.py
# 2. Deploy with secrets
helm upgrade --install homelab ./k3s-helm -f ./k3s-helm/values-secrets.yaml