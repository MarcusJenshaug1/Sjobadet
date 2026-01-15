# Database Migration Guide

## Switching from SQLite (Development) to PostgreSQL (Production)

Når du er klar til å deploye til produksjon, må du oppdatere Prisma schema til å bruke PostgreSQL.

### Steg 1: Oppdater schema.prisma

Endre `datasource db` i `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Endret fra "sqlite"
  url      = env("DATABASE_URL")
}
```

### Steg 2: Generer ny migrasjon

```bash
# Generer ny migrasjon for PostgreSQL
npx prisma migrate dev --name switch_to_postgresql
```

### Steg 3: Deploy til produksjon

Når du deployer til Vercel:
1. Sett `DATABASE_URL` til din PostgreSQL connection string i Vercel environment variables
2. Kjør `npx prisma migrate deploy` for å kjøre migrasjoner

### Viktig: Lokal utvikling

For lokal utvikling kan du fortsette å bruke SQLite. Bare sørg for at:
- `.env` har `DATABASE_URL="file:./dev.db"`
- `schema.prisma` har `provider = "sqlite"`

Eller du kan sette opp en lokal PostgreSQL database for utvikling også.

### Alternativ: Bruk miljøvariabler for provider

Du kan også bruke miljøvariabler for å velge provider dynamisk, men dette krever mer avansert oppsett.

## Automatisk ved deployment

Når du deployer til Vercel:
1. Vercel setter automatisk `DATABASE_URL` til din PostgreSQL database
2. `postinstall` script kjører `prisma generate` automatisk
3. Du må manuelt kjøre `prisma migrate deploy` første gang

Dette er dokumentert i `DEPLOYMENT.md`.
