import{H as r}from"./iframe-BeGkvnHr.js";import"./preload-helper-D1UD9lgW.js";const o=`# HeaderView\r
\r
Kort beskrivelse: Toppnavigasjon med hovedmeny og mobilmeny.\r
\r
## Bruk\r
- Bruk som global header på alle offentlige sider.\r
- Bruk \`saunaLinks\` og \`infoLinks\` for dynamiske menyer.\r
\r
## Ikke bruk\r
- Ikke bruk i admin-områder uten tilpasning.\r
\r
## Retningslinjer for innhold\r
- Menypunkter skal være korte og entydige.\r
- Dropdowns bør begrenses til 6–10 punkter.\r
\r
## Props (kort)\r
- \`isAdmin\`: Viser adminlenke når brukeren er admin.\r
- \`isMaintenanceMode\`: Deaktiverer lenker ved vedlikehold.\r
- \`saunaLinks\`: Liste over badstuer i menyen.\r
- \`infoLinks\`: Liste over infosider i menyen.\r
\r
## Eksempler\r
\`\`\`tsx\r
<HeaderView\r
  isAdmin={false}\r
  saunaLinks={[{ label: 'Tønsberg', href: '/home/tonsberg' }]}\r
  infoLinks={[{ label: 'FAQ', href: '/info/faq' }]}\r
/>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Mobilmenyen har tydelig \`aria-label\` på åpne/lukk.\r
- Dropdowns bør kunne nås via tastatur (sjekk i praksis).\r
\r
## Vedlikehold/Notater\r
- Server-komponenten \`Header\` henter data og sender til \`HeaderView\`.\r
\r
## Gjør\r
- Hold menypunkter korte og tydelige.\r
- Begrens antall dropdown-elementer.\r
\r
## Unngå\r
- Ikke overfyll menyen.\r
- Ikke bruk utydelige label-tekster.\r
`,s={title:"Komponenter/Layout/Header",component:r,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:o}}},argTypes:{isAdmin:{control:"boolean",description:"Viser adminlenke når brukeren er admin."},isMaintenanceMode:{control:"boolean",description:"Deaktiverer lenker når vedlikehold er aktivt."},saunaLinks:{control:"object",description:"Menylenker til badstuer."},infoLinks:{control:"object",description:"Menylenker til infosider."}},args:{isAdmin:!1,isMaintenanceMode:!1,saunaLinks:[{label:"Tønsberg Brygge",href:"/home/tonsberg"},{label:"Hjemseng Brygge",href:"/home/hjemseng"}],infoLinks:[{label:"Ofte stilte spørsmål",href:"/info/faq"},{label:"Åpningstider",href:"/info/apningstider"}]}},e={},n={args:{isMaintenanceMode:!0}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    isMaintenanceMode: true
  }
}`,...n.parameters?.docs?.source}}};const t=["Standard","Vedlikehold"];export{e as Standard,n as Vedlikehold,t as __namedExportsOrder,s as default};
