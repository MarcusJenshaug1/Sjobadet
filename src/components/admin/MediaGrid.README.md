# MediaGrid

Kort beskrivelse: Grid med sortering av medier via drag-and-drop.

## Bruk
- Bruk for å sortere galleri-bilder.

## Ikke bruk
- Ikke bruk for store lister uten virtualisering.

## Retningslinjer for innhold
- Vis tydelig slett-ikon og drag-håndtak.

## Props (kort)
- `assets`: Liste over mediaobjekter.
- `onReorder`: Kalles med ny rekkefølge.
- `onDelete`: Kalles ved sletting.

## Eksempler
```tsx
<MediaGrid assets={assets} onReorder={setAssets} onDelete={handleDelete} />
```

## Tilgjengelighet
- Drag-håndtak bør være tastaturnavigerbart der mulig.

## Vedlikehold/Notater
- Bruker dnd-kit for sortering.

## Gjør
- Vis tydelig drag-håndtak.
- Gi rask respons ved sortering.

## Unngå
- Ikke bruk for store gallerier uten paginering.
- Ikke skjul slettehandlinger.
