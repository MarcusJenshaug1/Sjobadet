# MediaDropzone

Kort beskrivelse: Dra-og-slipp felt for bildeopplasting i admin.

## Bruk
- Bruk når admin skal laste opp bilder.

## Ikke bruk
- Ikke bruk i offentlig UI.

## Retningslinjer for innhold
- Vis klare filkrav (format og maks størrelse).

## Props (kort)
- `onFilesSelected`: Kalles med gyldige filer.
- `multiple`: Tillater flere filer.
- `accept`: Tillatte MIME-typer.
- `maxSize`: Maks størrelse i MB.

## Eksempler
```tsx
<MediaDropzone onFilesSelected={handleFiles} multiple />
```

## Tilgjengelighet
- Sørg for klikkbar flate og tydelig tekst.

## Vedlikehold/Notater
- Validering skjer i komponenten.

## Gjør
- Oppgi tydelige filkrav.
- Begrens filstørrelse.

## Unngå
- Ikke bruk uten `onFilesSelected`.
- Ikke tillat ubegrenset opplasting.
