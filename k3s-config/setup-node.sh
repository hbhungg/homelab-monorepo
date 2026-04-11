#!/bin/bash
# Setup script for new k3s worker nodes
# Usage: ./setup-node.sh

set -e

echo "Setting up k3s node configuration..."

# Copy registries.yaml
echo "Installing registries.yaml..."
sudo cp registries.yaml /etc/rancher/k3s/registries.yaml
sudo chmod 644 /etc/rancher/k3s/registries.yaml

# Add hosts entries
echo "Adding /etc/hosts entries..."
if ! grep -q "registry.home" /etc/hosts; then
    cat hosts-additions.txt | sudo tee -a /etc/hosts
else
    echo "/etc/hosts already contains registry.home entry"
fi

echo "Configuration complete!"
echo "Please restart the k3s service:"
echo "  Control plane: sudo systemctl restart k3s"
echo "  Worker node:   sudo systemctl restart k3s-agent"
