# Vite dev server for local / dev-env compose (browser talks to API on host-published ports).
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV VITE_API_BASE_URL=http://127.0.0.1:8080

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
