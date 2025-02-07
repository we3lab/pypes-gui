FROM python:3.10-slim as builder

ARG ssh_prv_key
ARG ssh_pub_key

ENV POETRY_VERSION=1.5.1

# Install ssh client
RUN apt-get update && \
    apt-get install -y git openssh-client g++ cmake libpq-dev ssh unixodbc unixodbc-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

#ssh
RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts && \
    echo "IdentityFile /root/.ssh/inflows_key" >> /root/.ssh/config && \
    echo "$ssh_prv_key" >> /root/.ssh/inflows_key && \
    echo "$ssh_pub_key" >> /root/.ssh/inflows_key.pub && \
    chmod 700 /root/.ssh/inflows_key && \
    chmod 700 /root/.ssh/inflows_key.pub && \
    pip install "poetry==$POETRY_VERSION"

WORKDIR /app
COPY . .

RUN poetry config experimental.system-git-client true && \
    poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-cache -vvv && \
    rm -rf /usr/local/src/energy_inflows

FROM python:3.10-slim

COPY --from=builder /app /app
COPY --from=builder /usr /usr

ENTRYPOINT ["python", "/app/main.py"]
