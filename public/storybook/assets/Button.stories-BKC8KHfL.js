import{B as r,j as e}from"./iframe-BeGkvnHr.js";import"./preload-helper-D1UD9lgW.js";const u=`# Button\r
\r
Kort beskrivelse: Primær handling for brukerhandlinger og navigasjon.\r
\r
## Bruk\r
- Bruk for å starte handlinger som «Bestill», «Lagre» eller «Send».\r
- Bruk \`href\` når knappen skal fungere som lenke.\r
\r
## Ikke bruk\r
- Ikke bruk som dekorativt element uten handling.\r
- Ikke bruk flere «primary» i samme visning uten tydelig prioritet.\r
\r
## Retningslinjer for innhold\r
- Bruk aktive verb og korte tekster (1–3 ord).\r
- Unngå lange setninger og markedsføringsspråk.\r
- Bruk konsistent kapitalisering (setningsform).\r
\r
## Props (kort)\r
- \`variant\`: Visuell stil (\`primary\`, \`secondary\`, \`outline\`, \`ghost\`, \`danger\`).\r
- \`size\`: Størrelse (\`sm\`, \`md\`, \`lg\`).\r
- \`fullWidth\`: Strekker knappen til full bredde.\r
- \`href\`: Gjør knappen til lenke.\r
- \`external\`: Åpner lenker i ny fane.\r
- \`disabled\`: Deaktiverer handling.\r
- \`onClick\`: Klikkhandler.\r
\r
## Eksempler\r
\`\`\`tsx\r
<Button variant="primary">Bestill nå</Button>\r
<Button variant="outline" size="sm">Les mer</Button>\r
<Button href="/medlemskap">Medlemskap</Button>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Bruk alltid tydelig tekst.\r
- Ikonknapper må ha \`aria-label\`.\r
- Unngå å skjule handlinger kun med farge.\r
\r
## Vedlikehold/Notater\r
- Unngå inline-stiler i appkode; bruk varianter og size.\r
\r
## Gjør\r
- Bruk korte handlingsverb (f.eks. «Lagre», «Bestill»).\r
- Bruk \`danger\` for destruktive handlinger.\r
\r
## Unngå\r
- Ikke bruk flere primærknapper i samme visning.\r
- Ikke bruk ikonknapper uten \`aria-label\`.\r
`,{expect:d,userEvent:m,within:p}=__STORYBOOK_MODULE_TEST__,B={title:"Komponenter/Knapper/Button",component:r,tags:["autodocs"],parameters:{docs:{description:{component:u}}},argTypes:{variant:{control:"select",options:["primary","secondary","outline","ghost","danger"],description:"Visuell variant som kommuniserer prioritet og risiko."},size:{control:"select",options:["sm","md","lg"],description:"Størrelse på knappens padding og tekst."},fullWidth:{control:"boolean",description:"Strekker knappen til full bredde i containeren."},href:{control:"text",description:"Gjør knappen til lenke når den er satt."},external:{control:"boolean",description:"Åpner lenker i ny fane når `href` er satt."},onClick:{action:"clicked",description:"Klikkhandler for knappen."}},args:{children:"Bestill nå",variant:"primary",size:"md",fullWidth:!1}},t={play:async({canvasElement:l})=>{const n=p(l).getByRole("button",{name:"Bestill nå"});await m.click(n),await d(n).toBeEnabled()}},a={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap"},children:[e.jsx(r,{variant:"primary",children:"Bestill"}),e.jsx(r,{variant:"secondary",children:"Les mer"}),e.jsx(r,{variant:"outline",children:"Min side"}),e.jsx(r,{variant:"ghost",children:"Utforsk"}),e.jsx(r,{variant:"danger",children:"Slett"})]})},s={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap",alignItems:"center"},children:[e.jsx(r,{size:"sm",children:"Liten"}),e.jsx(r,{size:"md",children:"Standard"}),e.jsx(r,{size:"lg",children:"Stor"})]})},i={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap",alignItems:"center"},children:[e.jsx(r,{children:"Normal"}),e.jsx(r,{disabled:!0,children:"Deaktivert"}),e.jsx(r,{variant:"outline",id:"fokus-knapp",children:"Fokus"})]}),play:async({canvasElement:l})=>{const n=p(l).getByRole("button",{name:"Fokus"});n.focus(),await d(n).toHaveFocus()}},o={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",flexWrap:"wrap"},children:[e.jsx(r,{href:"/medlemskap",children:"Medlemskap"}),e.jsx(r,{href:"https://sjobadet.net",external:!0,variant:"outline",children:"Gå til sjobadet.net"})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: 'Bestill nå'
    });
    await userEvent.click(button);
    await expect(button).toBeEnabled();
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  }}>\r
            <Button variant="primary">Bestill</Button>\r
            <Button variant="secondary">Les mer</Button>\r
            <Button variant="outline">Min side</Button>\r
            <Button variant="ghost">Utforsk</Button>\r
            <Button variant="danger">Slett</Button>\r
        </div>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  }}>\r
            <Button size="sm">Liten</Button>\r
            <Button size="md">Standard</Button>\r
            <Button size="lg">Stor</Button>\r
        </div>
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  }}>\r
            <Button>Normal</Button>\r
            <Button disabled>Deaktivert</Button>\r
            <Button variant="outline" id="fokus-knapp">Fokus</Button>\r
        </div>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const focusButton = canvas.getByRole('button', {
      name: 'Fokus'
    });
    focusButton.focus();
    await expect(focusButton).toHaveFocus();
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  }}>\r
            <Button href="/medlemskap">Medlemskap</Button>\r
            <Button href="https://sjobadet.net" external variant="outline">\r
                Gå til sjobadet.net\r
            </Button>\r
        </div>
}`,...o.parameters?.docs?.source}}};const v=["Standard","Varianter","Størrelser","Tilstander","Lenke"];export{o as Lenke,t as Standard,s as Størrelser,i as Tilstander,a as Varianter,v as __namedExportsOrder,B as default};
