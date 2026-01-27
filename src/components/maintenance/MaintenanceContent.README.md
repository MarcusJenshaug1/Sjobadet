# MaintenanceContent

Kort beskrivelse: Vedlikeholdsside med liste over badstuer og bookinglenker.

## Bruk
- Bruk når hele tjenesten er i vedlikeholdsmodus.

## Ikke bruk
- Ikke bruk som vanlig innholdsside.

## Retningslinjer for innhold
- Bruk tydelig tittel og status.
- Oppgi tidspunkt for sist oppdatering.

## Props (kort)
- `saunas`: Snapshot av badstuer med booking-URL.
- `generatedAt`: Tidspunkt for snapshot.

## Eksempler
```tsx
<MaintenanceContent saunas={[]} generatedAt="26.01.2026 12:00" />
```

## Tilgjengelighet
- Tekst er høykontrast og sentrert.

## Vedlikehold/Notater
- Brukes sammen med vedlikeholdsmodus i admin.

## Gjør
- Oppgi sist oppdatert tidspunkt.
- Hold teksten rolig og informativ.

## Unngå
- Ikke bruk for kampanjer.
- Ikke skjul statusinformasjon.
