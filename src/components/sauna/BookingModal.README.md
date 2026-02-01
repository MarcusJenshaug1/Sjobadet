# BookingModal

Kort beskrivelse: Fullskjerms modal som åpner booking i ny fane.

## Bruk
- Bruk når booking foregår på ekstern side og må åpnes i ny fane.

## Ikke bruk
- Ikke bruk for enkle bekreftelser (bruk dialog/alert).

## Retningslinjer for innhold
- Tittel bør være kort og beskrive hva som skjer.

## Props (kort)
- `url`: URL som åpnes i ny fane.
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
- Bruk en trygg `url` som kan åpnes i ny fane.
- Gi en tydelig tittel.

## Unngå
- Ikke åpne modalen uten `onClose`.
- Ikke bruk URL-er som ikke kan åpnes i ny fane.
