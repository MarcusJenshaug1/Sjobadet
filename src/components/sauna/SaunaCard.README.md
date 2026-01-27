# SaunaCard

Kort beskrivelse: Kortvisning av en badstue med status, kapasitet og handlinger.

## Bruk
- Bruk i lister og oversikter over badstuer.
- Vis alltid navn, lokasjon og kort beskrivelse.

## Ikke bruk
- Ikke bruk når detaljerte timeplaner skal vises (bruk egen side).

## Retningslinjer for innhold
- Beskrivelsen bør være én kort setning.
- Bruk tydelig status (åpen/stengt/få plasser).

## Props (kort)
- `sauna`: Objekt med navn, lokasjon, status og booking-lenker.
- `isMaintenanceMode`: Skjuler booking-status og handlinger ved vedlikehold.

## Eksempler
```tsx
<SaunaCard sauna={{ id: '1', name: 'Tønsberg', location: 'Tønsberg', slug: 'tonsberg', shortDescription: 'Badstue ved brygga' }} />
```

## Tilgjengelighet
- Kortet er tastaturnavigerbart (`role="link"`).
- Viktig informasjon vises både med tekst og ikon.

## Vedlikehold/Notater
- Booking-knapper åpner modal når URL er tilgjengelig.

## Gjør
- Bruk korte beskrivelser.
- Vis tydelig status for tilgjengelighet.

## Unngå
- Ikke bruk lange avsnitt i kortet.
- Ikke skjul viktig statusinformasjon.
