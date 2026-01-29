# Admin UI – komplett UI‑prompt

Lag et moderne, profesjonelt adminpanel med fokus på effektivitet, oversikt og trygg betjening. Designet må være responsivt og fungere sømløst på desktop og mobil. Følg punktene under nøye.

## Overordnet stil og identitet
- Nøytral, profesjonell visuell stil med tydelige hierarkier.
- Konsekvent spacing, 8‑punkt grid, runde hjørner (8–12px), subtil skyggebruk.
- Minimum vertikal luft mellom seksjoner, kort og tabeller; unngå “trange” blokker.
- Typografi: Sans‑serif, klar vektforskjell mellom H1/H2/brødtekst.
- Kontrast og tilgjengelighet: minimum WCAG AA.

## Farge og tilstand
- Primær handling: tydelig CTA‑farge.
- Sekundær handling: nøytral tone.
- Suksess/varsel/feil/info: standardiserte farger og ikoner.
- Alle interaktive elementer må ha hover, focus og disabled‑tilstander.

## Desktop (PC)
- Struktur: Venstre sidebar (ikon + tekst), toppbar for globalt søk, bruker‑meny og varsler.
- Sideinnhold: hovedflate med widgets i 2–3 kolonner.
  - Sørg for tydelig vertikal spacing mellom seksjoner, filter‑rader og tabeller.
- Dashbord:
  - KPI‑kort (4–6) øverst med trend, prosent og tidsvalg.
  - Tabellseksjoner med sortering, filtrering, paginering og eksport.
  - Aktivitetspanel/varsler i høyre kolonne.
- Navigasjon:
  - Sidebar med seksjoner: Dashboard, Brukere, Innhold, Rapportering, Innstillinger.
  - Aktiv markering + breadcrumbs i toppbar.
- Skjemaer:
  - Grupperte felter med tydelige etiketter, hjelpetekst og validering inline.
  - Primær CTA nederst til høyre, sekundær CTA til venstre.
- Tabeller:
  - Sticky header, bulk‑select, actions per rad, tom‑tilstand med CTA.
- Modaler og drawers:
  - Modaler for bekreftelser og små redigeringer.
  - Side‑drawer for avanserte redigeringer uten å miste kontekst.

## Mobil
- Struktur: Toppbar med side‑meny (hamburger) og globalt søk.
- Sidebar blir en slide‑in meny.
- Dashbord‑widgets blir en kolonne (kort staplet).
- Bruk ekstra vertikal spacing mellom kort, lister og knapper for lett scannbarhet.
- Tabeller vises som kortliste med viktigste felt, detaljer via “Se mer”.
- Primær CTA alltid synlig nederst (sticky) når relevant.
- Skjemaer: store inputfelt, tydelige feilmeldinger under feltet.

## Komponentbibliotek
- Knappetyper: primary, secondary, ghost, destructive.
- Inputs: tekst, select, multiselect, datepicker, toggle, checkbox, radio.
- Feedback: toast, inline‑alert, empty‑state.
- Loader: skeletons og spinners.
- Badges: status, rolle, nivå.

## UX‑prinsipper
- Prioriter oppgaver: “Siste aktivitet”, “Kritiske varsler”, “Handling krever oppmerksomhet”.
- Bruk tydelige bekreftelser for destruktive handlinger.
- Minimal klikk‑friksjon: søk, filtrering og bulk‑handlinger alltid tilgjengelig.

## Tom‑tilstander og feil
- Tom‑tilstand med ikon, kort forklaring og CTA.
- Feiltilstand med tydelig message og “Prøv igjen”.

## Leveranseformat
- Lever UI‑prompten som ren tekst i én blokk (ingen kode), klar til liming.
