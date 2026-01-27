# Select

Kort beskrivelse: Nedtrekksliste for valg blant faste alternativer.

## Bruk
- Bruk når brukeren skal velge ett alternativ.
- Bruk korte og tydelige alternativtekster.

## Ikke bruk
- Ikke bruk når det er færre enn 3 valg (vurder radio-knapper).
- Ikke bruk for søkbare lister (bruk egen søkekomponent).

## Retningslinjer for innhold
- Første alternativ bør være en nøytral «Velg…»-tekst.
- Tekster skal være korte og entydige.

## Props (kort)
- `size`: Størrelse (`sm`, `md`, `lg`).
- `disabled`: Deaktiverer listen.
- `children`: `option`-elementer.

## Eksempler
```tsx
<label htmlFor="sauna">Velg badstue</label>
<Select id="sauna">
  <option value="">Velg…</option>
  <option value="oslo">Oslo</option>
  <option value="bergen">Bergen</option>
</Select>
```

## Tilgjengelighet
- Koble `label` og `select` med `htmlFor`/`id`.
- Bruk `aria-describedby` for hjelpetekst.

## Vedlikehold/Notater
- Unngå store datamengder uten søk/filtrering.

## Gjør
- Start med et nøytralt «Velg…»-alternativ.
- Hold alternativtekster korte og tydelige.

## Unngå
- Ikke bruk for to eller færre alternativer.
- Ikke bruk for svært store lister uten søk.
