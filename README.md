# Reviewline Frontend

Frontend client for **Reviewline**, an AI-powered code review SaaS. Built with React, TypeScript, and Vite, it provides the full user-facing experience for submitting code, viewing AI-generated review feedback, and managing an account.

## Features

- **Landing page** — product marketing/entry point
- **Auth flow** — login, registration, Google OAuth, and email verification
- **Dashboard** — overview of review activity and usage stats
- **Submit a review** — send code to the backend for AI analysis
- **Review history & detail view** — browse past reviews and drill into individual results
- **Sample review** — a demo review for users evaluating the product before signing up
- **Account settings**

## Tech stack

React · TypeScript · Vite

## Project structure

```
src/
  api/         API client calls to the reviewline-backend service
  components/  Shared UI components
  context/     React context providers (e.g. auth state)
  pages/       Route-level pages (Dashboard, NewReview, History, Settings, ...)
```

## Running locally

```bash
npm install
npm run dev
```

Requires the [reviewline-backend](https://github.com/suraj02452/reviewline-backend) API running (or a configured API URL) to function fully.

## Related

- [reviewline-backend](https://github.com/suraj02452/reviewline-backend) — the Spring Boot API this app talks to
