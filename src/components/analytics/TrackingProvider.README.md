# TrackingProvider

Kort beskrivelse: Wrapper som håndterer samtykke og sporing av sidevisninger.

## Bruk
- Bruk på toppnivå rundt hele appen.

## Ikke bruk
- Ikke bruk i isolerte komponenter.

## Retningslinjer for innhold
- Barn bør være full app eller sideinnhold.

## Props (kort)
- `children`: Innholdet som skal spores.
- `isAdmin`: Deaktiverer sporing og banner for admin.

## Eksempler
```tsx
<TrackingProvider isAdmin={false}>
  <App />
</TrackingProvider>
```

## Tilgjengelighet
- Samtykkebanneret vises kun når det er relevant.

## Vedlikehold/Notater
- Lytter på `consentChange` og sporer sidevisninger via `trackPageview`.

## Gjør
- Plasser høyt i treet (rundt hele appen).
- Skru av sporing for admin-brukere.

## Unngå
- Ikke bruk flere nested providers.
- Ikke spor uten samtykke.
