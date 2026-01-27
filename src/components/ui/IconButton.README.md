# IconButton

Kort beskrivelse: Knapp for ikon-baserte handlinger.

## Bruk
- Bruk når ikonet er selvforklarende (f.eks. lukk, søk, favoritt).
- Bruk `aria-label` med tydelig tekst.

## Ikke bruk
- Ikke bruk når handlingen trenger forklaring; bruk `Button` med tekst.

## Retningslinjer for innhold
- Hold ikonstørrelse konsistent (16–20px).

## Props (kort)
- `variant`: `ghost`, `outline`, `solid`.
- `size`: `sm`, `md`, `lg`.
- `aria-label`: Obligatorisk for skjermlesere.

## Eksempler
```tsx
<IconButton aria-label="Lukk">
  <X size={18} />
</IconButton>
```

## Tilgjengelighet
- `aria-label` er påkrevd.
- Unngå handlinger kun via farge/ikon uten tekst i UI.

## Vedlikehold/Notater
- Bruk konsistente ikoner fra samme ikonsett.

## Gjør
- Bruk `aria-label` på alle ikonknapper.
- Hold ikonstørrelse konsekvent.

## Unngå
- Ikke bruk for uklare handlinger.
- Ikke bruk som primær handling uten tekst.
