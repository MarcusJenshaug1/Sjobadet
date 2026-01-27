import{j as e}from"./jsx-runtime-C8V8hRFh.js";import{c as d}from"./clsx-B-dksMZM.js";import{B as n}from"./Button-CV0DL16h.js";import"./iframe-2gXNPU8n.js";import"./preload-helper-D1UD9lgW.js";import"./link-mazOOwm8.js";import"./use-merged-ref-B51OLTfl.js";const k="_stack_c0y13_1",g="_row_c0y13_9",v="_column_c0y13_17",f="_wrap_c0y13_25",s={stack:k,row:g,column:v,wrap:f};function o({direction:r="column",gap:l=3,wrap:i=!1,className:c,style:m,children:p,...u}){return e.jsx("div",{className:d(s.stack,s[r],i&&s.wrap,c),style:{gap:`var(--space-${l})`,...m},...u,children:p})}o.__docgenInfo={description:"",methods:[],displayName:"Stack",props:{direction:{required:!1,tsType:{name:"union",raw:"'row' | 'column'",elements:[{name:"literal",value:"'row'"},{name:"literal",value:"'column'"}]},description:"",defaultValue:{value:"'column'",computed:!1}},gap:{required:!1,tsType:{name:"union",raw:"1 | 2 | 3 | 4 | 5 | 6 | 7 | 8",elements:[{name:"literal",value:"1"},{name:"literal",value:"2"},{name:"literal",value:"3"},{name:"literal",value:"4"},{name:"literal",value:"5"},{name:"literal",value:"6"},{name:"literal",value:"7"},{name:"literal",value:"8"}]},description:"",defaultValue:{value:"3",computed:!1}},wrap:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const B=`# Stack\r
\r
Kort beskrivelse: Fleksibel layout-komponent for jevne mellomrom.\r
\r
## Bruk\r
- Bruk for vertikale eller horisontale lister.\r
- Bruk \`gap\` for konsistent spacing.\r
\r
## Ikke bruk\r
- Ikke bruk når grid er mer passende.\r
\r
## Retningslinjer for innhold\r
- Hold gap konsekvent innen samme seksjon.\r
\r
## Props (kort)\r
- \`direction\`: \`row\` eller \`column\`.\r
- \`gap\`: Verdier 1–8 (koblet til \`--space-*\`).\r
- \`wrap\`: Tillat linjebryting.\r
\r
## Eksempler\r
\`\`\`tsx\r
<Stack direction="row" gap={4}>\r
  <Button>Ja</Button>\r
  <Button variant="outline">Nei</Button>\r
</Stack>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Sørg for logisk tab-rekkefølge når elementer bryter linje.\r
\r
## Vedlikehold/Notater\r
- \`gap\` bruker CSS-variabler, oppdateres i tokens.\r
\r
## Gjør\r
- Bruk \`gap\` for jevne mellomrom.\r
- Hold samme retning i samme gruppe.\r
\r
## Unngå\r
- Ikke bruk til komplekse grid-oppsett.\r
- Ikke bland retninger uten god grunn.\r
`,x={title:"Komponenter/Layout/Stack",component:o,tags:["autodocs"],parameters:{docs:{description:{component:B}}},argTypes:{direction:{control:"select",options:["row","column"],description:"Retning for elementene."},gap:{control:"select",options:[1,2,3,4,5,6,7,8],description:"Mellomrom basert på spacing-tokens."},wrap:{control:"boolean",description:"Tillat linjebryting når det ikke er plass."}},args:{direction:"row",gap:3,wrap:!1}},t={render:r=>e.jsxs(o,{...r,children:[e.jsx(n,{size:"sm",children:"Knapp"}),e.jsx(n,{size:"sm",variant:"outline",children:"Outline"}),e.jsx(n,{size:"sm",variant:"ghost",children:"Ghost"})]})},a={args:{direction:"column",gap:4},render:r=>e.jsxs(o,{...r,children:[e.jsx(n,{children:"Bestill"}),e.jsx(n,{variant:"secondary",children:"Les mer"})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <Stack {...args}>\r
            <Button size="sm">Knapp</Button>\r
            <Button size="sm" variant="outline">Outline</Button>\r
            <Button size="sm" variant="ghost">Ghost</Button>\r
        </Stack>
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    direction: 'column',
    gap: 4
  },
  render: args => <Stack {...args}>\r
            <Button>Bestill</Button>\r
            <Button variant="secondary">Les mer</Button>\r
        </Stack>
}`,...a.parameters?.docs?.source}}};const T=["Standard","Vertikal"];export{t as Standard,a as Vertikal,T as __namedExportsOrder,x as default};
