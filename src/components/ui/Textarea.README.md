# Textarea

Kort beskrivelse: Flerlinjet tekstfelt for meldinger og beskrivelser.

## Bruk
- Bruk for lengre fritekst som kommentarer og beskrivelser.

## Ikke bruk
- Ikke bruk for korte, enkle input (bruk `Input`).

## Retningslinjer for innhold
- Gi tydelig ledetekst og forventet lengde.
- Bruk `rows` for å gi riktig høyde.

## Props (kort)
- `size`: Størrelse (`sm`, `md`, `lg`).
- `rows`: Antall synlige linjer.
- `placeholder`: Hjelpetekst når feltet er tomt.
- `disabled`: Deaktiverer feltet.
- `aria-invalid`: Marker feiltilstand.

## Eksempler
```tsx
<label htmlFor="message">Melding</label>
<Textarea id="message" rows={4} placeholder="Skriv en kort melding" />
```

## Tilgjengelighet
- Koble `label` og `textarea` med `htmlFor`/`id`.
- Bruk `aria-describedby` for hjelpetekst og feil.
- Bruk `aria-invalid` ved valideringsfeil.

## Vedlikehold/Notater
- Størrelse styres via `size` og CSS-variabler.

## Gjør
- Oppgi forventet lengde eller innholdstype.
- Bruk label og feilmeldinger tett på feltet.

## Unngå
- Ikke bruk til korte felt.
- Ikke skjul feilmeldinger kun med farge.
