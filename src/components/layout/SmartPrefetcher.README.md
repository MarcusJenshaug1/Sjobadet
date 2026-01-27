# SmartPrefetcher

Kort beskrivelse: Prefetcher ruter når nettverket tillater det.

## Bruk
- Bruk globalt i appen for raskere navigasjon.

## Ikke bruk
- Ikke bruk på enheter med begrenset data der det er uønsket.

## Retningslinjer for innhold
- Ingen visuelt innhold.

## Props (kort)
- Ingen props.

## Eksempler
```tsx
<SmartPrefetcher />
```

## Tilgjengelighet
- Ingen direkte effekt på tilgjengelighet.

## Vedlikehold/Notater
- Bruker Speculation Rules API når tilgjengelig.

## Gjør
- Bruk på offentlige sider med høy trafikk.
- Test at prefetch ikke påvirker LCP.

## Unngå
- Ikke bruk på nettverk med databesparelse.
- Ikke prefetch for store sider uten behov.
