# ScrollToTop

Kort beskrivelse: Skroller til toppen ved rutenavigasjon.

## Bruk
- Bruk globalt i appen når navigasjon skal starte øverst.

## Ikke bruk
- Ikke bruk på sider der scroll-posisjon skal bevares.

## Retningslinjer for innhold
- Ingen visuelt innhold.

## Props (kort)
- Ingen props.

## Eksempler
```tsx
<ScrollToTop />
```

## Tilgjengelighet
- Påvirker ikke fokus eller aria.

## Vedlikehold/Notater
- Kaller `window.scrollTo` ved ruteendring.

## Gjør
- Bruk der navigasjon skal starte på toppen.
- Test på mobil og desktop.

## Unngå
- Ikke bruk på sider som skal beholde scroll-posisjon.
- Ikke bruk sammen med egne scroll-håndterere.
