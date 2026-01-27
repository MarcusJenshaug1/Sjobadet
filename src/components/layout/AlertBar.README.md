# AlertBar

Kort beskrivelse: Varsellinje for viktig informasjon øverst på siden.

## Bruk
- Bruk for driftsmeldinger og midlertidige varsler.
- Hold teksten kort og konkret.

## Ikke bruk
- Ikke bruk for markedsføring eller lang forklaring.
- Ikke bruk når beskjeden kan ligge som vanlig innhold.

## Retningslinjer for innhold
- 1–2 setninger, maks 120 tegn.
- Start med det viktigste budskapet.

## Props (kort)
- `alert_enabled`: Slår visning av/på.
- `alert_text`: Selve meldingen.

## Eksempler
```tsx
<AlertBarView alert_enabled alert_text="Vi holder stengt mandag." />
```

## Tilgjengelighet
- Bruk tydelig tekst og god kontrast.

## Vedlikehold/Notater
- Server-komponenten `AlertBar` henter data fra globale innstillinger.

## Gjør
- Hold meldingen kort og tydelig.
- Bruk den kun for kritiske driftsmeldinger.

## Unngå
- Ikke bruk for markedsføring.
- Ikke bruk lange avsnitt.
