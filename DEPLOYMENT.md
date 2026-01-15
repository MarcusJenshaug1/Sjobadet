# Deployment Guide - Sjobadet

Denne guiden viser deg steg-for-steg hvordan du deployer applikasjonen til produksjon.

## Forutsetninger

- [ ] Git installert
- [ ] GitHub/GitLab konto
- [ ] Vercel konto (gratis: https://vercel.com/signup)

---

## Steg 1: Klargjør Git Repository

```bash
# Initialiser git (hvis ikke allerede gjort)
git init

# Legg til alle filer
git add .

# Commit
git commit -m "Ready for production deployment"

# Opprett repository på GitHub og koble til
git remote add origin https://github.com/ditt-brukernavn/sjobadet.git
git branch -M main
git push -u origin main
```

---

## Steg 2: Sett opp Database

### 1. Database Setup

**Anbefalt: Supabase PostgreSQL (Gratis tier)**

Supabase gir deg:
- ✅ 500MB database (gratis)
- ✅ Unlimited API requests
- ✅ Database dashboard og SQL editor
- ✅ Automatiske backups
- ✅ Realtime subscriptions (bonus!)

**Steg-for-steg Supabase setup:**

1. **Opprett konto**: Gå til [supabase.com](https://supabase.com) og registrer deg
2. **Opprett prosjekt**: 
   - Klikk "New Project"
   - Velg organisasjon (eller opprett ny)
   - Prosjektnavn: `sjobadet` (eller ditt valg)
   - Database Password: **Velg et sterkt passord og lagre det!**
   - Region: **Europe (Frankfurt)** eller **Europe (London)** (nærmest Norge)
   - Klikk "Create new project"
3. **Hent connection string**:
   - Gå til Settings → Database
   - Scroll ned til "Connection string"
   - Velg **"Transaction"** mode (anbefalt for Prisma)
   - Kopier connection string
   - Erstatt `[YOUR-PASSWORD]` med passordet du valgte
   
   Eksempel:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

> [!TIP]
> **Connection Pooling**: Supabase tilbyr to connection modes:
> - **Transaction mode** (port 6543): Anbefalt for Prisma - bruker connection pooling
> - **Session mode** (port 5432): Direkte connection - bruk hvis du får problemer
> - **Direct connection** (port 5432): Bruk for migrasjoner hvis transaction mode feiler

**Alternativ: Vercel Postgres**

1. Gå til [Vercel Dashboard](https://vercel.com/dashboard)
2. Opprett Storage → Postgres database
3. Kopier `POSTGRES_URL`

**Alternativ: Railway**

1. Gå til [Railway](https://railway.app)
2. Opprett nytt prosjekt → Add PostgreSQL
3. Kopier `DATABASE_URL`

---

## Steg 3: Deploy til Vercel

1. Gå til https://vercel.com/new
2. Klikk "Import Git Repository"
3. Velg ditt GitHub repository
4. Konfigurer:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Legg til Environment Variables**:

   Klikk "Environment Variables" og legg til:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | `<din-postgres-connection-string>` |
   | `SESSION_SECRET` | Generer med kommando under |
   | `ADMIN_USERNAME` | `admin` (eller ditt valg) |
   | `ADMIN_PASSWORD` | **Sterkt passord!** |

   **Generer SESSION_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

6. Klikk **"Deploy"**

7. Vent på at bygget fullføres (~2-3### 3. Database Migration

Etter første deployment, kjør database migrasjoner:

**Metode 1: Lokal kjøring mot Supabase (Anbefalt)**

```bash
# Sett DATABASE_URL til Supabase connection string
# VIKTIG: Bruk DIRECT connection (port 5432) for migrasjoner!
export DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Kjør migrasjoner
npx prisma migrate deploy

# Seed database med initial data (valgfritt)
npx prisma db seed
```

> [!IMPORTANT]
> **Supabase Connection Modes**:
> - For **migrasjoner**: Bruk **Direct connection** (port 5432) eller Session mode
> - For **runtime** (i Vercel): Bruk **Transaction mode** (port 6543) for bedre performance
> 
> Du finner begge connection strings i Supabase Dashboard → Settings → Database

**Metode 2: Via Vercel CLI**

```bash
# Installer Vercel CLI
npm i -g vercel

# Login og link prosjekt
vercel login
vercel link

# Pull environment variables
vercel env pull .env.production

# Endre DATABASE_URL til direct connection midlertidig
# Kjør migrasjoner
npx prisma migrate deploy

# Endre tilbake til transaction mode i Vercel dashboard
```

**Metode 3: Via Supabase SQL Editor**

Du kan også kjøre migrasjoner direkte i Supabase:
1. Gå til Supabase Dashboard → SQL Editor
2. Kopier SQL fra `prisma/migrations/` mappene
3. Kjør SQL manuelt (ikke anbefalt for komplekse migrasjoner)   ```

---

## Steg 5: Verifiser Deployment


**Sjekkliste:**
- [ ] Hjemmeside laster
- [ ] Saunaer vises
- [ ] Admin login fungerer (`/admin`)
- [ ] Database operasjoner fungerer
- [ ] Analytics tracker
- [ ] Bilder laster

---

## Steg 6: Custom Domain (Valgfritt)

1. Gå til Vercel → Settings → Domains
2. Legg til ditt domene (f.eks. `sjobadet.no`)
3. Følg DNS-instruksjonene
4. HTTPS settes opp automatisk

---

## Continuous Deployment

Hver gang du pusher til `main` branch, deployer Vercel automatisk:

```bash
# Gjør endringer
git add .
git commit -m "Update feature"
git push origin main

# Vercel deployer automatisk! 🚀
```

---

## Troubleshooting

### "Prisma Client not generated"
**Fix:** Sjekk at `postinstall` script finnes i `package.json`

### Database connection timeout
**Fix:** Verifiser at `DATABASE_URL` er korrekt i Vercel environment variables

### Session fungerer ikke
**Fix:** Sørg for at `SESSION_SECRET` er satt

### Build feil
**Fix:** Sjekk build logs i Vercel dashboard for detaljer

---

## Support

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs
