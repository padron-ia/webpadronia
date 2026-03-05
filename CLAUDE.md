# CLAUDE.md — Padrón IA Web

This file provides context for AI assistants working on this codebase.

## Project Overview

**Padrón IA** is a React SPA (Single Page Application) for a Spanish AI automation consultancy. It combines a public marketing landing page with a role-based client portal and CRM system.

**Live domains**: `padron-ia.es`, `www.padron-ia.es`
**Deployment**: EasyPanel (`nuevo-web-padron-ia.3pkgp0.easypanel.host`)
**Language**: Spanish UI throughout — keep all user-facing copy in Spanish.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 |
| Build tool | Vite 6 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 3 + PostCSS |
| Backend/Auth/DB | Supabase (PostgreSQL + Auth) |
| Animations | GSAP 3, CSS custom animations |
| Icons | Lucide React |
| Video rendering | Remotion 4 |
| Analytics | Google Analytics (gtag), Facebook Pixel (fbq) |

## Repository Structure

```
webpadronia/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── portal/
│   │   │   └── PortalShell.jsx   # Layout wrapper for all portal pages
│   │   ├── ConsultForm.jsx       # Two-step lead qualification form (scoring)
│   │   ├── FloatingNavbar.jsx    # Sticky top navigation
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── PortalSection.jsx     # Portal signup/login marketing section
│   │   ├── ServicesGrid.jsx      # Service offering cards
│   │   ├── SolutionsBlueprint.jsx # Architecture visualization
│   │   └── WhatsAppFloatButton.jsx
│   ├── lib/                  # Service/utility layer
│   │   ├── analytics.js          # gtag + fbq event helpers
│   │   ├── contact.js            # WhatsApp URL builder (+34 664401328)
│   │   ├── leadService.js        # Lead submission with local storage fallback
│   │   ├── portalAuth.js         # Role resolution, profile auto-creation
│   │   └── supabaseClient.js     # Supabase client singleton
│   ├── pages/                # Route-level components
│   │   ├── LandingPage.jsx       # Public marketing page
│   │   ├── PortalAdminPage.jsx   # Admin CRM dashboard (~1000 lines)
│   │   ├── PortalClientPage.jsx  # Client view of their leads
│   │   ├── PortalIndexPage.jsx   # Post-login redirect logic
│   │   └── PortalLoginPage.jsx   # Supabase email/password auth
│   ├── styles/index.css      # Tailwind base + custom CSS components
│   ├── App.jsx               # Route definitions
│   └── main.jsx              # React entry point
├── video/                    # Remotion video project
│   ├── index.jsx             # Remotion entry
│   ├── Root.jsx
│   └── PadronIntro.jsx
├── supabase/
│   └── schema.sql            # Full database schema + RLS policies
├── public/assets/            # Static files served as-is
│   ├── logo-padron-ia-clean.png
│   ├── logo.svg
│   └── padron-intro.mp4
├── .env.example              # Required environment variables
├── SUPABASE_SETUP.md         # Supabase onboarding guide (Spanish)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── index.html                # Single HTML entry (lang="es")
```

## Development Commands

```bash
npm run dev          # Start Vite dev server (hot reload on :5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run video:render # Render intro video via Remotion → public/assets/padron-intro.mp4
```

## Environment Variables

