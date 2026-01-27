# SaunaGallery

Kort beskrivelse: Bildegalleri med slideshow og fullskjermsvisning.

## Bruk
- Bruk på badstuesider med flere bilder.
- Bruk minst 2 bilder for best opplevelse.

## Ikke bruk
- Ikke bruk hvis det ikke finnes bilder.

## Retningslinjer for innhold
- Bruk bilder med lik stil og fargetone.
- Begrens til 6–10 bilder.

## Props (kort)
- `images`: Liste over bilde-URL-er.
- `saunaName`: Brukes i `alt`-tekster.

## Eksempler
```tsx
<SaunaGallery saunaName="Tønsberg" images={["/1.jpg", "/2.jpg"]} />
```

## Tilgjengelighet
- Navigasjon har `aria-label`.
- Tastaturnavigasjon støttes (piltaster og Escape).

## Vedlikehold/Notater
- Returnerer `null` dersom `images` er tom.

## Gjør
- Bruk bilder med konsistent format.
- Begrens antall bilder.

## Unngå
- Ikke bruk tomme lister.
- Ikke bruk veldig tunge bilder uten komprimering.
