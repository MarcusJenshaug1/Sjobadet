import{j as r}from"./iframe-BeGkvnHr.js";import{C as a}from"./Card-hqAF1pWI.js";import"./preload-helper-D1UD9lgW.js";const s=`# Card\r
\r
Kort beskrivelse: Visuell container for å gruppere innhold.\r
\r
## Bruk\r
- Bruk for seksjoner med relatert innhold (kort, paneler, oppsummeringer).\r
- Bruk \`variant\` for å skille primær og sekundær informasjon.\r
\r
## Ikke bruk\r
- Ikke bruk for alt innhold; unngå visuell «kortstøy».\r
\r
## Retningslinjer for innhold\r
- Hold innholdet ryddig og kort.\r
- Bruk konsekvent padding og overskriftsnivå.\r
\r
## Props (kort)\r
- \`as\`: Render som annet element (\`section\`, \`article\`, osv.).\r
- \`variant\`: Stil (\`default\`, \`muted\`, \`outline\`).\r
- \`padding\`: Innvendig avstand (\`none\`, \`sm\`, \`md\`, \`lg\`).\r
\r
## Eksempler\r
\`\`\`tsx\r
<Card>\r
  <h3>Åpningstider</h3>\r
  <p>Mandag–fredag 07–22</p>\r
</Card>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Bruk semantisk \`as\` når kortet representerer en egen seksjon.\r
\r
## Vedlikehold/Notater\r
- Bruk \`outline\` for kort med egen bakgrunn.\r
\r
## Gjør\r
- Gruppér relaterte elementer i én card.\r
- Bruk \`variant\` for å skille hierarki.\r
\r
## Unngå\r
- Ikke nest for mange kort i hverandre.\r
- Ikke bruk kort uten reelt innhold.\r
`,l={title:"Komponenter/Overflate/Card",component:a,tags:["autodocs"],parameters:{docs:{description:{component:s}}},argTypes:{variant:{control:"select",options:["default","muted","outline"],description:"Visuell variant for bakgrunn og kantlinje."},padding:{control:"select",options:["none","sm","md","lg"],description:"Innvendig padding."},as:{control:"text",description:"Semantisk element (f.eks. `section`)."}},args:{variant:"default",padding:"md"}},n={args:{children:r.jsxs("div",{children:[r.jsx("h3",{style:{marginBottom:"0.5rem"},children:"Kort med innhold"}),r.jsx("p",{children:"Brukes for grupperte seksjoner og paneler."})]})}},e={render:()=>r.jsxs("div",{style:{display:"grid",gap:"1rem",maxWidth:420},children:[r.jsxs(a,{children:[r.jsx("strong",{children:"Standard"}),r.jsx("p",{children:"Standard bakgrunn for primært innhold."})]}),r.jsxs(a,{variant:"muted",children:[r.jsx("strong",{children:"Dempet"}),r.jsx("p",{children:"Brukes for sekundært innhold."})]}),r.jsxs(a,{variant:"outline",children:[r.jsx("strong",{children:"Outline"}),r.jsx("p",{children:"Transparent med kantlinje."})]})]})},t={args:{padding:"lg",children:"Ekstra romslig padding for innhold som skal puste."}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div>\r
                <h3 style={{
        marginBottom: '0.5rem'
      }}>Kort med innhold</h3>\r
                <p>Brukes for grupperte seksjoner og paneler.</p>\r
            </div>
  }
}`,...n.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '1rem',
    maxWidth: 420
  }}>\r
            <Card>\r
                <strong>Standard</strong>\r
                <p>Standard bakgrunn for primært innhold.</p>\r
            </Card>\r
            <Card variant="muted">\r
                <strong>Dempet</strong>\r
                <p>Brukes for sekundært innhold.</p>\r
            </Card>\r
            <Card variant="outline">\r
                <strong>Outline</strong>\r
                <p>Transparent med kantlinje.</p>\r
            </Card>\r
        </div>
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    padding: 'lg',
    children: 'Ekstra romslig padding for innhold som skal puste.'
  }
}`,...t.parameters?.docs?.source}}};const p=["Standard","Varianter","Padding"];export{t as Padding,n as Standard,e as Varianter,p as __namedExportsOrder,l as default};
