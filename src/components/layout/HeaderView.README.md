# HeaderView

Kort beskrivelse: Toppnavigasjon med hovedmeny og mobilmeny.

## Bruk
- Bruk som global header på alle offentlige sider.
- Bruk `saunaLinks` og `infoLinks` for dynamiske menyer.

## Ikke bruk
- Ikke bruk i admin-områder uten tilpasning.

## Retningslinjer for innhold
- Menypunkter skal være korte og entydige.
- Dropdowns bør begrenses til 6–10 punkter.

## Props (kort)
- `isAdmin`: Viser adminlenke når brukeren er admin.
- `isMaintenanceMode`: Deaktiverer lenker ved vedlikehold.
- `saunaLinks`: Liste over badstuer i menyen.
- `infoLinks`: Liste over infosider i menyen.

## Eksempler
```tsx
<HeaderView
  isAdmin={false}
  saunaLinks={[{ label: 'Tønsberg', href: '/home/tonsberg' }]}
  infoLinks={[{ label: 'FAQ', href: '/info/faq' }]}
/>
```

## Tilgjengelighet
- Mobilmenyen har tydelig `aria-label` på åpne/lukk.
- Dropdowns bør kunne nås via tastatur (sjekk i praksis).

## Vedlikehold/Notater
- Server-komponenten `Header` henter data og sender til `HeaderView`.

## Gjør
- Hold menypunkter korte og tydelige.
- Begrens antall dropdown-elementer.

## Unngå
- Ikke overfyll menyen.
- Ikke bruk utydelige label-tekster.
