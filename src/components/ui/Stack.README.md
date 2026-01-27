# Stack

Kort beskrivelse: Fleksibel layout-komponent for jevne mellomrom.

## Bruk
- Bruk for vertikale eller horisontale lister.
- Bruk `gap` for konsistent spacing.

## Ikke bruk
- Ikke bruk når grid er mer passende.

## Retningslinjer for innhold
- Hold gap konsekvent innen samme seksjon.

## Props (kort)
- `direction`: `row` eller `column`.
- `gap`: Verdier 1–8 (koblet til `--space-*`).
- `wrap`: Tillat linjebryting.

## Eksempler
```tsx
<Stack direction="row" gap={4}>
  <Button>Ja</Button>
  <Button variant="outline">Nei</Button>
</Stack>
```

## Tilgjengelighet
- Sørg for logisk tab-rekkefølge når elementer bryter linje.

## Vedlikehold/Notater
- `gap` bruker CSS-variabler, oppdateres i tokens.

## Gjør
- Bruk `gap` for jevne mellomrom.
- Hold samme retning i samme gruppe.

## Unngå
- Ikke bruk til komplekse grid-oppsett.
- Ikke bland retninger uten god grunn.
