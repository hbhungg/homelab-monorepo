import json
from pathlib import Path
import subprocess
from string import Template

subprocess.run(["bw", "sync"])

session_response = subprocess.run(
    ["bw", "unlock", "--raw"],
    stdout=subprocess.PIPE,
    text=True,
    stdin=None,
    stderr=None,
)
SESSION_KEY = session_response.stdout.strip()
ITEM_ID = "54b21eee-0bbc-488e-bad6-b38f003b1c4c"
secret_response = subprocess.run(
    ["bw", "get", "item", ITEM_ID, "--session", SESSION_KEY],
    stdout=subprocess.PIPE,
    text=True,
    check=True,
)
secrets = json.loads(secret_response.stdout)["fields"]
secrets_map = {r["name"]: r["value"] for r in secrets}
path = Path(__file__).parent

# Generate Helm secrets file
with open(path / "k3s-helm/values-secrets.template.yaml", "r") as f:
    template = f.read()
output = Template(template).safe_substitute(secrets_map)
with open(path / "k3s-helm/values-secrets.yaml", "w") as f:
    f.write(output)
