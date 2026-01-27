# Section

Kort beskrivelse: Vertikal spacing-blokk for å separere innhold.

## Bruk
- Bruk for å skape rytme mellom store innholdsblokker.
- Kombiner med `Container`.

## Ikke bruk
- Ikke bruk for små avstander; bruk `Stack` eller CSS i stedet.

## Retningslinjer for innhold
- Bruk størrelse som matcher innholdets betydning.

## Props (kort)
- `as`: Render som annet element (`section`, `div`, osv.).
- `size`: Vertikal padding (`sm`, `md`, `lg`).

## Eksempler
```tsx
<Section size="lg">
  <Container>...</Container>
</Section>
```

## Tilgjengelighet
- Bruk `section` når innholdet er semantisk en egen seksjon.

## Vedlikehold/Notater
- Endringer i spacing skal gjøres i CSS-modulen.

## Gjør
- Bruk `Section` for tydelig vertikal rytme.
- Velg størrelse ut fra innholdets betydning.

## Unngå
- Ikke bruk for små mellomrom.
- Ikke bruk `Section` når `Stack` er mer passende.
