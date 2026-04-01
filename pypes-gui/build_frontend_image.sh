#!/bin/bash
# For local docker build
# Use this to give permission: chmod +x build_frontend_image.sh
HOST_IP="127.0.0.1"
echo "Host IP: $HOST_IP"
echo "BACKEND_API: http://${HOST_IP}:3333/api"

docker build \
  --build-arg NEXTAUTH_SECRET="local_test" \
  --build-arg BACKEND_API="http://${HOST_IP}:3333/api" \
  -t energy-inflows_frontend_dev \
  -f Dockerfile \
  .
