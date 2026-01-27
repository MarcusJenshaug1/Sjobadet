# Button

Kort beskrivelse: Primær handling for brukerhandlinger og navigasjon.

## Bruk
- Bruk for å starte handlinger som «Bestill», «Lagre» eller «Send».
- Bruk `href` når knappen skal fungere som lenke.

## Ikke bruk
- Ikke bruk som dekorativt element uten handling.
- Ikke bruk flere «primary» i samme visning uten tydelig prioritet.

## Retningslinjer for innhold
- Bruk aktive verb og korte tekster (1–3 ord).
- Unngå lange setninger og markedsføringsspråk.
- Bruk konsistent kapitalisering (setningsform).

## Props (kort)
- `variant`: Visuell stil (`primary`, `secondary`, `outline`, `ghost`, `danger`).
- `size`: Størrelse (`sm`, `md`, `lg`).
- `fullWidth`: Strekker knappen til full bredde.
- `href`: Gjør knappen til lenke.
- `external`: Åpner lenker i ny fane.
- `disabled`: Deaktiverer handling.
- `onClick`: Klikkhandler.

## Eksempler
```tsx
<Button variant="primary">Bestill nå</Button>
<Button variant="outline" size="sm">Les mer</Button>
<Button href="/medlemskap">Medlemskap</Button>
```

## Tilgjengelighet
- Bruk alltid tydelig tekst.
- Ikonknapper må ha `aria-label`.
- Unngå å skjule handlinger kun med farge.

## Vedlikehold/Notater
- Unngå inline-stiler i appkode; bruk varianter og size.

## Gjør
- Bruk korte handlingsverb (f.eks. «Lagre», «Bestill»).
- Bruk `danger` for destruktive handlinger.

## Unngå
- Ikke bruk flere primærknapper i samme visning.
- Ikke bruk ikonknapper uten `aria-label`.
