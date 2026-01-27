# ConsentBanner

Kort beskrivelse: Banner og dialog for samtykke til infokapsler.

## Bruk
- Bruk for å innhente samtykke til analyse/markedsføring.
- Viser banner til samtykke er valgt.

## Ikke bruk
- Ikke bruk i admin-områder.

## Retningslinjer for innhold
- Forklar kort hvorfor samtykke trengs.
- Bruk klar og enkel terminologi.

## Props (kort)
- Ingen props. Tilstand håndteres internt.

## Eksempler
```tsx
<ConsentBanner />
```

## Tilgjengelighet
- Knapper har tydelig tekst.
- Dialog kan lukkes ved klikk utenfor.

## Vedlikehold/Notater
- Bruker `getConsent` og `setConsent` fra tracking-modulen.

## Gjør
- Forklar tydelig hvorfor samtykke trengs.
- Gi enkle valg med lik prioritet.

## Unngå
- Ikke skjul avslag bak flere klikk.
- Ikke bruk uklare begreper.
