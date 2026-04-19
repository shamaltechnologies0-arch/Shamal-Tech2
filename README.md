# Shamal Technologies — Website

Corporate website for **Shamal Technologies**, built with Next.js and Payload CMS. This README provides a quick start and references the full **corporate-level documentation structure** used for management, developers, and future teams.

---

## Project Overview (Summary)

| Item                | Details                                                |
| ------------------- | ------------------------------------------------------ |
| **Website**         | Shamal Technologies corporate site                     |
| **Domain**          | shamal.sa (configure via `NEXT_PUBLIC_SERVER_URL`)     |
| **Purpose**         | Corporate profile, lead generation, services & careers |
| **Target audience** | Government, enterprise, and B2B clients                |
| **Owner**           | Shamal Technologies                                    |
| **Version**         | 1.0                                                    |
| **Tech base**       | Payload CMS Website Template (Next.js + Payload)       |

Full project overview (scope, launch date, project owner, developer) belongs in **`Website_Documentation/01_Project_Overview.pdf`** (or `.docx`).

---

## Quick Start

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Install and run
pnpm install && pnpm dev
```

- **Site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin

Create your first admin user when prompted. For production: `pnpm build` then `pnpm start`. See **Deployment** and **05_Deployment_Guide** below.

---

## Corporate Documentation Structure

This project follows the **professional corporate-level website documentation** structure. All referenced documents (PDF/DOCX/Excel) should be stored in the **`Website_Documentation/`** folder. The table below is the single source of truth for what each document contains.

---

### 1. Project Overview Document (MOST IMPORTANT)

**File:** `Website_Documentation/01_Project_Overview.pdf` or `.docx`

**Contains:**

- Website name
- Domain name
- Project purpose (lead generation, corporate profile, etc.)
- Target audience
- Project scope
- Launch date
- Version number
- Project owner
- Developer/company name

**Example:**

```
Website: shamal.sa
Purpose: Corporate website for enterprise services
Goal: Generate qualified leads from government and enterprise clients
Owner: Shamal Technologies
Version: 1.0
```

---

### 2. Website Structure / Sitemap

**File:** `Website_Documentation/02_Sitemap.pdf`

**Contains:** Page hierarchy for the live site.

**Current structure (from application routes):**

```
Home
About
Services
   ├ Services listing
   └ [Service slug] (e.g. /services/aerial-survey)
Products
Posts (Blog)
   ├ /posts
   └ /posts/[slug]
Careers
   ├ /careers
   └ /careers/[slug]
Contact
Profile (Employee QR profiles)
   └ /profile/[slug]
Employee submit
   └ /employee/submit
Search
Dynamic CMS pages
   └ /[slug] (e.g. from Payload Pages collection)
Admin
   └ /admin (Payload CMS)
```

Use this section in the PDF to reflect any new pages or sections.

---

### 3. Technical Documentation

**File:** `Website_Documentation/03_Technical_Documentation.pdf`

**Contains:** Technology stack, hosting, domain, CMS, server architecture.

**Current stack (for reference):**

| Layer             | Technology                                             |
| ----------------- | ------------------------------------------------------ |
| **Frontend**      | Next.js 15 (App Router), React 19, TypeScript          |
| **CMS / Backend** | Payload CMS 3.x                                        |
| **Database**      | MongoDB (Mongoose adapter)                             |
| **Styling**       | Tailwind CSS, Radix UI, Geist + Rajdhani + Inter fonts |
| **Rich text**     | Lexical (Payload)                                      |
| **Media storage** | Local (dev) / AWS S3 (production)                      |
| **Email**         | Nodemailer (SMTP)                                      |
| **Hosting**       | Vercel or AWS Amplify (see env and deployment docs)    |
| **Domain**        | Configure via environment (e.g. GoDaddy, Route53)      |
| **SEO**           | Payload SEO plugin, next-sitemap, robots.txt           |

Document in the PDF: final hosting provider, domain provider, and any CDN or extra services.

---

### 4. Admin & CMS Documentation

**File:** `Website_Documentation/04_Admin_Guide.pdf`

**Contains (for non-technical staff):**

- Admin panel URL (e.g. `https://shamal.sa/admin`)
- How to log in
- How to edit pages (Payload Pages + layout blocks)
- How to add/edit blog posts (Posts collection)
- How to update services (Services collection)
- How to manage careers (Career collection)
- How to upload images (Media collection; S3 when configured)
- Header/Footer navigation (Header & Footer globals)
- Site settings, SEO, and other globals

