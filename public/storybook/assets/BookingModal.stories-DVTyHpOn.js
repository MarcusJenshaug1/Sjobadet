import{B as e}from"./BookingModal-QTC6XLr0.js";import"./iframe-DpagJM2z.js";import"./preload-helper-D1UD9lgW.js";import"./index-BfpS9d6p.js";const n=`# BookingModal\r
\r
Kort beskrivelse: Fullskjerms modal med innebygd booking i iframe.\r
\r
## Bruk\r
- Bruk når booking foregår på ekstern side.\r
\r
## Ikke bruk\r
- Ikke bruk for enkle bekreftelser (bruk dialog/alert).\r
\r
## Retningslinjer for innhold\r
- Tittel bør være kort og beskrive hva som skjer.\r
\r
## Props (kort)\r
- \`url\`: URL til booking.\r
- \`open\`: Åpner/lukker modalen.\r
- \`onClose\`: Kalles ved lukking.\r
- \`title\`: Valgfri tittel.\r
\r
## Eksempler\r
\`\`\`tsx\r
<BookingModal open url="https://..." onClose={handleClose} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Modalen har \`role="dialog"\` og lukking med Escape.\r
\r
## Vedlikehold/Notater\r
- Setter \`document.body.style.overflow\` når åpen.\r
\r
## Gjør\r
- Bruk en trygg \`url\` som kan embeddes.\r
- Gi en tydelig tittel.\r
\r
## Unngå\r
- Ikke åpne modalen uten \`onClose\`.\r
- Ikke bruk URL-er som blokkerer iframe.\r
`,a={title:"Komponenter/Badstue/BookingModal",component:e,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:n}}},argTypes:{open:{control:"boolean",description:"Åpner eller lukker modalen."},url:{control:"text",description:"URL som vises i iframe."},title:{control:"text",description:"Tittel for modal og iframe."},onClose:{action:"close",description:"Kalles når modalen lukkes."}},args:{open:!0,url:"about:blank",title:"Fullfør booking"}},r={};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};const i=["Standard"];export{r as Standard,i as __namedExportsOrder,a as default};
