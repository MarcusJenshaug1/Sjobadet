# SaunaMediaManager

Kort beskrivelse: Komplett administrasjon av hovedbilde og galleri for badstue.

## Bruk
- Bruk i admin når man skal laste opp og sortere bilder.

## Ikke bruk
- Ikke bruk i offentlig UI.

## Retningslinjer for innhold
- Begrens galleri til maks 20 bilder.
- Gi tydelige statusindikasjoner.

## Props (kort)
- `saunaId`: ID for badstuen.
- `initialAssets`: Startliste med eksisterende media.

## Eksempler
```tsx
<SaunaMediaManager saunaId="1" initialAssets={[]} />
```

## Tilgjengelighet
- Sørg for at viktige knapper har `aria-label`.

## Vedlikehold/Notater
- Avhengig av API-endepunkter for opplasting.

## Gjør
- Hold galleri under 20 bilder.
- Bruk hovedbilde for beste førstinntrykk.

## Unngå
- Ikke bruk i offentlig UI.
- Ikke start opplasting uten visuell feedback.
