import{j as e}from"./jsx-runtime-DDl-KI2x.js";import{I as l}from"./info-9Qx_PVBD.js";import"./iframe-C_JdCeVj.js";import"./preload-helper-PPVm8Dsz.js";import"./createLucideIcon-DMVqFKYz.js";const i="_alertBar_nigl8_1",d="_content_nigl8_21",g="_iconWrapper_nigl8_43",k="_text_nigl8_57",r={alertBar:i,content:d,iconWrapper:g,text:k};function o({alert_enabled:s,alert_text:a}){return!s||!a?null:e.jsx("div",{className:r.alertBar,children:e.jsxs("div",{className:r.content,children:[e.jsx("div",{className:r.iconWrapper,children:e.jsx(l,{size:16})}),e.jsx("span",{className:r.text,children:a})]})})}o.__docgenInfo={description:"",methods:[],displayName:"AlertBarView",props:{alert_enabled:{required:!0,tsType:{name:"boolean"},description:""},alert_text:{required:!1,tsType:{name:"string"},description:""}}};const p=`# AlertBar\r
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
`,x={title:"Komponenter/Layout/AlertBar",component:o,tags:["autodocs"],parameters:{docs:{description:{component:p}}},argTypes:{alert_enabled:{control:"boolean",description:"Viser eller skjuler varselet."},alert_text:{control:"text",description:"Tekstinnholdet i varselet."}}},n={args:{alert_enabled:!0,alert_text:"Vi holder stengt for vedlikehold på mandag."}},t={args:{alert_enabled:!0,alert_text:"Viktig melding: Vi har nå åpnet for booking av sesongkort for 2026! Sikre deg din plass i dag for å nyte badstukulturen hele året."}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    alert_enabled: true,
    alert_text: 'Vi holder stengt for vedlikehold på mandag.'
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    alert_enabled: true,
    alert_text: 'Viktig melding: Vi har nå åpnet for booking av sesongkort for 2026! Sikre deg din plass i dag for å nyte badstukulturen hele året.'
  }
}`,...t.parameters?.docs?.source}}};const b=["Standard","LongText"];export{t as LongText,n as Standard,b as __namedExportsOrder,x as default};