Critical for corporate teams who manage content without touching code.

---

### 5. Deployment Documentation

**File:** `Website_Documentation/05_Deployment_Guide.pdf`

**Contains:**

- How to deploy (e.g. Vercel, AWS Amplify)
- How to connect the domain
- Environment variables (see below)
- Build and run commands

**Build instructions (reference):**

```bash
pnpm install
pnpm build
pnpm start
```

**Environment variables:** See `.env.example`. Key variables:

- `MONGODB_URI` — Database
- `PAYLOAD_SECRET` — Auth
- `NEXT_PUBLIC_SERVER_URL` — Public site URL (no trailing slash)
- `CRON_SECRET` — Cron/revalidation
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
- S3 (production): `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, optional `S3_PREFIX`
- Optional: `CLICKUP_API_TOKEN`, `CLICKUP_LIST_ID` (leads), newsletter and contact keys

---

### 6. Source Code Documentation

**Folder:** `Website_Documentation/06_Source_Code_Structure/`

**Contains:** Explanation of repository and folder structure.

**Purpose of main folders:**

| Path                         | Purpose                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `src/app/`                   | Next.js App Router: frontend routes `(frontend)/`, Payload API & admin `(payload)/`, sitemaps |
| `src/components/`            | Reusable UI components (Header, Footer, blocks, etc.)                                         |
| `src/collections/`           | Payload collections (Pages, Posts, Media, Services, Products, Career, Employees, Leads, etc.) |
| `src/globals/`               | Payload globals (Header, Footer, SiteSettings, HomepageContent, etc.)                         |
| `src/fields/`                | Payload custom fields (e.g. link, defaultLexical)                                             |
| `src/plugins/`               | Payload plugins (S3, SEO, redirects, search, form-builder, nested-docs)                       |
| `src/utilities/`             | Helpers (getURL, getGlobals, mergeOpenGraph, etc.)                                            |
| `src/lib/`                   | Shared libs (email, ClickUp, translations)                                                    |
| `src/Header/`, `src/Footer/` | Header/Footer config and components                                                           |
| `public/`                    | Static assets (favicon, etc.)                                                                 |
| `scripts/`                   | Seed, S3 test, DB test, migrations, etc.                                                      |

Document in `06_Source_Code_Structure/` any project-specific conventions or extra folders.

---

### 7. Design Documentation

**File:** `Website_Documentation/07_Design_System.pdf`

**Contains:**

- Colors (primary, secondary, accents, semantic)
- Fonts (family, weights)
- UI guidelines and components
- Layout and grid rules
- Responsive behavior

**Current design tokens (from `src/app/(frontend)/globals.css`):**

- **Primary:** Navy `#0A3254` (--primary, --logo-navy)
- **Secondary / Accent:** Blue `#226093` (--secondary, --logo-blue)
- **Muted:** Gray `#939598` (--logo-gray)
- **Fonts:** Geist Sans/Mono, Rajdhani, Inter
- **Radius:** `--radius: 0.75rem`
- Light/dark themes via `data-theme`

---

### 8. SEO Documentation

**File:** `Website_Documentation/08_SEO_Documentation.pdf`

**Contains:**

- Meta titles and descriptions (Payload SEO plugin + globals)
- Keywords and SEO keywords collection
- Sitemap: `sitemap.xml`, `pages-sitemap.xml`, `posts-sitemap.xml`, `employees-sitemap.xml` (see `next-sitemap.config.cjs`)
- `robots.txt` (generated; `/admin/*` disallowed)
- Google Analytics setup
- Google Search Console setup

---

### 9. Integrations Documentation

**File:** `Website_Documentation/09_Integrations.pdf`

**Contains:** All third-party and internal integrations.

**Current integrations:**

- **Contact form** — API route; email via SMTP; optional storage in Payload
- **Leads / CRM** — ClickUp (optional: `CLICKUP_API_TOKEN`, `CLICKUP_LIST_ID`)
- **Newsletter** — Newsletter subscription API and collection
- **Email** — Nodemailer (SMTP) for contact and system emails
- **Media** — AWS S3 for production uploads
- **Search** — Payload Search plugin (SSR search)
- **Chatbot** — In-app chatbot (see `src/components/Chatbot`)
- **Issue reports** — IssueReports collection and API

