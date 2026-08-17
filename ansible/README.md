# ansible

Node-level config management for the k3s cluster (`ubuntu` = control plane,
`pi-1` = worker). Agentless — runs over SSH from your Mac.

## Prerequisites

```bash
brew install ansible
ssh-copy-id wren@192.168.0.201   # if not already done
ssh-copy-id wren@192.168.0.200
```

## Usage

Run from anywhere via `just` (see repo root justfile), or directly:

```bash
cd ansible
ansible-playbook playbooks/nodes.yaml          # converge node config
ansible-playbook playbooks/nodes.yaml -l pi-1  # one node only
ansible all -m ping                            # connectivity check
ansible all -a uptime                          # ad-hoc command
```

## Playbooks

| Playbook | Purpose |
|---|---|
| `nodes.yaml` | Base packages, `registries.yaml`, `/etc/hosts` (replaces the old `k3s-config/setup-node.sh`) |
| `rename-node.yaml` | Rename a node (hostname + k8s re-register) |
| `upgrade-os.yaml` | `apt dist-upgrade` + reboot if needed, one node at a time |
| `k3s-install.yaml` | Install k3s server/agent on fresh nodes |

`files/registries.yaml` is the single source of truth for k3s registry mirror
config (previously lived in the now-removed `k3s-config/`).
