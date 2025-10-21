FROM node:20-slim AS node-base

RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    python3.11-venv \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY pyproject.toml uv.lock ./
RUN pip3 install uv && uv sync

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
