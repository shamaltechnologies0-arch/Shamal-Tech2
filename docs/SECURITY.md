# Security Assessment & Hardening (Vercel + MongoDB Atlas)

This document summarizes the project’s security posture and measures applied for deployment on **Vercel** with **MongoDB Atlas (free tier)**.

---

## Current Protections (Already in Place)

| Area | Status |
|------|--------|
| **CORS / CSRF** | Allowed origins are explicit (server URL, Vercel URL, localhost in dev). No wildcard. |
| **Payload secret** | `PAYLOAD_SECRET` used for signing; must be set in production. |
| **Cron jobs** | `CRON_SECRET` required for job execution via `Authorization: Bearer`. |
| **Admin / auth** | Payload admin and login live under `/(payload)/admin` and `/(payload)/api`; auth is required for admin UI. |
| **Sensitive env** | `.env` and `.env*.local` are in `.gitignore`; do not commit secrets. |
| **MongoDB connections** | `maxPoolSize: 5` when `VERCEL` is set to avoid exhausting Atlas M0 connection limit. |
| **Contact form** | Submissions go through a dedicated route (`/api/contact`) that validates input and uses server-side Payload (no public create on collection needed). |

---

## Issues Addressed in Code

1. **ContactSubmissions (and similar)**
   - **Risk:** Collection had `anyone` for read/update/delete, so the Payload API could list/change/delete all submissions.
   - **Fix:** Read/update/delete restricted to admins. Create is also restricted at collection level; the contact form still works because `/api/contact` uses server-side `payload.create()` (overrideAccess by default).

2. **Users collection**
   - **Risk:** `anyone` on create/read/update/delete allowed unauthenticated API access to user data and user creation.
   - **Fix:** Create and delete limited to admins; read and update limited to authenticated users. Admin UI access unchanged.

3. **Revalidate API**
   - **Risk:** `/api/revalidate` had no authentication; anyone could trigger cache revalidation.
   - **Fix:** Endpoint now requires `Authorization: Bearer <REVALIDATE_SECRET>` (or `CRON_SECRET` if `REVALIDATE_SECRET` is not set).

4. **Security headers**
   - **Added:** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` in Next.js config to reduce clickjacking and MIME sniffing risks.

---

## What You Must Do in Production

### 1. Environment variables (Vercel)

- **`PAYLOAD_SECRET`** – Long random string (e.g. 32+ chars). Used for sessions and signing. Never commit.
- **`MONGODB_URI`** – Atlas connection string with a strong password. Use a dedicated DB user with minimal privileges.
- **`CRON_SECRET`** – Used for cron/job auth; keep secret and use in `Authorization: Bearer`.
- **`REVALIDATE_SECRET`** (optional) – For `/api/revalidate`; if unset, `CRON_SECRET` is used.
- Do not set secrets in client-side env (e.g. `NEXT_PUBLIC_*` for secrets).

### 2. MongoDB Atlas (free tier)

- **Network Access:** Restrict to Vercel IPs or “Allow access from anywhere” only if necessary; prefer narrowing later.
- **Database user:** Strong password; avoid reusing passwords from other services.
- **Backups:** M0 free tier has limited backup; consider exports or upgrading if data is critical.

### 3. Vercel

- Use **Environment Variables** in the project for all secrets; enable for Production (and Preview if needed).
- Prefer **Vercel’s “Protection”** (e.g. Vercel Authentication or similar) for admin if you need an extra layer.
- Optional: **Vercel Firewall / Rate limiting** (if available on your plan) for `/api/contact`, `/api/newsletter`, and other public POST endpoints.

### 4. Rate limiting (recommended)

- There is no application-level rate limiting yet. Public APIs (e.g. contact, newsletter) can be abused or used for DoS.
- **Options:**
  - Use **Vercel’s rate limiting** or firewall if available.
  - Add a rate-limiting middleware or wrapper (e.g. by IP or key) in front of `/api/contact` and `/api/newsletter`.
  - Consider a proxy (e.g. Upstash Redis) for serverless-friendly rate limiting.

### 5. Other collections to lock down (optional but recommended)

- **Leads, NewsletterSubscriptions, IssueReports, ChatSummaries:** Currently `anyone` for read/update/delete. If those are only created via your own routes (with server-side Payload), restrict read/update/delete to `adminOnly` (and create to admin or keep create for specific use cases).
- **Categories, Services, Products, Career, SEOKeywords:** If only admins should change content, restrict create/update/delete to `authenticated` or `adminOnly` and keep `read: anyone` for public site.

---

## Summary

- The project was **not fully protected** from abuse and data exposure: open Payload API access on several collections and an unauthenticated revalidate endpoint.
- **Fixes applied:** Stricter access on ContactSubmissions and Users, authenticated revalidate endpoint, and security headers.
- For **Vercel + MongoDB free tier**, also: strong secrets in env, locked-down Atlas user and network, and (when possible) rate limiting and further collection access tightening as above.

If you add new public API routes or new collections, apply the same principles: minimal access, server-side creation with overrideAccess only where intended, and rate limiting for public endpoints.
