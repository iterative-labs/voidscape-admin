# Voidscape Admin

Internal React SPA for operating the Voidscape universe over **voidscape-server’s HTTP admin API** only (no direct database access).

## Stack

- Vite, React, TypeScript  
- Tailwind CSS, shadcn/ui  
- TanStack Query, TanStack Table  
- React Router  

## Setup

```bash
npm install
cp .env.example .env
# Point at your voidscape-server HTTP bind address (must be listed in server config admin_http.allowed_origins).
```

## Development

With [voidscape-server](../voidscape-server) running and Postgres available per [`voidscape-server/dist/config.toml`](../voidscape-server/dist/config.toml):

```bash
npm run dev
```

Default API URL in `.env.example` is `http://127.0.0.1:8080`, matching the dev config’s `network.http_addr`.

## Security

This UI is meant for **trusted networks** (VPN, admin-only hosts). The server’s admin HTTP API should not be exposed publicly; only gRPC is intended for public exposure in production. Application-level auth is out of scope for this slice—rely on network controls or add API auth later.

## Build

```bash
npm run build
```

Static files are emitted to `dist/` (ignored by git).
