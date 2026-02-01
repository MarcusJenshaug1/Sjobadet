# SaunaBookingOptions

Kort beskrivelse: Kort med valg for drop-in og privat booking.

## Bruk
- Bruk på badstuesider for å starte booking.

## Ikke bruk
- Ikke bruk hvis booking-URL-er mangler og kapasitet er 0.

## Retningslinjer for innhold
- Hold tekstene korte og tydelige.

## Props (kort)
- `saunaId`: ID for badstuen.
- `saunaName`: Navn på badstue.
- `capacityDropin`: Kapasitet for drop-in.
- `capacityPrivat`: Kapasitet for privat booking.
- `bookingUrlDropin`: URL for drop-in booking.
- `bookingUrlPrivat`: URL for privat booking.

## Eksempler
```tsx
<SaunaBookingOptions saunaId="1" saunaName="Tønsberg" capacityDropin={8} capacityPrivat={10} />
```

## Tilgjengelighet
- Kortene er knapper med tydelig tekst.

## Vedlikehold/Notater
- Åpner booking direkte i ny fane fra kortene.

## Gjør
- Gi tydelige beskrivelser av booking-typer.
- Vis kapasitet der det er relevant.

## Unngå
- Ikke skjul at en bookingtype er utilgjengelig.
- Ikke bruk uklare label-tekster.
