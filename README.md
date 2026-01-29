This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Design System & Storybook

Vi bruker [Storybook](https://storybook.js.org/) for å dokumentere våre design-foundations og komponenter. Dette fungerer som prosjektets "single source of truth" for UI.

### Slik kjører du Storybook
For å starte Storybook lokalt, kjør:
```bash
npm run storybook
```
Dette åpner et dashboard på `http://localhost:6006`.

### Hostet Storybook (/storybook)
Storybook bygges statisk til `public/storybook` via:
```bash
npm run build-storybook
```
I deploys er Storybook tilgjengelig på `/storybook`, men er beskyttet av middleware som krever innlogget admin-session. Uautoriserte brukere blir redirectet til `/admin/login`.

### Struktur
- **Foundations**: Dokumentasjon av farger, flater og typografi.
- **Components**: Alle React-komponenter, organisert etter kategori (UI, Layout, Sauna, Admin).

Nye komponenter skal alltid ha en tilhørende `.stories.tsx`-fil i samme mappe.

### Dokumentasjon
- UI system og regler: [docs/ui-system.md](docs/ui-system.md)
- Global UI audit: [docs/ui-audit.md](docs/ui-audit.md)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Yr badetemperaturer (nærmeste)

Vi viser nærmeste badetemperatur på badstue-sidene via Yr sitt API. Nøkkelen må ligge på serveren og må ikke eksponeres i klienten.

### Miljøvariabel
- `YR_BADETEMP_APIKEY`: Hent nøkkel ved å sende e-post til support@yr.no med emne “Forespørsel om API-nøkkel til badetemperaturer”.
- `GEOCODING_USER_AGENT` og `GEOCODING_CONTACT_EMAIL`: Brukes av Nominatim (OpenStreetMap) for automatisk geokoding av gateadresse.

### Caching
- On-demand caching med 24t TTL lagres per badstue i databasen.
- Hvis cache er eldre enn 24t, returneres sist kjente verdi umiddelbart, og oppdatering skjer i bakgrunnen.

### Geokoding
- Når `latitude`/`longitude` mangler ved lagring i admin, forsøker vi å geokode `Gateadresse` via Nominatim.

### Feil og ingen data
- Hvis Yr ikke har data (f.eks. eldre enn 5 døgn), vises en nøytral «Ingen data»-tilstand.
- UI fungerer også hvis Yr er nede.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
