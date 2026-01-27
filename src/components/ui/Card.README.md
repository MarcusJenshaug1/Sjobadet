# Card

Kort beskrivelse: Visuell container for å gruppere innhold.

## Bruk
- Bruk for seksjoner med relatert innhold (kort, paneler, oppsummeringer).
- Bruk `variant` for å skille primær og sekundær informasjon.

## Ikke bruk
- Ikke bruk for alt innhold; unngå visuell «kortstøy».

## Retningslinjer for innhold
- Hold innholdet ryddig og kort.
- Bruk konsekvent padding og overskriftsnivå.

## Props (kort)
- `as`: Render som annet element (`section`, `article`, osv.).
- `variant`: Stil (`default`, `muted`, `outline`).
- `padding`: Innvendig avstand (`none`, `sm`, `md`, `lg`).

## Eksempler
```tsx
<Card>
  <h3>Åpningstider</h3>
  <p>Mandag–fredag 07–22</p>
</Card>
```

## Tilgjengelighet
- Bruk semantisk `as` når kortet representerer en egen seksjon.

## Vedlikehold/Notater
- Bruk `outline` for kort med egen bakgrunn.

## Gjør
- Gruppér relaterte elementer i én card.
- Bruk `variant` for å skille hierarki.

## Unngå
- Ikke nest for mange kort i hverandre.
- Ikke bruk kort uten reelt innhold.
