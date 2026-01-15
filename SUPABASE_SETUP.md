# Supabase PostgreSQL Setup Guide

Denne guiden viser deg hvordan du setter opp Supabase PostgreSQL for produksjon.

## Hvorfor Supabase?

- ✅ **Gratis tier**: 500MB database, unlimited API requests
- ✅ **Europeisk server**: Frankfurt eller London (lav latency fra Norge)
- ✅ **Dashboard**: Visuell database editor og SQL editor
- ✅ **Automatiske backups**: Daglige backups inkludert
- ✅ **Connection pooling**: Bedre performance
- ✅ **Realtime**: Bonus features som realtime subscriptions

---

## Steg 1: Opprett Supabase Prosjekt

1. Gå til [supabase.com](https://supabase.com)
2. Klikk "Start your project" → Sign up (bruk GitHub for enklere pålogging)
3. Klikk "New Project"
4. Fyll ut:
   - **Organization**: Velg eller opprett ny
   - **Name**: `sjobadet` (eller ditt valg)
   - **Database Password**: **VIKTIG! Velg et sterkt passord og lagre det!**
   - **Region**: **Europe (Frankfurt)** eller **Europe (London)**
   - **Pricing Plan**: Free
5. Klikk "Create new project"
6. Vent 1-2 minutter mens prosjektet settes opp

---

## Steg 2: Hent Connection Strings

### For Runtime (Vercel deployment)

1. Gå til **Settings** (venstre sidebar) → **Database**
2. Scroll ned til **Connection string**
3. Velg **Transaction** mode
4. Kopier connection string
5. Erstatt `[YOUR-PASSWORD]` med passordet du valgte i steg 1

**Eksempel**:
```
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

> [!TIP]
> **Transaction mode** (port 6543) bruker connection pooling og er perfekt for Next.js i produksjon.

### For Database Migrations

1. I samme **Connection string** seksjon
2. Velg **Session** mode eller **Direct connection**
3. Kopier connection string (port 5432)

**Eksempel**:
```
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

> [!IMPORTANT]
> Bruk **Direct connection** (port 5432) når du kjører `prisma migrate deploy`.
> Transaction mode støtter ikke alle Prisma migration kommandoer.

---

## Steg 3: Konfigurer Environment Variables

### I Vercel Dashboard

1. Gå til ditt Vercel prosjekt → **Settings** → **Environment Variables**
2. Legg til:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.xxxxx:[PASSWORD]@...6543/postgres` | Production |
| `SESSION_SECRET` | Generer med kommando under | Production |
| `ADMIN_USERNAME` | `admin` | Production |
| `ADMIN_PASSWORD` | Sterkt passord | Production |

**Generer SESSION_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Steg 4: Oppdater Prisma Schema

Endre `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Endret fra "sqlite"
  url      = env("DATABASE_URL")
}
```

Commit endringen:
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push origin main
```

---

## Steg 5: Kjør Database Migrations

**Lokalt mot Supabase**:

```bash
# Sett DATABASE_URL til DIRECT connection (port 5432)
export DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Kjør migrasjoner
npx prisma migrate deploy

# Seed database (valgfritt)
npx prisma db seed
```

**Verifiser i Supabase Dashboard**:
1. Gå til **Table Editor** (venstre sidebar)
2. Du skal nå se alle tabellene: `Sauna`, `OpeningHour`, `PriceItem`, etc.

---

## Steg 6: Deploy til Vercel

1. Push koden til GitHub
2. Vercel deployer automatisk
3. Sjekk at deployment lykkes
4. Besøk din URL: `https://your-app.vercel.app`

---

## Supabase Dashboard Features

### Table Editor
- Visuell editor for å se og redigere data
- Legg til/slett rader direkte
- Perfekt for testing

### SQL Editor
- Kjør custom SQL queries
- Lagre ofte brukte queries
- Eksporter data

### Database Backups
- Automatiske daglige backups (gratis tier: 7 dager)
- Manuell backup: Settings → Database → Backups

### Logs
- Se database queries i real-time
- Debug connection issues

---

## Connection Modes Forklart

| Mode | Port | Bruk | Fordeler |
|------|------|------|----------|
| **Transaction** | 6543 | Runtime (Vercel) | Connection pooling, bedre performance |
| **Session** | 5432 | Migrations | Full PostgreSQL support |
| **Direct** | 5432 | Migrations | Direkte connection, ingen pooling |

**Anbefaling**:
- **Production runtime**: Transaction mode (6543)
- **Migrations**: Direct/Session mode (5432)

---

## Troubleshooting

### "Connection timeout"
**Fix**: Sjekk at du har erstattet `[YOUR-PASSWORD]` med ditt faktiske passord.

### "Prepared statement already exists"
**Fix**: Bruk Direct connection (port 5432) for migrasjoner, ikke Transaction mode.

### "Too many connections"
**Fix**: Bruk Transaction mode (port 6543) for runtime - det har connection pooling.

### "Database does not exist"
**Fix**: Sjekk at connection string ender med `/postgres` (database navnet).

---

## Kostnader

**Free tier inkluderer**:
- 500MB database storage
- Unlimited API requests
- 50,000 monthly active users
- 2GB bandwidth
- 7 dager backups

**Når du vokser**:
- Pro: $25/måned (8GB database, 50GB bandwidth)
- Team: $599/måned (custom limits)

---

## Neste Steg

✅ Supabase database er satt opp!

Følg resten av [DEPLOYMENT.md](./DEPLOYMENT.md) for å fullføre deployment til Vercel.
