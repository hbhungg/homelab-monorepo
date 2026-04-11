#!/bin/bash
set -e

IMAGE="registry.home/mfw:latest"

echo "Building $IMAGE..."
docker build -t "$IMAGE" .

echo "Pushing to registry..."
docker push "$IMAGE"

echo "Done! Deployed $IMAGE"
