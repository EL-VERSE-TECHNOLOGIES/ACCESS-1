# EL ACCESS frontend (scaffold)

This folder contains a minimal Next.js + TypeScript + Tailwind scaffold for the EL ACCESS frontend.

Quick start:

1. cd frontend
2. npm install
3. cp .env.example .env.local and set env vars
4. npm run dev

Backend:
- Start ARC CORE API locally and ensure it listens on `http://localhost:3000` (or set `NEXT_PUBLIC_API_BASE_URL`).
- Swagger docs: `http://localhost:3000/docs` is useful to inspect endpoints.

Notes:
- API base URL is read from `NEXT_PUBLIC_API_BASE_URL`.
- Pages provided: `/`, `/login`, `/register`, `/dashboard`, `/internships`, `/tasks/[id]`, `/peer-help`, `/wallet`, `/transactions`, `/notifications`, `/profile`, `/call/[room]`.
- Implemented features: auth, uploads (presigned), Monaco editor task workspace, Uno hint modal, basic socket chat & call signaling.
- This is a scaffold; extend UI, error handling, validation, tests and CI as next steps.

Tests & CI:
- A GitHub Actions workflow is included at `.github/workflows/ci.yml` which installs and builds the frontend on PRs to `main`.
- Playwright E2E tests are included under `tests/e2e` and can be run with `npm run test:e2e` (install Playwright browsers first: `npx playwright install`).
