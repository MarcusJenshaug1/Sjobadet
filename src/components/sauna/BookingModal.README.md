# BookingModal

Kort beskrivelse: Fullskjerms modal med innebygd booking i iframe.

## Bruk
- Bruk når booking foregår på ekstern side.

## Ikke bruk
- Ikke bruk for enkle bekreftelser (bruk dialog/alert).

## Retningslinjer for innhold
- Tittel bør være kort og beskrive hva som skjer.

## Props (kort)
- `url`: URL til booking.
- `open`: Åpner/lukker modalen.
- `onClose`: Kalles ved lukking.
- `title`: Valgfri tittel.

## Eksempler
```tsx
<BookingModal open url="https://..." onClose={handleClose} />
```

## Tilgjengelighet
- Modalen har `role="dialog"` og lukking med Escape.

## Vedlikehold/Notater
- Setter `document.body.style.overflow` når åpen.

## Gjør
- Bruk en trygg `url` som kan embeddes.
- Gi en tydelig tittel.

## Unngå
- Ikke åpne modalen uten `onClose`.
- Ikke bruk URL-er som blokkerer iframe.
