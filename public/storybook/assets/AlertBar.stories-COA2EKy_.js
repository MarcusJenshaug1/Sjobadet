import{A as n}from"./iframe-BeGkvnHr.js";import"./preload-helper-D1UD9lgW.js";const t=`# AlertBar\r
\r
Kort beskrivelse: Varsellinje for viktig informasjon øverst på siden.\r
\r
## Bruk\r
- Bruk for driftsmeldinger og midlertidige varsler.\r
- Hold teksten kort og konkret.\r
\r
## Ikke bruk\r
- Ikke bruk for markedsføring eller lang forklaring.\r
- Ikke bruk når beskjeden kan ligge som vanlig innhold.\r
\r
## Retningslinjer for innhold\r
- 1–2 setninger, maks 120 tegn.\r
- Start med det viktigste budskapet.\r
\r
## Props (kort)\r
- \`alert_enabled\`: Slår visning av/på.\r
- \`alert_text\`: Selve meldingen.\r
\r
## Eksempler\r
\`\`\`tsx\r
<AlertBarView alert_enabled alert_text="Vi holder stengt mandag." />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Bruk tydelig tekst og god kontrast.\r
\r
## Vedlikehold/Notater\r
- Server-komponenten \`AlertBar\` henter data fra globale innstillinger.\r
\r
## Gjør\r
- Hold meldingen kort og tydelig.\r
- Bruk den kun for kritiske driftsmeldinger.\r
\r
## Unngå\r
- Ikke bruk for markedsføring.\r
- Ikke bruk lange avsnitt.\r
`,l={title:"Komponenter/Layout/AlertBar",component:n,tags:["autodocs"],parameters:{docs:{description:{component:t}}},argTypes:{alert_enabled:{control:"boolean",description:"Viser eller skjuler varselet."},alert_text:{control:"text",description:"Tekstinnholdet i varselet."}}},e={args:{alert_enabled:!0,alert_text:"Vi holder stengt for vedlikehold på mandag."}},r={args:{alert_enabled:!0,alert_text:"Viktig melding: Vi har nå åpnet for booking av sesongkort for 2026! Sikre deg din plass i dag for å nyte badstukulturen hele året."}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    alert_enabled: true,
    alert_text: 'Vi holder stengt for vedlikehold på mandag.'
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    alert_enabled: true,
    alert_text: 'Viktig melding: Vi har nå åpnet for booking av sesongkort for 2026! Sikre deg din plass i dag for å nyte badstukulturen hele året.'
  }
}`,...r.parameters?.docs?.source}}};const s=["Standard","LongText"];export{r as LongText,e as Standard,s as __namedExportsOrder,l as default};
