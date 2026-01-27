# MediaItem

Kort beskrivelse: Enkeltkort for bildeopplasting i admin.

## Bruk
- Bruk i admin for å vise bilde, status og slett/omlast.

## Ikke bruk
- Ikke bruk i offentlig UI.

## Retningslinjer for innhold
- Vis tydelige status-tekster og progress.

## Props (kort)
- `asset`: Bildeobjekt med status og URL.
- `onDelete`: Kalles ved sletting.
- `onRetry`: Kalles ved feil for å prøve igjen.
- `isPrimary`: Marker som hovedbilde.
- `dragHandleProps`: Brukes for sortering.

## Eksempler
```tsx
<MediaItem asset={asset} onDelete={handleDelete} />
```

## Tilgjengelighet
- Sletteknapp har `aria-label`.

## Vedlikehold/Notater
- Støtter `blob:` URL-er for lokale previews.

## Gjør
- Vis tydelig status (opplasting, feil, bekreftet).
- Bruk `isPrimary` for hovedbilde.

## Unngå
- Ikke bruk i offentlig UI.
- Ikke skjul feil uten tekst.
