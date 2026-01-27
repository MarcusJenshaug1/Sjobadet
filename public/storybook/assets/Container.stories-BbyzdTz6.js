import{j as r}from"./jsx-runtime-DDl-KI2x.js";import{c as s}from"./clsx-B-dksMZM.js";import"./iframe-C_JdCeVj.js";import"./preload-helper-PPVm8Dsz.js";function e({as:o="div",className:t,children:a,...i}){return r.jsx(o,{className:s("container",t),...i,children:a})}e.__docgenInfo={description:"",methods:[],displayName:"Container",props:{as:{required:!1,tsType:{name:"ReactElementType",raw:"React.ElementType"},description:"",defaultValue:{value:"'div'",computed:!1}}}};const d=`# Container\r
\r
Kort beskrivelse: Innholdsramme som begrenser bredde og gir konsistent margin.\r
\r
## Bruk\r
- Bruk som toppnivå for sider og seksjoner.\r
- Kombiner med \`Section\` for vertikal rytme.\r
\r
## Ikke bruk\r
- Ikke legg container i container unødvendig; det gir smal layout.\r
\r
## Retningslinjer for innhold\r
- Bruk for layout, ikke for visuell styling.\r
\r
## Props (kort)\r
- \`as\`: Render som annet element (\`section\`, \`main\`, osv.).\r
\r
## Eksempler\r
\`\`\`tsx\r
<Container>\r
  <h1>Velkommen</h1>\r
</Container>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Bruk riktig semantisk element for innhold (f.eks. \`main\`).\r
\r
## Vedlikehold/Notater\r
- Container baserer seg på global \`.container\`-klasse.\r
\r
## Gjør\r
- Bruk container på toppnivå for sider.\r
- Bruk \`as\` for riktig semantikk.\r
\r
## Unngå\r
- Ikke legg container i container unødvendig.\r
- Ikke bruk for små elementgrupper.\r
`,k={title:"Komponenter/Layout/Container",component:e,tags:["autodocs"],parameters:{docs:{description:{component:d}}},argTypes:{as:{control:"text",description:"Semantisk element (f.eks. `main`)."}}},n={render:()=>r.jsx(e,{children:r.jsx("div",{style:{background:"#f8fafc",padding:"1rem",borderRadius:"0.5rem"},children:"Innhold i container"})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Container>\r
            <div style={{
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '0.5rem'
    }}>\r
                Innhold i container\r
            </div>\r
        </Container>
}`,...n.parameters?.docs?.source}}};const u=["Standard"];export{n as Standard,u as __namedExportsOrder,k as default};
