import{T as n,j as s}from"./iframe-ChuUt2dm.js";import"./preload-helper-D1UD9lgW.js";const o=`# TrackingProvider\r
\r
Kort beskrivelse: Wrapper som håndterer samtykke og sporing av sidevisninger.\r
\r
## Bruk\r
- Bruk på toppnivå rundt hele appen.\r
\r
## Ikke bruk\r
- Ikke bruk i isolerte komponenter.\r
\r
## Retningslinjer for innhold\r
- Barn bør være full app eller sideinnhold.\r
\r
## Props (kort)\r
- \`children\`: Innholdet som skal spores.\r
- \`isAdmin\`: Deaktiverer sporing og banner for admin.\r
\r
## Eksempler\r
\`\`\`tsx\r
<TrackingProvider isAdmin={false}>\r
  <App />\r
</TrackingProvider>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Samtykkebanneret vises kun når det er relevant.\r
\r
## Vedlikehold/Notater\r
- Lytter på \`consentChange\` og sporer sidevisninger via \`trackPageview\`.\r
\r
## Gjør\r
- Plasser høyt i treet (rundt hele appen).\r
- Skru av sporing for admin-brukere.\r
\r
## Unngå\r
- Ikke bruk flere nested providers.\r
- Ikke spor uten samtykke.\r
`,t={title:"Komponenter/Analyse/TrackingProvider",component:n,tags:["autodocs"],parameters:{layout:"padded",docs:{description:{component:o}},controls:{exclude:["children"]}},argTypes:{isAdmin:{control:"boolean",description:"Deaktiverer sporing og banner når true."}},args:{isAdmin:!1,children:s.jsx("div",{style:{background:"#f8fafc",padding:"1rem",borderRadius:"0.5rem"},children:"Eksempelinnhold som ligger inne i TrackingProvider."})}},r={},e={args:{isAdmin:!0}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    isAdmin: true
  }
}`,...e.parameters?.docs?.source}}};const d=["Standard","Admin"];export{e as Admin,r as Standard,d as __namedExportsOrder,t as default};
