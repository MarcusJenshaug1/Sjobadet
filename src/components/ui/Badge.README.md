# Badge

Kort beskrivelse: Liten status- eller kategori-etikett.

## Bruk
- Bruk for korte statuser som «Åpen», «Stengt» og «Nyhet».
- Bruk konsekvente farger for samme type status.

## Ikke bruk
- Ikke bruk som knapp eller interaktivt element.
- Ikke bruk lange tekster.

## Retningslinjer for innhold
- Hold teksten kort (1–2 ord).
- Bruk store/små bokstaver konsekvent.

## Props (kort)
- `variant`: Fargevariant (`default`, `success`, `warning`, `danger`, `info`, `neutral`).
- `size`: Størrelse (`sm`, `md`, `lg`).

## Eksempler
```tsx
<Badge variant="success">Åpen</Badge>
<Badge variant="warning">Begrenset</Badge>
```

## Tilgjengelighet
- Ikke bruk kun farge for å formidle status; inkluder tekst.

## Vedlikehold/Notater
- Bruk samme variant for samme status gjennom hele appen.

## Gjør
- Hold teksten kort og konsistent.
- Bruk samme farge for samme betydning.

## Unngå
- Ikke bruk som knapp.
- Ikke bruk lange setninger.