Document in the PDF: WhatsApp, CRM, analytics, or other added integrations.

---

### 10. Maintenance & Support Guide

**File:** `Website_Documentation/10_Maintenance_Guide.pdf`

**Contains:**

- Backup procedure (DB + media/S3)
- Update procedure (dependencies, Payload, Next.js)
- Security guidelines (secrets, admin access, CORS/CSRF)
- Troubleshooting (build errors, DB connection, S3, revalidation)

Reference: `scripts/test-db-connection.ts`, `scripts/test-s3-connection.ts`, Payload migrations if used.

---

### 11. Credentials & Access Document (Highly Restricted)

**File:** `Website_Documentation/11_Access_Credentials.xlsx`

**Contains (restrict to authorized management only):**

- Domain registrar login
- Hosting login (e.g. Vercel, AWS)
- CMS/Admin login (first user created via app; document URL and recovery process)
- Analytics login (e.g. Google)

- S3 / AWS credentials (prefer IAM + env vars; do not put secrets in the Excel file)

Store this file in a secure location and control access strictly.

---

### 12. Assets Folder

**Folder:** `Website_Documentation/12_Assets/`

**Contains:**

- Logo (all formats)
- Key images and media
- Videos
- Icons
- Fonts (if custom and not from package manager)

Keep a curated set of brand assets here for design and marketing.

---

### 13. Legal Pages Documentation

**Location:** Document in `Website_Documentation/` or in the CMS (e.g. Pages).

**Contains:**

- Privacy Policy
- Terms & Conditions
- Cookie Policy

Reference where these live (e.g. `/privacy`, `/terms`, `/cookies`) and how to edit them (Payload Pages or globals).

---

## Recommended Documentation Folder Structure

Place the following files and folders in the repo (or linked secure share) as the single documentation hub:

```
Website_Documentation/
│
├── 01_Project_Overview.pdf
├── 02_Sitemap.pdf
├── 03_Technical_Documentation.pdf
├── 04_Admin_Guide.pdf
├── 05_Deployment_Guide.pdf
├── 06_Source_Code_Structure/
├── 07_Design_System.pdf
├── 08_SEO_Documentation.pdf
├── 09_Integrations.pdf
├── 10_Maintenance_Guide.pdf
├── 11_Access_Credentials.xlsx
├── 12_Assets/
└── (Legal pages: document in 01 or a dedicated 13_Legal.pdf)
```

See `Website_Documentation/README.md` in this repo for a short index and instructions for adding the actual PDF/DOCX/Excel files.

---

## Most Critical Files (Minimum Required)

For a minimal but professional handover:

1. **01_Project_Overview** — What the site is, who owns it, scope.
2. **02_Sitemap** — Page structure.
3. **03_Technical_Documentation** — Stack, hosting, domain, CMS.
4. **04_Admin_Guide** — How to log in and edit content.
5. **05_Deployment_Guide** — How to deploy and set env vars.
6. **11_Access_Credentials** — Where logins are stored (secure location).

---

## Payload Features (Reference)

- **Collections:** Pages, Posts, Media, Categories, Users, Services, Products, Career, ContactSubmissions, Employees, Leads, NewsletterSubscriptions, SEOKeywords, IssueReports, ChatSummaries
- **Globals:** Header, Footer, SiteSettings, HomepageContent, AboutPageContent, PostsPageContent, CareersPageContent, ContactPageContent, ProductsPageContent, ServicesPageContent, SectorsContent, SEOSettings
- **Plugins:** S3 storage, SEO, redirects, search, form-builder, nested-docs
- **Features:** Layout builder, draft/preview, live preview, on-demand revalidation, scheduled publish, Lexical rich text

For detailed Payload and Next.js usage, see the official [Payload Website Template](https://github.com/payloadcms/payload/templates/website) and [Payload Docs](https://payloadcms.com/docs).

---

## Questions

- **Payload / CMS:** [Payload Discord](https://discord.com/invite/payload), [GitHub Discussions](https://github.com/payloadcms/payload/discussions)
- **Project / Shamal Technologies:** Contact the project owner or development team.
