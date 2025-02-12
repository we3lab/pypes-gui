#!/bin/bash

export NEXTAUTH_SECRET=local_test
export BACKEND_API=http://localhost:3333/api
export NEXT_PUBLIC_HOST=http://localhost
export NEXTAUTH_URL=http://localhost:3000

docker compose up --build
