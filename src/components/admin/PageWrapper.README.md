# PageWrapper

Kort beskrivelse: Admin-layout som gir tittel, actions og innholdsramme.

## Bruk
- Bruk som ramme for admin-sider.

## Ikke bruk
- Ikke bruk på offentlige sider.

## Retningslinjer for innhold
- Bruk korte og beskrivende sidetitler.

## Props (kort)
- `children`: Innhold.
- `layout`: `narrow`, `wide` eller `fluid`.
- `title`: Sidetittel.
- `actions`: Handlinger (knapper/lenker).

## Eksempler
```tsx
<PageWrapper title="Badstuer" actions={<Button>Ny</Button>}>
  ...
</PageWrapper>
```

## Tilgjengelighet
- Bruk semantiske overskrifter for tittelen.

## Vedlikehold/Notater
- Layout-klassene er definert i CSS-modulen.

## Gjør
- Gi hver side en tydelig tittel.
- Hold actions samlet og konsistent.

## Unngå
- Ikke legg inn svært lange titler.
- Ikke bland layout-typer uten behov.
