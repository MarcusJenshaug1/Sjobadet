# ErrorBoundary

Kort beskrivelse: Fanger runtime-feil og viser fallback i UI.

## Bruk
- Bruk rundt komponenter som kan feile.

## Ikke bruk
- Ikke bruk som generell try/catch for alle sider uten å vurdere behov.

## Retningslinjer for innhold
- Fallback bør være kort og gi neste steg.

## Props (kort)
- `children`: Komponenttreet som skal beskyttes.
- `fallback`: Valgfri funksjon som returnerer custom UI.

## Eksempler
```tsx
<ErrorBoundary>
  <PotensieltUstabilKomponent />
</ErrorBoundary>
```

## Tilgjengelighet
- Fallback har `role="alert"` og tydelig tekst.

## Vedlikehold/Notater
- Logger feil til konsoll i `componentDidCatch`.

## Gjør
- Gi brukeren en tydelig next-step.
- Bruk fallback for kritiske områder.

## Unngå
- Ikke skjul feil uten beskjed.
- Ikke bruk for kontrollflyt.
