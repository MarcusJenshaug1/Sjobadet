# Input

Kort beskrivelse: Enkeltlinjet tekstfelt for fritekst.

## Bruk
- Bruk for korte tekstinnslag som navn, e-post eller søk.
- Bruk `type` for e-post, tall og passord der det passer.

## Ikke bruk
- Ikke bruk for lengre tekster (bruk `Textarea`).
- Ikke bruk uten tilknyttet etikett (label).

## Retningslinjer for innhold
- Bruk presise plassholdertekster som beskriver forventet format.
- Vis feilmeldinger i nærheten av feltet.

## Props (kort)
- `size`: Størrelse (`sm`, `md`, `lg`).
- `type`: HTML-inputtype (`text`, `email`, `number`, osv.).
- `placeholder`: Hjelpetekst når feltet er tomt.
- `disabled`: Deaktiverer feltet.
- `aria-invalid`: Marker feiltilstand.

## Eksempler
```tsx
<label htmlFor="email">E-post</label>
<Input id="email" type="email" placeholder="navn@domene.no" />
```

## Tilgjengelighet
- Koble `label` og `input` med `htmlFor`/`id`.
- Bruk `aria-describedby` for hjelpetekst og feil.
- Bruk `aria-invalid` ved valideringsfeil.

## Vedlikehold/Notater
- Feltet er visuell komponent; validering håndteres utenfor.

## Gjør
- Gi alltid en synlig label.
- Bruk `aria-describedby` for hjelpetekst og feil.

## Unngå
- Ikke bruk for lange tekster.
- Ikke bruk uten type/format der det er relevant.
