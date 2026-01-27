import{j as e}from"./jsx-runtime-DDl-KI2x.js";import{B as d}from"./Button-Beo3o9mi.js";import"./iframe-C_JdCeVj.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./link-XK0mguUS.js";import"./use-merged-ref-B-uQP8i3.js";const l="_page_14zlw_3",p="_pageHeader_14zlw_15",c="_pageTitle_14zlw_41",u="_pageActions_14zlw_55",m="_pageContent_14zlw_69",r={page:l,pageHeader:p,pageTitle:c,pageActions:u,pageContent:m,"layout-narrow":"_layout-narrow_14zlw_79","layout-wide":"_layout-wide_14zlw_91","layout-fluid":"_layout-fluid_14zlw_103"};function i({children:t,layout:s="wide",title:a,actions:o}){return e.jsxs("div",{className:r.page,children:[(a||o)&&e.jsxs("div",{className:r.pageHeader,children:[a&&e.jsx("h1",{className:r.pageTitle,children:a}),o&&e.jsx("div",{className:r.pageActions,children:o})]}),e.jsx("div",{className:`${r.pageContent} ${r[`layout-${s}`]}`,children:t})]})}i.__docgenInfo={description:"",methods:[],displayName:"PageWrapper",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},layout:{required:!1,tsType:{name:"union",raw:"'narrow' | 'wide' | 'fluid'",elements:[{name:"literal",value:"'narrow'"},{name:"literal",value:"'wide'"},{name:"literal",value:"'fluid'"}]},description:"",defaultValue:{value:"'wide'",computed:!1}},title:{required:!1,tsType:{name:"string"},description:""},actions:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const g=`# PageWrapper\r
\r
Kort beskrivelse: Admin-layout som gir tittel, actions og innholdsramme.\r
\r
## Bruk\r
- Bruk som ramme for admin-sider.\r
\r
## Ikke bruk\r
- Ikke bruk på offentlige sider.\r
\r
## Retningslinjer for innhold\r
- Bruk korte og beskrivende sidetitler.\r
\r
## Props (kort)\r
- \`children\`: Innhold.\r
- \`layout\`: \`narrow\`, \`wide\` eller \`fluid\`.\r
- \`title\`: Sidetittel.\r
- \`actions\`: Handlinger (knapper/lenker).\r
\r
## Eksempler\r
\`\`\`tsx\r
<PageWrapper title="Badstuer" actions={<Button>Ny</Button>}>\r
  ...\r
</PageWrapper>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Bruk semantiske overskrifter for tittelen.\r
\r
## Vedlikehold/Notater\r
- Layout-klassene er definert i CSS-modulen.\r
\r
## Gjør\r
- Gi hver side en tydelig tittel.\r
- Hold actions samlet og konsistent.\r
\r
## Unngå\r
- Ikke legg inn svært lange titler.\r
- Ikke bland layout-typer uten behov.\r
`,x={title:"Komponenter/Admin/PageWrapper",component:i,tags:["autodocs"],parameters:{docs:{description:{component:g}}},argTypes:{layout:{control:"select",options:["narrow","wide","fluid"],description:"Bredde på innholdskolonnen."},title:{control:"text",description:"Sidetittel."}},args:{title:"Badstuer",layout:"wide",actions:e.jsx(d,{size:"sm",children:"Ny badstue"})}},n={render:t=>e.jsx(i,{...t,children:e.jsx("div",{style:{background:"#f8fafc",padding:"1rem",borderRadius:"0.5rem"},children:"Innhold for adminsiden."})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <PageWrapper {...args}>\r
            <div style={{
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '0.5rem'
    }}>\r
                Innhold for adminsiden.\r
            </div>\r
        </PageWrapper>
}`,...n.parameters?.docs?.source}}};const j=["Standard"];export{n as Standard,j as __namedExportsOrder,x as default};
