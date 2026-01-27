import{R as p,j as e,m}from"./iframe-BeGkvnHr.js";import"./preload-helper-D1UD9lgW.js";const g="_select_1qow0_1",u="_sm_1qow0_59",k="_md_1qow0_69",v="_lg_1qow0_77",l={select:g,sm:u,md:k,lg:v},r=p.forwardRef(({size:s="md",className:a,children:i,...d},c)=>e.jsx("select",{ref:c,className:m(l.select,l[s],a),...d,children:i}));r.displayName="Select";r.__docgenInfo={description:"",methods:[],displayName:"Select",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}}},composes:["Omit"]};const S=`# Select\r
\r
Kort beskrivelse: Nedtrekksliste for valg blant faste alternativer.\r
\r
## Bruk\r
- Bruk når brukeren skal velge ett alternativ.\r
- Bruk korte og tydelige alternativtekster.\r
\r
## Ikke bruk\r
- Ikke bruk når det er færre enn 3 valg (vurder radio-knapper).\r
- Ikke bruk for søkbare lister (bruk egen søkekomponent).\r
\r
## Retningslinjer for innhold\r
- Første alternativ bør være en nøytral «Velg…»-tekst.\r
- Tekster skal være korte og entydige.\r
\r
## Props (kort)\r
- \`size\`: Størrelse (\`sm\`, \`md\`, \`lg\`).\r
- \`disabled\`: Deaktiverer listen.\r
- \`children\`: \`option\`-elementer.\r
\r
## Eksempler\r
\`\`\`tsx\r
<label htmlFor="sauna">Velg badstue</label>\r
<Select id="sauna">\r
  <option value="">Velg…</option>\r
  <option value="oslo">Oslo</option>\r
  <option value="bergen">Bergen</option>\r
</Select>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Koble \`label\` og \`select\` med \`htmlFor\`/\`id\`.\r
- Bruk \`aria-describedby\` for hjelpetekst.\r
\r
## Vedlikehold/Notater\r
- Unngå store datamengder uten søk/filtrering.\r
\r
## Gjør\r
- Start med et nøytralt «Velg…»-alternativ.\r
- Hold alternativtekster korte og tydelige.\r
\r
## Unngå\r
- Ikke bruk for to eller færre alternativer.\r
- Ikke bruk for svært store lister uten søk.\r
`,x={title:"Komponenter/Skjema/Select",component:r,tags:["autodocs"],parameters:{docs:{description:{component:S}}},argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Størrelse på feltets padding og tekst."},disabled:{control:"boolean",description:"Deaktiverer listen."}},args:{size:"md"}},t={render:s=>e.jsxs(r,{...s,children:[e.jsx("option",{value:"",children:"Velg badstue…"}),e.jsx("option",{value:"oslo",children:"Oslo"}),e.jsx("option",{value:"bergen",children:"Bergen"}),e.jsx("option",{value:"tromso",children:"Tromsø"})]})},n={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.75rem",maxWidth:320},children:[e.jsx(r,{size:"sm",children:e.jsx("option",{children:"Sm"})}),e.jsx(r,{size:"md",children:e.jsx("option",{children:"Md"})}),e.jsx(r,{size:"lg",children:e.jsx("option",{children:"Lg"})})]})},o={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.75rem",maxWidth:320},children:[e.jsx(r,{children:e.jsx("option",{children:"Normal"})}),e.jsx(r,{disabled:!0,children:e.jsx("option",{children:"Deaktivert"})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <Select {...args}>\r
            <option value="">Velg badstue…</option>\r
            <option value="oslo">Oslo</option>\r
            <option value="bergen">Bergen</option>\r
            <option value="tromso">Tromsø</option>\r
        </Select>
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '0.75rem',
    maxWidth: 320
  }}>\r
            <Select size="sm">\r
                <option>Sm</option>\r
            </Select>\r
            <Select size="md">\r
                <option>Md</option>\r
            </Select>\r
            <Select size="lg">\r
                <option>Lg</option>\r
            </Select>\r
        </div>
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '0.75rem',
    maxWidth: 320
  }}>\r
            <Select>\r
                <option>Normal</option>\r
            </Select>\r
            <Select disabled>\r
                <option>Deaktivert</option>\r
            </Select>\r
        </div>
}`,...o.parameters?.docs?.source}}};const j=["Standard","Størrelser","Tilstander"];export{t as Standard,n as Størrelser,o as Tilstander,j as __namedExportsOrder,x as default};
