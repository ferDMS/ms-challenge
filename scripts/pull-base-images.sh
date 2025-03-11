#!/bin/bash
# filepath: /Users/pez/repos/PROFESIONAL/6/ms-challenge/pull-base-images.sh
# Script to manually pull all required base Docker images

echo "Pulling required Docker base images..."
docker pull node:22-alpine
docker pull python:3.9-slim

echo "Base images pulled successfully!"
echo "You can now run 'docker-compose up' or 'docker-compose -f docker-compose.dev.yml up'"