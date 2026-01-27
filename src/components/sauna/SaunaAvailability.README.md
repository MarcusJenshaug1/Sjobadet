# SaunaAvailability

Kort beskrivelse: Viser ledige tider og kapasitet for drop-in.

## Bruk
- Bruk på badstuesider for å vise tilgjengelighet.

## Ikke bruk
- Ikke bruk når API ikke er tilgjengelig.

## Retningslinjer for innhold
- Vis kun relevante tider for i dag/kommende dag.

## Props (kort)
- `saunaId`: ID for badstuen.
- `bookingUrlDropin`: URL for drop-in booking.
- `capacityDropin`: Kapasitet for drop-in.
- `isAdmin`: Admin-visning.
- `showAvailability`: Skjul/vis tilgjengelighet.

## Eksempler
```tsx
<SaunaAvailability saunaId="1" capacityDropin={10} />
```

## Tilgjengelighet
- Knappetekst og tidsinformasjon er tekstlig.

## Vedlikehold/Notater
- Henter data fra API og cacher i minne.

## Gjør
- Vis tilgjengelighet når API er tilgjengelig.
- Bruk `capacityDropin` for riktig status.

## Unngå
- Ikke vis tomme lister uten forklaring.
- Ikke bruk uten `saunaId`.
