FROM node:jod

# Install Python, venv, and system libraries needed by EPANET binaries
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv libc6 libgcc1 libstdc++6 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./

COPY . .

RUN npm install 
RUN npm run build

# Setup standalone runtime
# Next.js standalone requires copying public and static files manually
RUN cp -r public .next/standalone/public && \
    cp -r .next/static .next/standalone/.next/static

# Pre-provision the private Python environment for the translator inside standalone
RUN python3 -m venv .next/standalone/.pypes_venv && \
    .next/standalone/.pypes_venv/bin/pip install "pype-schema"

WORKDIR /app/.next/standalone

ENV PORT=3333
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

EXPOSE 3333

# Start the standalone server directly
CMD ["node", "server.js"]
