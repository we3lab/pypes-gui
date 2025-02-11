FROM python:3.10-slim AS builder

ENV POETRY_VERSION=2.0.0

# Install ssh client
RUN apt-get update && \
    apt-get install -y git openssh-client g++ cmake libpq-dev ssh unixodbc unixodbc-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

#ssh
RUN mkdir -p /root/.ssh && \
    chmod 0700 /root/.ssh && \
    pip install "poetry==$POETRY_VERSION"

WORKDIR /app
COPY . .

RUN poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-cache -vvv

FROM python:3.10-slim

COPY --from=builder /app /app
COPY --from=builder /usr /usr

ENTRYPOINT ["python", "/app/main.py"]
