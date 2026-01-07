# EL ACCESS frontend (scaffold)

This folder contains a minimal Next.js + TypeScript + Tailwind scaffold for the EL ACCESS frontend.

Quick start:

1. cd frontend
2. npm install
3. cp .env.example .env.local and set env vars
4. npm run dev

Notes:
- API base URL is read from `NEXT_PUBLIC_API_BASE_URL`.
- Pages provided: `/`, `/login`, `/dashboard`, `/internships`, `/tasks/[id]`.
- This is a scaffold — implement further features (uploads, sockets, wallet) as next steps.
