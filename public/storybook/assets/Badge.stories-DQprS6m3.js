import{j as e}from"./jsx-runtime-DDl-KI2x.js";import{B as r}from"./Badge-s7y48ZH4.js";import"./iframe-C_JdCeVj.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";const s=`# Badge\r
\r
Kort beskrivelse: Liten status- eller kategori-etikett.\r
\r
## Bruk\r
- Bruk for korte statuser som «Åpen», «Stengt» og «Nyhet».\r
- Bruk konsekvente farger for samme type status.\r
\r
## Ikke bruk\r
- Ikke bruk som knapp eller interaktivt element.\r
- Ikke bruk lange tekster.\r
\r
## Retningslinjer for innhold\r
- Hold teksten kort (1–2 ord).\r
- Bruk store/små bokstaver konsekvent.\r
\r
## Props (kort)\r
- \`variant\`: Fargevariant (\`default\`, \`success\`, \`warning\`, \`danger\`, \`info\`, \`neutral\`).\r
- \`size\`: Størrelse (\`sm\`, \`md\`, \`lg\`).\r
\r
## Eksempler\r
\`\`\`tsx\r
<Badge variant="success">Åpen</Badge>\r
<Badge variant="warning">Begrenset</Badge>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Ikke bruk kun farge for å formidle status; inkluder tekst.\r
\r
## Vedlikehold/Notater\r
- Bruk samme variant for samme status gjennom hele appen.\r
\r
## Gjør\r
- Hold teksten kort og konsistent.\r
- Bruk samme farge for samme betydning.\r
\r
## Unngå\r
- Ikke bruk som knapp.\r
- Ikke bruk lange setninger.\r
`,m={title:"Komponenter/Status/Badge",component:r,tags:["autodocs"],parameters:{docs:{description:{component:s}}},argTypes:{variant:{control:"select",options:["default","success","warning","danger","info","neutral"],description:"Fargevariant for status eller kategori."},size:{control:"select",options:["sm","md","lg"],description:"Størrelse på etiketten."}},args:{variant:"default",size:"md",children:"Standard"}},n={},a={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center",flexWrap:"wrap"},children:[e.jsx(r,{variant:"default",children:"Standard"}),e.jsx(r,{variant:"success",children:"Åpen"}),e.jsx(r,{variant:"warning",children:"Begrenset"}),e.jsx(r,{variant:"danger",children:"Stengt"}),e.jsx(r,{variant:"info",children:"Nyhet"}),e.jsx(r,{variant:"neutral",children:"Info"})]})},t={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.5rem",alignItems:"center"},children:[e.jsx(r,{size:"sm",children:"Sm"}),e.jsx(r,{size:"md",children:"Md"}),e.jsx(r,{size:"lg",children:"Lg"})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"{}",...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>\r
            <Badge variant="default">Standard</Badge>\r
            <Badge variant="success">Åpen</Badge>\r
            <Badge variant="warning">Begrenset</Badge>\r
            <Badge variant="danger">Stengt</Badge>\r
            <Badge variant="info">Nyhet</Badge>\r
            <Badge variant="neutral">Info</Badge>\r
        </div>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  }}>\r
            <Badge size="sm">Sm</Badge>\r
            <Badge size="md">Md</Badge>\r
            <Badge size="lg">Lg</Badge>\r
        </div>
}`,...t.parameters?.docs?.source}}};const c=["Standard","Varianter","Størrelser"];export{n as Standard,t as Størrelser,a as Varianter,c as __namedExportsOrder,m as default};
