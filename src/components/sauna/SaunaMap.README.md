# SaunaMap

Kort beskrivelse: Kartvisning for badstueadresse.

## Bruk
- Bruk for å vise lokasjon med iframe-kart.

## Ikke bruk
- Ikke bruk uten `mapEmbedUrl`.

## Retningslinjer for innhold
- Vis tydelig adresse over kartet.

## Props (kort)
- `address`: Adresse som vises over kartet.
- `mapEmbedUrl`: Iframe-URL til kart.
- `saunaName`: Brukes i `title`.

## Eksempler
```tsx
<SaunaMap address="Nedre Langgate 44" mapEmbedUrl="https://..." saunaName="Tønsberg" />
```

## Tilgjengelighet
- Iframe har beskrivende `title`.

## Vedlikehold/Notater
- Kartet lastes inn når komponenten er synlig.

## Gjør
- Bruk riktig adresse og tittel.
- Gi brukeren mulighet til å laste inn kart.

## Unngå
- Ikke bruk uten `mapEmbedUrl`.
- Ikke bruk i områder med strenge personvernkrav uten vurdering.
