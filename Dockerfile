FROM node:20-slim AS node-base

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    python3.11-venv \
    curl \
    curl -LsSf https://astral.sh/uv/install.sh | sh \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY pyproject.toml README.md uv.lock ./
RUN uv sync

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