Copy `.env.example` to `.env` and fill in real values:

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable anon key>
VITE_ADMIN_EMAILS=admin@example.com,another@example.com
```

- All variables must be prefixed with `VITE_` to be accessible in the browser via `import.meta.env`.
- **Never** use the `service_role` (secret) key in frontend code.
- `VITE_ADMIN_EMAILS` is a comma-separated list; parsed in `src/lib/portalAuth.js`.

## Routing

Defined in `src/App.jsx`:

| Path | Component | Access |
|---|---|---|
| `/` | `LandingPage` | Public |
| `/portal/login` | `PortalLoginPage` | Public |
| `/portal` | `PortalIndexPage` | Authenticated (redirects by role) |
| `/portal/admin/*` | `PortalAdminPage` | Admin only |
| `/portal/cliente` | `PortalClientPage` | Client only |
| `*` | Redirect to `/` | — |

Role resolution happens in `src/lib/portalAuth.js` — a user is admin if their email appears in `VITE_ADMIN_EMAILS` or their `profiles.role` column is `'admin'`.

## Database Schema

Tables live in Supabase (PostgreSQL). Run `supabase/schema.sql` to initialize.

### `profiles`
Extends Supabase `auth.users`. Auto-created on first login via `fetchOrCreateProfile()`.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, FK → auth.users |
| full_name | text | |
| role | text | `'admin'` or `'client'` (default) |
| created_at | timestamp | |

### `leads`
Core CRM entity. Written by the public ConsultForm and managed in the admin portal.

Key columns: `name`, `company`, `contact`, `sector`, `objective`, `urgency`, `budget_range`, `lead_volume`, `decision_role`, `message`, `lead_score`, `lead_grade` (A/B/C), `status` (new → contacted → qualified → proposal_sent → won/lost), `assigned_to`, `estimated_value`, `lost_reason`, `next_action_at`, `last_contact_at`.

### `lead_notes`
CRM comments attached to leads. Columns: `lead_id`, `author_id`, `note`, `created_at`.

### RLS Policies
- Anon and authenticated users can `INSERT` leads (public form).
- Only authenticated users can `SELECT` their own profile.
- Admins (checked via `is_admin()` DB function) can see and modify all leads, notes, and profiles.

To grant admin access to a new user, run:
```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

## Lead Scoring System

Implemented client-side in `src/components/ConsultForm.jsx`. Points are accumulated based on:

- **Urgency** (up to 30 pts): `immediate` → 30, `1-3months` → 20, `3-6months` → 10, `exploring` → 5
- **Budget** (up to 30 pts): `>5000€` → 30, `2000-5000€` → 20, `1000-2000€` → 10, `<1000€` → 5
- **Lead volume** (up to 20 pts): `>500` → 20, `100-500` → 15, `50-100` → 10, `<50` → 5
- **Decision role** (up to 20 pts): `decision_maker` → 20, `influencer` → 10, `evaluator` → 5

Grade thresholds: A ≥ 70, B ≥ 40, C < 40.

## Key Conventions

### Code Style
- **Functional components only** — no class components.
- **useState hooks** for local state — no global store (Redux, Zustand, etc.).
- File names use PascalCase for components (`HeroSection.jsx`) and camelCase for libs (`leadService.js`).
- No formal linter/formatter config exists — match the surrounding style when editing.

### Styling
- Use **Tailwind utility classes** as the primary styling method.
- Custom design tokens defined in `tailwind.config.js`:
  - `moss-green` (#2E4036) — primary brand green
  - `clay` (#2563EB) — accent blue
  - `cream` (#F2F0E9) — background/neutral
  - `coal` (#1A1A1A) — primary text
- Custom CSS components (animations, glow effects) live in `src/styles/index.css`.
- Respect `prefers-reduced-motion` — animation classes are already conditioned in CSS.

### Animations
- Landing page uses **Intersection Observer** for scroll-triggered `fade-in-up` animations (see `LandingPage.jsx`).
- GSAP is available but used sparingly — prefer CSS animations for simple transitions.

### Supabase / Data Access
- Always import the client from `src/lib/supabaseClient.js` — never instantiate a new client inline.
- `leadService.js` has a local storage fallback: if Supabase is unreachable, leads are stored in `localStorage` under `pendingLeads`. Don't remove this safety net.
- Supabase calls should handle errors gracefully — log errors but don't surface raw error objects to users.

### Analytics
- Fire analytics events through `src/lib/analytics.js` helpers (wraps gtag/fbq safely).
- Track meaningful conversion events: form submissions, CTA clicks, portal logins.

### Internationalization
- The app is Spanish-only. Do not introduce i18n libraries — keep strings inline in Spanish.

## Admin Portal (PortalAdminPage)

`src/pages/PortalAdminPage.jsx` is the most complex file (~1000 lines). It is organized into internal view sections rendered by a `currentView` state:

- `dashboard` — KPIs, recent activity
- `inbox` — new leads requiring attention
- `leads` — full lead database with search, filters, bulk actions
- `pipeline` — Kanban-style view grouped by lead status
- `activities` — follow-up scheduling
- `reports` — analytics overview
- `settings` — team configuration

When editing this file, prefer small, targeted edits. Extracting sections into sub-components is welcome when a section exceeds ~150 lines.

## Video

The `video/` directory is a self-contained **Remotion** project for rendering the intro video. It is independent of the main app — changes here don't affect the React SPA. Re-render with:

```bash
npm run video:render
```

Output is saved to `public/assets/padron-intro.mp4` and served statically.

## No Testing Framework

There are no automated tests. When making changes:
- Manually verify the landing page, ConsultForm submission, and portal login flow.
- Check that Supabase queries return expected data in the browser console.
- Test on mobile viewport (the design is mobile-first).

## Deployment Notes

- `npm run build` outputs to `dist/` — deploy this directory.
- The Vite preview server and allowed hosts are configured in `vite.config.js`.
- If adding a new domain, add it to the `allowedHosts` array in `vite.config.js`.
- Environment variables must be set in the hosting environment (EasyPanel) — `.env` files are gitignored.
