#!/bin/bash

export SSH_PRIVATE_KEY=$(cat ~/.ssh/inflows_key)
export SSH_PUBLIC_KEY=$(cat ~/.ssh/inflows_key.pub)
export NEXTAUTH_SECRET=local_test
export BACKEND_API=http://localhost:3333/api
export NEXT_PUBLIC_HOST=http://localhost
export NEXTAUTH_URL=http://localhost:3000

# Add these lines
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=stanford_local
export DB_USER=postgres
export DB_PASS=pwd12345

docker compose up --build
