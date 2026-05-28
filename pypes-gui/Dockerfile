FROM node:jod

# Install Python and venv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./

COPY . .

RUN npm install 
RUN npm run build

# Pre-provision the private Python environment for the translator
RUN python3 -m venv .pypes_venv && \
    .pypes_venv/bin/pip install "pype-schema"

EXPOSE 3333

CMD [ "npm", "run", "start" ]
