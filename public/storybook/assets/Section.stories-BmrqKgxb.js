import{j as e}from"./jsx-runtime-C8V8hRFh.js";import{c}from"./clsx-B-dksMZM.js";import"./iframe-2gXNPU8n.js";import"./preload-helper-D1UD9lgW.js";const m="_section_1m7q8_1",p="_sm_1m7q8_9",k="_md_1m7q8_17",u="_lg_1m7q8_25",t={section:m,sm:p,md:k,lg:u};function r({as:i="section",size:o="md",className:d,children:a,...l}){return e.jsx(i,{className:c(t.section,t[o],d),...l,children:a})}r.__docgenInfo={description:"",methods:[],displayName:"Section",props:{as:{required:!1,tsType:{name:"ReactElementType",raw:"React.ElementType"},description:"",defaultValue:{value:"'section'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}}}};const g=`# Section\r
\r
Kort beskrivelse: Vertikal spacing-blokk for å separere innhold.\r
\r
## Bruk\r
- Bruk for å skape rytme mellom store innholdsblokker.\r
- Kombiner med \`Container\`.\r
\r
## Ikke bruk\r
- Ikke bruk for små avstander; bruk \`Stack\` eller CSS i stedet.\r
\r
## Retningslinjer for innhold\r
- Bruk størrelse som matcher innholdets betydning.\r
\r
## Props (kort)\r
- \`as\`: Render som annet element (\`section\`, \`div\`, osv.).\r
- \`size\`: Vertikal padding (\`sm\`, \`md\`, \`lg\`).\r
\r
## Eksempler\r
\`\`\`tsx\r
<Section size="lg">\r
  <Container>...</Container>\r
</Section>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Bruk \`section\` når innholdet er semantisk en egen seksjon.\r
\r
## Vedlikehold/Notater\r
- Endringer i spacing skal gjøres i CSS-modulen.\r
\r
## Gjør\r
- Bruk \`Section\` for tydelig vertikal rytme.\r
- Velg størrelse ut fra innholdets betydning.\r
\r
## Unngå\r
- Ikke bruk for små mellomrom.\r
- Ikke bruk \`Section\` når \`Stack\` er mer passende.\r
`,v={title:"Komponenter/Layout/Section",component:r,tags:["autodocs"],parameters:{docs:{description:{component:g}}},argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Vertikal spacing rundt seksjonen."},as:{control:"text",description:"Semantisk element (f.eks. `section`)."}},args:{size:"md"}},n={render:()=>e.jsx(r,{children:e.jsx("div",{style:{background:"#f8fafc",padding:"1rem",borderRadius:"0.5rem"},children:"Seksjonsinnhold"})})},s={render:()=>e.jsxs("div",{style:{display:"grid",gap:"1rem"},children:[e.jsx(r,{size:"sm",children:e.jsx("div",{style:{background:"#f8fafc",padding:"0.75rem",borderRadius:"0.5rem"},children:"Liten seksjon"})}),e.jsx(r,{size:"md",children:e.jsx("div",{style:{background:"#f8fafc",padding:"0.75rem",borderRadius:"0.5rem"},children:"Standard seksjon"})}),e.jsx(r,{size:"lg",children:e.jsx("div",{style:{background:"#f8fafc",padding:"0.75rem",borderRadius:"0.5rem"},children:"Stor seksjon"})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Section>\r
            <div style={{
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '0.5rem'
    }}>\r
                Seksjonsinnhold\r
            </div>\r
        </Section>
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '1rem'
  }}>\r
            <Section size="sm">\r
                <div style={{
        background: '#f8fafc',
        padding: '0.75rem',
        borderRadius: '0.5rem'
      }}>\r
                    Liten seksjon\r
                </div>\r
            </Section>\r
            <Section size="md">\r
                <div style={{
        background: '#f8fafc',
        padding: '0.75rem',
        borderRadius: '0.5rem'
      }}>\r
                    Standard seksjon\r
                </div>\r
            </Section>\r
            <Section size="lg">\r
                <div style={{
        background: '#f8fafc',
        padding: '0.75rem',
        borderRadius: '0.5rem'
      }}>\r
                    Stor seksjon\r
                </div>\r
            </Section>\r
        </div>
}`,...s.parameters?.docs?.source}}};const y=["Standard","Størrelser"];export{n as Standard,s as Størrelser,y as __namedExportsOrder,v as default};
