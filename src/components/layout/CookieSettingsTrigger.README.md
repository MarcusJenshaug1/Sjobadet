# CookieSettingsTrigger

Kort beskrivelse: Knapp som åpner samtykkeinnstillinger.

## Bruk
- Bruk i personvernsider eller footer.

## Ikke bruk
- Ikke bruk der samtykke ikke er relevant.

## Retningslinjer for innhold
- Teksten bør være tydelig og kort.

## Props (kort)
- `label`: Tekst for knappen (standard: «Personvernvalg»).

## Eksempler
```tsx
<CookieSettingsTrigger label="Personvernvalg" />
```

## Tilgjengelighet
- Knappen har `aria-label` lik teksten.

## Vedlikehold/Notater
- Trigger sender `openConsentSettings`-event.

## Gjør
- Bruk konsistent tekst på tvers av siden.
- Plasser knappen der brukeren forventer personvernvalg.

## Unngå
- Ikke bruk uklare eller interne begreper.
- Ikke skjul knappen i utydelig UI.
