# Voidscape Admin

Internal React SPA for operating the Voidscape universe over **voidscape-server’s management API** only (no direct database access).

## Stack

- Vite, React, TypeScript  
- Tailwind CSS, shadcn/ui  
- TanStack Query, TanStack Table  
- React Router  

## Setup

```bash
npm install
cp .env.example .env
# Point at your voidscape-server management API bind address (must be listed in server config admin_http.allowed_origins).
```

## Development

With [voidscape-server](../voidscape-server) running and Postgres available per [`voidscape-server/dist/config/config.toml`](../voidscape-server/dist/config/config.toml):

```bash
npm run dev
```

API calls are proxied through the Vite dev server. Set `API_PROXY_TARGET` in `.env` to point at the backend (default: `http://server.vs.orb.local:8080`). The browser always calls `/management-api/*`; the proxy strips the prefix and forwards to the target.

## Security

This UI is meant for **trusted networks** (VPN, operations-only hosts). The **management API** should not be exposed publicly; only gRPC is intended for public exposure in production. Application-level auth is out of scope for this slice—rely on network controls or add API auth later.

## Build

```bash
npm run build
```

Static files are emitted to `dist/` (ignored by git).

## Docker image (GHCR)

On every push to **`main`**, CI publishes **`ghcr.io/iterative-labs/voidscape-admin:main`** (single rolling tag). Pull:

```bash
docker pull ghcr.io/iterative-labs/voidscape-admin:main
```

Authenticate with **`docker login ghcr.io`** when the package is private.

Build locally from this repo root:

```bash
DOCKER_BUILDKIT=1 docker buildx build -t voidscape-admin:local .
```

The image runs the Vite dev server on **`0.0.0.0:5173`**. API calls are proxied via Vite: the browser calls `/management-api/*`, the proxy strips the prefix and forwards to `API_PROXY_TARGET` (default: `http://server:8080`, matching the Docker Compose service name). No hostname is baked into the image.
