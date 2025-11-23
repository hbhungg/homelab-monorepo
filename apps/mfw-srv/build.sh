#!/bin/bash
set -e

docker build -f Dockerfile -t registry.home/mfw-srv:latest .
docker push registry.home/mfw-srv:latest