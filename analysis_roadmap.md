# Sjøbadet Badstue: Prosjektanalyse & Roadmap

Denne analysen gir en oversikt over nåværende status, identifiserer forbedringspotensial og foreslår nye funksjoner for å løfte løsningen videre.

## 📊 Nåværende Status
Prosjektet er nylig migrert til en fullverdig Next.js-applikasjon med database-støtte (Prisma/SQLite). Kjernedesignet er moderne og premium, og de viktigste administrasjonsverktøyene er på plass.

## 🛠️ Tekniske Forbedringer (Høy Prioritet)

### 1. Bildeoptimalisering
- **Problem**: Flere steder (f.eks. `SaunaCard`) brukes vanlige `<img>`-tagger.
- **Løsning**: Bytt til Next.js `<Image />`-komponent for automatisk resizing, formatkonvertering (WebP) og lazy loading. Dette vil forbedre Google PageSpeed-scoren betydelig.

### 2. Dynamisk SEO & Sitemap
- **Problem**: `sitemap.ts` henter data fra en utdatert JSON-fil. Metadata er ufullstendig på enkelte undersider.
- **Løsning**: Oppdater sitemap-generatoren til å bruke Prisma. Legg til OpenGraph-bilder for bedre deling i sosiale medier.

### 3. Kodekonsistens
- **Problem**: En blanding av inline styles i `page.tsx` og CSS Modules.
- **Løsning**: Flytt inline styles til dedikerte CSS-moduler for bedre gjenbruk og renere kode. Rydd opp i resterende `any`-typer i TypeScript.

## ✨ Nye Funksjoner (Roadmap)

### 1. Administrasjon av Nettside-innstillinger
- **Status**: Database-skjema er klart, men grensesnitt mangler.
- **Funksjon**: Lag en "Innstillinger"-side i adminpanel der man kan endre:
  - Global varslingslinje (f.eks. ved driftsstans eller kampanjer).
  - Kontaktinformasjon i footer.
  - Sosiale medier-lenker.

### 2. Bildeopplasting (Media Library)
- **Status**: Nåværende løsning krever eksterne lenker.
- **Funksjon**: Integrer Vercel Blob eller Cloudinary for å tillate direkte opplasting av bilder fra admin-panel. Dette fjerner behovet for å hoste bilder eksternt.

### 3. Kontakt- og Bookingsystem
- **Funksjon**: 
  - **Kontaktskjema**: Enkel vei for bedrifter og kunder å ta kontakt.
  - **Integrert Booking**: I stedet for bare utlenker, vis tilgjengelighet direkte på siden (krever API-integrasjon med periode.no eller lignende).

### 4. Nyhetsbrev & Blogg
- **Funksjon**: En enkel "Nyheter"-seksjon for å dele oppdateringer, arrangementer og badstuetips. Dette er svært bra for SEO.

### 5. Brukeranmeldelser (Social Proof)
- **Funksjon**: Mulighet for å legge inn kundasitater og anmeldelser manuelt i admin, som vises på forsiden og badstuesidene.

## 📈 Prioritert Rekkefølge
1. **Fiks Sitemap & Bildeoptimalisering** (Hurtiggevinster for SEO/fart).
2. **Implementer Innstillinger-UI** (Viktig for admin-fleksibilitet).
3. **Refaktorer til CSS Modules** (Teknisk gjeld).
4. **Legg til Kontaktskjema**.

---
*Denne analysen er utarbeidet av Antigravity.*
