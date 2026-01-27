# Container

Kort beskrivelse: Innholdsramme som begrenser bredde og gir konsistent margin.

## Bruk
- Bruk som toppnivå for sider og seksjoner.
- Kombiner med `Section` for vertikal rytme.

## Ikke bruk
- Ikke legg container i container unødvendig; det gir smal layout.

## Retningslinjer for innhold
- Bruk for layout, ikke for visuell styling.

## Props (kort)
- `as`: Render som annet element (`section`, `main`, osv.).

## Eksempler
```tsx
<Container>
  <h1>Velkommen</h1>
</Container>
```

## Tilgjengelighet
- Bruk riktig semantisk element for innhold (f.eks. `main`).

## Vedlikehold/Notater
- Container baserer seg på global `.container`-klasse.

## Gjør
- Bruk container på toppnivå for sider.
- Bruk `as` for riktig semantikk.

## Unngå
- Ikke legg container i container unødvendig.
- Ikke bruk for små elementgrupper.
