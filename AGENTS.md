# AGENTS.md

## 1) Formål
Dette dokumentet beskriver hvordan du jobber trygt og effektivt i dette repoet.
Målet er å beskytte bygg/lint/kontrakter, og sikre at endringer er sporbare.
Alle instruksjoner her er basert på faktiske filer i repoet, med konkrete stier.
Hvis noe er uklart, er det merket som **Uavklart** med pekere til filer.
Dokumentet er levende og skal oppdateres ved endringer i scripts, flyt eller kontrakter.

## 2) Hurtigstart
**Install:**
- Kjør fra repo-roten: `npm ci`
- Package manager: npm (låst via package-lock.json)

**Kjør lokalt:**
- `npm run dev` (Next.js dev server)

**Miljøvariabler:**
- Lokal mal: .env.development.example
- Produksjon mal: .env.production.example

Minimum i dev (fra .env.development.example):
- DATABASE_URL
- SESSION_SECRET
- ADMIN_USERNAME
- ADMIN_PASSWORD

Andre env som brukes i kode (ikke dokumentert i .env.example per nå):
- NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (src/lib/supabase.ts)
- NEXT_PUBLIC_AVAILABILITY_API_URL (src/components/sauna/SaunaAvailability.tsx)
- CRON_SECRET (src/app/api/cron/*)
- LIGHTHOUSE_BASE_URL, SCAN_HOMEPAGE, SCAN_SAUNAS, SCAN_SUBPAGES, SCAN_ID (scripts/daily_lighthouse_scan.mjs, src/app/api/lighthouse/scan/route.ts)
- PUPPETEER_EXECUTABLE_PATH, CHROME_PATH (src/lib/availability-scraper.ts)

Uavklart:
- .env.development.example beskriver SQLite, men Prisma datasource er postgresql i prisma/schema.prisma. Avklar og oppdater dokumentasjon ved behov.

## 3) Kommandoer og standard arbeidsflyt (repo-spesifikk)
**Standard scripts (package.json):**
- Dev: `npm run dev`
- Build: `npm run build` (bygger Next.js + Storybook til `public/storybook`)
- Start (prod): `npm run start`
- Lint: `npm run lint`
- Storybook: `npm run storybook`
- Storybook build: `npm run build-storybook` (output: `public/storybook`)
- Prisma generate (postinstall): `npm run postinstall`
- DB migrate deploy: `npm run db:migrate:deploy`
- DB push: `npm run db:push`
- DB seed: `npm run db:seed`
- Lighthouse scan: `npm run lighthouse:scan`

**Test / typecheck:**
- Uavklart: ingen test- eller typecheck-script i package.json.
- Vitest er konfigurert i vitest.config.ts (Storybook-vitest). Hvis test-kommando skal brukes, avklar og legg til script.

**CI som sannhet:**
- .github/workflows/scraper.yml kjører `npm ci`, installerer Playwright Chromium og kjører `npx tsx scripts/run_scraper.ts` (Node 22).

## 4) Obligatorisk build/lint-løkke (policy for fremtidige endringer)
**Merk:** Denne policyen skal ikke kjøres i denne oppgaven.

Du er en senior utvikler som jobber i dette repoet. Målet er at prosjektet skal bygge og linte helt uten feil.

Oppgave:
1. Kjør repoets build-kommando.
2. Kjør repoets lint-kommando.
3. Fiks alle feil/advarsler som stopper build eller lint.
4. Gjenta til begge er grønne.

Viktige krav:
- Ikke fjern eller svekk funksjonalitet.
- Ikke suppress problemer uten tung grunn (eslint-disable/@ts-ignore/skrue av regler/utelate filer).
- Bevar API/kontrakter (signaturer, eksport, props, eventnavn, ruter, datamodeller) med mindre endring er nødvendig, og gjør den da bakoverkompatibel.
- Ikke endre build/lint-konfig med mindre det er siste fornuftige utvei.

Arbeidsmåte per iterasjon:
- Lim inn relevant output fra build/lint.
- Forklar kort årsak, endring, og hvorfor funksjonalitet bevares.
- Kjør på nytt.

Leveranse:
- Oppsummer endringene.
- Bekreft: “build OK” og “lint OK”.

## 5) Repo-kart (struktur og ansvar)
**App (Next.js App Router):**
- App entry/layout: src/app/layout.tsx
- Admin layout: src/app/admin/(dashboard)/layout.tsx
- Routing: src/app/**/page.tsx
- API handlers: src/app/api/**/route.ts

**Data / ORM:**
- Prisma schema: prisma/schema.prisma
- Migrations: prisma/migrations/**/migration.sql
- Prisma client init: src/lib/prisma.ts
- Seed: prisma/seed.ts

**Kritiske services:**
- Sauna data + caching: src/lib/sauna-service.ts
- Availability scraping: src/lib/availability-service.ts, src/lib/availability-scraper.ts
- Scraper runs/logging: src/lib/scraper-runner.ts, src/lib/scraper-service.ts
- Media (Supabase storage): src/lib/media-service.ts, src/app/api/media/**
- Lighthouse scanning: src/lib/lighthouse-service.ts, scripts/daily_lighthouse_scan.mjs
- Auth/session: src/lib/auth.ts, src/lib/auth-guard.ts
- Admin logging: src/lib/admin-log.ts

**UI & components:**
- Shared components: src/components/**
- Storybook config: .storybook/*

**Config:**
- Next config: next.config.ts
- ESLint: eslint.config.mjs
- TypeScript: tsconfig.json
- Vitest: vitest.config.ts
- Vercel: vercel.json

**Andre entrypoints / scripts:**
- scripts/run_scraper.ts (Supabase + Playwright)
- scripts/daily_lighthouse_scan.mjs
- scripts/warm_cache.mjs
- check_maintenance.js

## 6) Overflatekart

### A) Frontend-sider/ruter
| Route/URL | Filsti | Layout/parent | Dataavhengigheter | Auth/rollekrav | Viktige sideeffekter |
|---|---|---|---|---|---|
| / | src/app/page.tsx | src/app/layout.tsx | prisma.siteSetting (maintenance), getActiveSaunas (src/lib/sauna-service.ts) | Ingen | Ingen |
| /maintenance | src/app/maintenance/page.tsx | src/app/layout.tsx | prisma.siteSetting (maintenance_mode, maintenance_snapshot) | Ingen | Ingen |
| /medlemskap | src/app/medlemskap/page.tsx | src/app/layout.tsx | prisma.subscription | Ingen | Ingen |
| /gavekort | src/app/gavekort/page.tsx | src/app/layout.tsx | Ingen | Ingen | Ingen |
| /bedrift | src/app/bedrift/page.tsx | src/app/layout.tsx | getGlobalSettings (src/lib/sauna-service.ts) | Ingen | Ingen |
| /info | src/app/info/page.tsx | src/app/layout.tsx | Ingen | Ingen | Ingen |
| /info/om-oss | src/app/info/om-oss/page.tsx | src/app/layout.tsx | getActiveSaunas({ includeOpeningHours }), getGlobalSettings, formatSmartOpeningHours | Ingen | Ingen |
| /info/apningstider | src/app/info/apningstider/page.tsx | src/app/layout.tsx | getActiveSaunas({ includeOpeningHours }), formatSmartOpeningHours | Ingen | Ingen |
| /info/faq | src/app/info/faq/page.tsx | src/app/layout.tsx | Ingen | Ingen | Ingen |
| /info/personvern | src/app/info/personvern/page.tsx | src/app/layout.tsx | CookieSettingsTrigger komponent | Ingen | Ingen |
| /info/regler | src/app/info/regler/page.tsx | src/app/layout.tsx | getGlobalSettings | Ingen | Ingen |
| /info/vilkar | src/app/info/vilkar/page.tsx | src/app/layout.tsx | Ingen | Ingen | Ingen |
| /home/[slug] | src/app/home/[slug]/page.tsx | src/app/layout.tsx | getSaunaBySlug, getActiveSaunas, getGlobalSettings, prisma.siteSetting, getSession; klient: SaunaAvailability -> /api/availability/today eller NEXT_PUBLIC_AVAILABILITY_API_URL | Ingen (isAdmin brukes kun for visning) | Ingen |
| /admin/login | src/app/admin/login/page.tsx | src/app/layout.tsx | loginAction (src/app/admin/login/actions.ts) -> prisma.adminUser + login cookie | Ingen (login) | Setter session-cookie |
| /admin | src/app/admin/(dashboard)/page.tsx | src/app/admin/(dashboard)/layout.tsx | getDashboardStats/getDriftStatus/getRecentActivity (src/app/admin/(dashboard)/dashboard-actions.ts) | Ikke eksplisitt; server actions bruker requireAdmin i flere filer | Ingen |
| /admin/analytics | src/app/admin/(dashboard)/analytics/page.tsx | src/app/admin/(dashboard)/layout.tsx | prisma.analytics*, getSession; CSV via /api/analytics/export | getSession (for å vise ActionMenu) | Ingen |
| /admin/privacy | src/app/admin/(dashboard)/privacy/page.tsx | src/app/admin/(dashboard)/layout.tsx | fetch: /api/privacy/stats, /api/privacy/consent-logs, /api/privacy/sessions, /api/privacy/session-pageviews | Ingen i page; API krever session | Ingen |
| /admin/scraper | src/app/admin/(dashboard)/scraper/page.tsx | src/app/admin/(dashboard)/layout.tsx | fetch: /api/admin/scraper/runs, /api/admin/scraper/trigger, /api/admin/scraper/stream | Ingen i page; API krever session | Trigger scraper-run |
| /admin/settings | src/app/admin/(dashboard)/settings/page.tsx | src/app/admin/(dashboard)/layout.tsx | prisma.siteSetting | Ingen i page; actions i underkomponenter bruker requireAdmin | Vedlikeholdsmodus-toggle, operasjonskall |
| /admin/apningstider | src/app/admin/(dashboard)/apningstider/page.tsx | src/app/admin/(dashboard)/layout.tsx | prisma.sauna + openingHour | Ingen | Skriver default openingHours hvis tomt |
| /admin/badstuer | src/app/admin/(dashboard)/badstuer/page.tsx | src/app/admin/(dashboard)/layout.tsx | prisma.sauna + openingHours; actions i ./actions.ts | Ingen | Endrer status/sletter via actions |
| /admin/badstuer/ny | src/app/admin/(dashboard)/badstuer/ny/page.tsx | src/app/admin/(dashboard)/layout.tsx | SaunaForm | Ingen | Ingen |
| /admin/badstuer/[id] | src/app/admin/(dashboard)/badstuer/[id]/page.tsx | src/app/admin/(dashboard)/layout.tsx | prisma.sauna + mediaAssets | Ingen | Ingen |
| /admin/brukere | src/app/admin/(dashboard)/brukere/page.tsx | src/app/admin/(dashboard)/layout.tsx | prisma.adminUser | Ingen | Ingen |
| /admin/media | src/app/admin/(dashboard)/media/page.tsx | src/app/admin/(dashboard)/layout.tsx | listMediaItems (src/app/admin/(dashboard)/media/actions.ts) | Ingen i page; actions bruker requireAdmin | Media CRUD |
| /admin/medlemskap | src/app/admin/(dashboard)/medlemskap/page.tsx | src/app/admin/(dashboard)/layout.tsx | prisma.subscription | Ingen | Ingen |
| /admin/lighthouse | src/app/admin/(dashboard)/lighthouse/page.tsx | src/app/admin/(dashboard)/layout.tsx | getSession + redirect; LighthouseReportsView | Krever session (redirect) | Ingen |

**Merk om auth i admin:**
- API og server actions håndhever ofte requireAdmin (src/lib/auth-guard.ts). Layout for admin gjør ikke auth-sjekk. proxy-funksjonen i src/proxy.ts er ikke koblet til middleware (ingen src/middleware.ts), så ikke anta global gate.

### B) API-endepunkter / RPC / GraphQL
| Endpoint | Filsti | Metode | Input/Output-kontrakt | Auth/rollekrav | Sideeffekter |
|---|---|---|---|---|---|
| /api/auth/session | src/app/api/auth/session/route.ts | GET | Output: { isAdmin: boolean } | Ingen | Ingen |
| /api/availability/today | src/app/api/availability/today/route.ts | GET | Query: saunaId (required), force (optional). Output: availability JSON { days, timestamp, isInitial? } | Ingen | Kan trigge scraping + DB update via updateSaunaAvailability |
| /api/analytics/ingest | src/app/api/analytics/ingest/route.ts | POST | Zod IngestSchema (sessionId?, type, eventName?, path, payload?, metadata?). Output: { success } | Ingen | Skriver AnalyticsSession + AnalyticsEvent, oppdaterer PrivacySession |
| /api/analytics/stats | src/app/api/analytics/stats/route.ts | GET | Query: days (default 30). Output: kpis, topPages, topEvents, dailyStats, deviceStats | Krever session | DB read |
| /api/analytics/export | src/app/api/analytics/export/route.ts | GET | Query: days (default 30). Output: CSV file | Krever session | DB read |
| /api/privacy/consent | src/app/api/privacy/consent/route.ts | POST | Zod ConsentSchema. Output: { success } | Ingen | Skriver ConsentLog, oppdaterer/oppter PrivacySession |
| /api/privacy/consent-logs | src/app/api/privacy/consent-logs/route.ts | GET | Query: version, choice, analysis, from, to, limit, offset. Output: logs + stats | Krever session | DB read |
| /api/privacy/sessions | src/app/api/privacy/sessions/route.ts | GET | Query: deviceType, browser, from, to, limit, offset, maskIp. Output: sessions + stats | Krever session | DB read |
| /api/privacy/stats | src/app/api/privacy/stats/route.ts | GET | Output: overview + consentBreakdown | Krever session | DB read |
| /api/privacy/session-pageviews | src/app/api/privacy/session-pageviews/route.ts | GET | Query: sessionId. Output: { sessionId, pageviews, total } | Krever session | DB read |
| /api/admin/users | src/app/api/admin/users/route.ts | GET | Output: [{ id, username, createdAt }] | Krever session | DB read |
| /api/admin/saunas | src/app/api/admin/saunas/route.ts | GET | Output: { saunaMap: Record<slug,name> } | Krever session | DB read |
| /api/admin/analytics/clear | src/app/api/admin/analytics/clear/route.ts | POST | Output: { success, deleted } | Krever session + username == Marcus | DB delete |
| /api/admin/maintenance-mode | src/app/api/admin/maintenance-mode/route.ts | POST | Body: { enabled: boolean }. Output: { success, enabled } | Krever session | Upsert SiteSetting + snapshot |
| /api/admin/check-maintenance | src/app/api/admin/check-maintenance/route.ts | GET | Output: { isMaintenanceMode } | Ingen | DB read |
| /api/maintenance/snapshot | src/app/api/maintenance/snapshot/route.ts | POST | Output: { success, generatedAt, saunaCount } | Krever session | Upsert SiteSetting snapshot |
| /api/admin/scraper/trigger | src/app/api/admin/scraper/trigger/route.ts | POST | Body: { mode, saunaIds? }. Output: { success, runId } | Krever session | Skriver ScrapeRun + kjører scraper |
| /api/admin/scraper/runs | src/app/api/admin/scraper/runs/route.ts | GET | Query: page, limit, status?, trigger?. Output: { runs, pagination } | Krever session | DB read |
| /api/admin/scraper/runs/[id] | src/app/api/admin/scraper/runs/[id]/route.ts | GET | Path: id. Output: { run } | Krever session | DB read |
| /api/admin/scraper/stream | src/app/api/admin/scraper/stream/route.ts | GET (SSE) | Query: runId. Output: SSE events | Krever session | Poller ScrapeLogEvent |
| /api/media/init | src/app/api/media/init/route.ts | POST | Body: { saunaId?, kind, filename?, mimeType, fileSize? }. Output: { assetId, uploadUrl } | requireAdmin | Oppretter MediaAsset (pending) |
| /api/media/upload/[id] | src/app/api/media/upload/[id]/route.ts | PUT | Path: id, body: image/* | requireAdmin | Prosesserer bilde + lagrer i Supabase + oppdaterer MediaAsset |
| /api/media/confirm | src/app/api/media/confirm/route.ts | POST | Body: { assetId, saunaId, kind, orderIndex? } | requireAdmin | Bekrefter MediaAsset, oppdaterer Sauna.imageUrl/galleri |
| /api/media/reorder | src/app/api/media/reorder/route.ts | PATCH | Body: { saunaId, assetOrders } | requireAdmin | Oppdaterer MediaAsset.orderIndex + Sauna.gallery |
| /api/media/[id] | src/app/api/media/[id]/route.ts | DELETE | Path: id | requireAdmin | Sletter Supabase-filer + MediaAsset + oppdaterer Sauna |
| /api/saunas/slugs | src/app/api/saunas/slugs/route.ts | GET | Output: { slugs } | Ingen | DB read |
| /api/lighthouse/settings | src/app/api/lighthouse/settings/route.ts | GET/POST | GET: { baseUrl }. POST: { baseUrl } | Krever session | Upsert SiteSetting |
| /api/lighthouse/scan | src/app/api/lighthouse/scan/route.ts | POST | Body: { homepage?, saunas?, subpages? }. Output: { success, scanId } | Krever session | Start npm run lighthouse:scan (child process) |
| /api/lighthouse/reports | src/app/api/lighthouse/reports/route.ts | GET | Query: type=latest|history|scans, url, device, days | Krever session | DB read |
| /api/cron/warm-cache | src/app/api/cron/warm-cache/route.ts | GET | Auth: CRON_SECRET (query eller Bearer). Output: { routes, successful } | CRON_SECRET | Trigger fetch på ruter |
| /api/cron/scrape-availability | src/app/api/cron/scrape-availability/route.ts | GET | Auth: CRON_SECRET (Bearer) | CRON_SECRET | Kjører runScraper |

### C) Bakgrunnsjobber, køer, cron, webhooks
| Jobb/webhook | Trigger | Filsti | Retry/feilhåndtering | Viktige avhengigheter |
|---|---|---|---|---|
| Sauna Scraper (GitHub Actions) | Cron: */5 * * * * | .github/workflows/scraper.yml | GitHub Actions retry policy | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, Playwright Chromium, scripts/run_scraper.ts |
| Scraper API (cron) | HTTP GET (CRON_SECRET) | src/app/api/cron/scrape-availability/route.ts | Returnerer 401/500 ved feil | runScraper, Prisma |
| Cache warmer API (cron) | HTTP GET (CRON_SECRET) | src/app/api/cron/warm-cache/route.ts | Promise.allSettled; returnerer successCount | getActiveSaunas, fetch |
| Lighthouse scan (manuell) | HTTP POST fra admin | src/app/api/lighthouse/scan/route.ts | Oppdaterer status på error/exit | scripts/daily_lighthouse_scan.mjs, Prisma, Chrome |
| Lighthouse batch (script) | NPM script | scripts/daily_lighthouse_scan.mjs | Håndterer errors per URL | Prisma, Chrome Launcher |
| Warm cache (script) | Manuell kjøring | scripts/warm_cache.mjs | Loggfører errors, fortsetter | /api/saunas/slugs, HTTP fetch |

## 7) Kontrakter du ikke bryter
- Prisma schema og migrasjoner: prisma/schema.prisma og prisma/migrations/**/migration.sql
- Auth-cookie format og sessionlogikk: src/lib/auth.ts (cookie name: session, JWT HS256)
- Admin-guard i server actions og API: src/lib/auth-guard.ts + requireAdmin-bruk i src/app/api/media/** og admin actions
- Sauna availability dataformat: src/lib/availability-scraper.ts og src/lib/availability-service.ts (availabilityData JSON { days, timestamp })
- Media storage: src/lib/media-service.ts (Supabase bucket: images, URL-format brukt i MediaAsset.storageKey*)
- Sauna.gallery og Sauna.imageUrl lagring: oppdateres i src/app/api/media/confirm/route.ts, src/app/api/media/reorder/route.ts, src/app/api/media/[id]/route.ts
- Analytics ingest kontrakt: src/app/api/analytics/ingest/route.ts (IngestSchema)
- Consent/Privacy kontrakter: src/app/api/privacy/consent/route.ts, prisma modeller ConsentLog/PrivacySession
- Lighthouse scan flow: src/app/api/lighthouse/scan/route.ts + scripts/daily_lighthouse_scan.mjs

## 8) Endringsdisiplin
- Små, målrettede endringer per commit.
- Rotårsak fremfor symptombehandling.
- Ikke endre config/regler uten siste utvei og begrunnelse.
- Ikke introduser ny teknisk gjeld.

## 9) Verifikasjon før ferdig (for fremtidig arbeid)
Minimum:
- Build: `npm run build`
- Lint: `npm run lint`

Når relevant:
- Storybook: `npm run storybook` eller `npm run build-storybook`
- Prisma: `npx prisma generate` (kjøres også via postinstall)
- Test/typecheck: Uavklart – ingen scripts definert per nå

## 10) Oppdateringsregel for AGENTS.md
Hvis du oppdager nye scripts, endret arbeidsflyt, nye mapper, nye CI-krav eller kontrakter, oppdater AGENTS.md i samme endring.

---

## Historikk (bevart fra tidligere AGENTS.md)
### [2026-01-26] Antigravity
Status: Build Passing, Linting in Progress (227 issues remaining, down from 1000+)

Oppsummerte tiltak (fra tidligere logg):
- Admin dashboard refaktor (SaunaSortableTable, AdminLayout, SaunaForm)
- Type-sikkerhet i server actions (dashboard-actions, apningstider/actions, badstuer/actions, media/actions)
- Offentlige sider optimalisert (page.tsx, medlemskap/page.tsx, sitemap.ts)
- Media management forbedringer (MediaGrid, MediaDropzone)
- ConsentBanner fixes

Uavklart:
- Neste steg fra tidligere logg: lint-warnings, error boundaries, verifisere Lighthouse-score.
