# ContactForm

Kort beskrivelse: Skjema for å sende henvendelser til kundeservice.

## Bruk
- Bruk når brukeren skal sende en fri tekstmelding.
- Bruk i offentlige infosider eller supportsider.

## Ikke bruk
- Ikke bruk til innlogging eller registrering.
- Ikke bruk når du trenger avansert validering eller vedlegg (lag egen løsning).

## Retningslinjer for innhold
- Hold feltene korte og relevante.
- Bruk tydelige etiketter og korte plassholdertekster.

## Props (kort)
- Ingen props. Komponenten håndterer egen intern tilstand.

## Eksempler
```tsx
<ContactForm />
```

## Tilgjengelighet
- Etiketter er koblet til feltene via `htmlFor`/`id`.
- Knappen er alltid tekstlig beskrevet.

## Vedlikehold/Notater
- API-kall er simulert i komponenten. Bytt ut med faktisk integrasjon ved behov.

## Gjør
- Bruk klare feltetiketter.
- Hold skjemaet kort.

## Unngå
- Ikke legg inn for mange felt.
- Ikke bruk uklare placeholder-tekster.
