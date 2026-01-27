import{j as e}from"./jsx-runtime-C8V8hRFh.js";import{c as k}from"./clsx-B-dksMZM.js";import{X as r}from"./x-B4Dzqw0X.js";import{c as d}from"./createLucideIcon-DP3iA5K4.js";import"./iframe-2gXNPU8n.js";import"./preload-helper-D1UD9lgW.js";const p=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],g=d("heart",p);const v=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],b=d("search",v),h="_button_j007o_1",_="_sm_j007o_25",j="_md_j007o_35",x="_lg_j007o_45",B="_ghost_j007o_55",I="_outline_j007o_63",f="_solid_j007o_83",l={button:h,sm:_,md:j,lg:x,ghost:B,outline:I,solid:f};function n({size:i="md",variant:c="ghost",className:t,children:u,...m}){return e.jsx("button",{className:k(l.button,l[i],l[c],t),...m,children:u})}n.__docgenInfo={description:"",methods:[],displayName:"IconButton",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'ghost' | 'outline' | 'solid'",elements:[{name:"literal",value:"'ghost'"},{name:"literal",value:"'outline'"},{name:"literal",value:"'solid'"}]},description:"",defaultValue:{value:"'ghost'",computed:!1}}}};const z=`# IconButton\r
\r
Kort beskrivelse: Knapp for ikon-baserte handlinger.\r
\r
## Bruk\r
- Bruk når ikonet er selvforklarende (f.eks. lukk, søk, favoritt).\r
- Bruk \`aria-label\` med tydelig tekst.\r
\r
## Ikke bruk\r
- Ikke bruk når handlingen trenger forklaring; bruk \`Button\` med tekst.\r
\r
## Retningslinjer for innhold\r
- Hold ikonstørrelse konsistent (16–20px).\r
\r
## Props (kort)\r
- \`variant\`: \`ghost\`, \`outline\`, \`solid\`.\r
- \`size\`: \`sm\`, \`md\`, \`lg\`.\r
- \`aria-label\`: Obligatorisk for skjermlesere.\r
\r
## Eksempler\r
\`\`\`tsx\r
<IconButton aria-label="Lukk">\r
  <X size={18} />\r
</IconButton>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- \`aria-label\` er påkrevd.\r
- Unngå handlinger kun via farge/ikon uten tekst i UI.\r
\r
## Vedlikehold/Notater\r
- Bruk konsistente ikoner fra samme ikonsett.\r
\r
## Gjør\r
- Bruk \`aria-label\` på alle ikonknapper.\r
- Hold ikonstørrelse konsekvent.\r
\r
## Unngå\r
- Ikke bruk for uklare handlinger.\r
- Ikke bruk som primær handling uten tekst.\r
`,{expect:y,userEvent:S,within:L}=__STORYBOOK_MODULE_TEST__,K={title:"Komponenter/Knapper/IconButton",component:n,tags:["autodocs"],parameters:{docs:{description:{component:z}}},argTypes:{variant:{control:"select",options:["ghost","outline","solid"],description:"Visuell variant for ikonknappen."},size:{control:"select",options:["sm","md","lg"],description:"Størrelse på knapp og ikon."}},args:{variant:"ghost",size:"md"}},a={args:{"aria-label":"Lukk",children:e.jsx(r,{size:18})},play:async({canvasElement:i})=>{const t=L(i).getByRole("button",{name:"Lukk"});await S.click(t),await y(t).toBeEnabled()}},s={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center"},children:[e.jsx(n,{"aria-label":"Søk",variant:"ghost",children:e.jsx(b,{size:18})}),e.jsx(n,{"aria-label":"Favoritt",variant:"outline",children:e.jsx(g,{size:18})}),e.jsx(n,{"aria-label":"Lukk",variant:"solid",children:e.jsx(r,{size:18})})]})},o={render:()=>e.jsxs("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center"},children:[e.jsx(n,{"aria-label":"Liten",size:"sm",children:e.jsx(r,{size:14})}),e.jsx(n,{"aria-label":"Standard",size:"md",children:e.jsx(r,{size:18})}),e.jsx(n,{"aria-label":"Stor",size:"lg",children:e.jsx(r,{size:22})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    'aria-label': 'Lukk',
    children: <X size={18} />
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: 'Lukk'
    });
    await userEvent.click(button);
    await expect(button).toBeEnabled();
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  }}>\r
            <IconButton aria-label="Søk" variant="ghost">\r
                <Search size={18} />\r
            </IconButton>\r
            <IconButton aria-label="Favoritt" variant="outline">\r
                <Heart size={18} />\r
            </IconButton>\r
            <IconButton aria-label="Lukk" variant="solid">\r
                <X size={18} />\r
            </IconButton>\r
        </div>
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  }}>\r
            <IconButton aria-label="Liten" size="sm">\r
                <X size={14} />\r
            </IconButton>\r
            <IconButton aria-label="Standard" size="md">\r
                <X size={18} />\r
            </IconButton>\r
            <IconButton aria-label="Stor" size="lg">\r
                <X size={22} />\r
            </IconButton>\r
        </div>
}`,...o.parameters?.docs?.source}}};const N=["Standard","Varianter","Størrelser"];export{a as Standard,o as Størrelser,s as Varianter,N as __namedExportsOrder,K as default};
