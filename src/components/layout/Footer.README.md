# FooterView

Kort beskrivelse: Bunnseksjon med kontaktinfo og lenker.

## Bruk
- Bruk som global footer på alle sider.
- Viser kontaktinformasjon og lenker til badstuer.

## Ikke bruk
- Ikke bruk for lange tekster eller markedsføringsinnhold.

## Retningslinjer for innhold
- Hold kontaktinfo oppdatert.
- Begrens antall lenker for oversiktlighet.

## Props (kort)
- `address`: Adresse.
- `email`: Kontakt e-post.
- `phone`: Telefonnummer.
- `instagram`: URL til Instagram.
- `facebook`: URL til Facebook.
- `saunas`: Liste over aktive badstuer.

## Eksempler
```tsx
<FooterView address="Nedre Langgate 44" email="booking@sjobadet.com" phone="+47 401 55 365" saunas={[]} />
```

## Tilgjengelighet
- Bruk tydelige lenketekster.

## Vedlikehold/Notater
- Server-komponenten `Footer` henter data og sender til `FooterView`.

## Gjør
- Hold kontaktinfo oppdatert.
- Bruk tydelige lenketekster.

## Unngå
- Ikke legg inn lange tekster.
- Ikke skjul viktig kontaktinfo.
