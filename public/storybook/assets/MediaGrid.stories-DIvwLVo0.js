import{M as e}from"./MediaGrid-DIdIEfcK.js";import"./iframe-ChuUt2dm.js";import"./preload-helper-D1UD9lgW.js";import"./index-B3Actpat.js";import"./MediaItem-nxNUnL50.js";import"./MediaManager.module-BIXRbq_H.js";const t=`# MediaGrid\r
\r
Kort beskrivelse: Grid med sortering av medier via drag-and-drop.\r
\r
## Bruk\r
- Bruk for å sortere galleri-bilder.\r
\r
## Ikke bruk\r
- Ikke bruk for store lister uten virtualisering.\r
\r
## Retningslinjer for innhold\r
- Vis tydelig slett-ikon og drag-håndtak.\r
\r
## Props (kort)\r
- \`assets\`: Liste over mediaobjekter.\r
- \`onReorder\`: Kalles med ny rekkefølge.\r
- \`onDelete\`: Kalles ved sletting.\r
\r
## Eksempler\r
\`\`\`tsx\r
<MediaGrid assets={assets} onReorder={setAssets} onDelete={handleDelete} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Drag-håndtak bør være tastaturnavigerbart der mulig.\r
\r
## Vedlikehold/Notater\r
- Bruker dnd-kit for sortering.\r
\r
## Gjør\r
- Vis tydelig drag-håndtak.\r
- Gi rask respons ved sortering.\r
\r
## Unngå\r
- Ikke bruk for store gallerier uten paginering.\r
- Ikke skjul slettehandlinger.\r
`,l={title:"Komponenter/Admin/MediaGrid",component:e,tags:["autodocs"],parameters:{docs:{description:{component:t}}},argTypes:{assets:{control:"object",description:"Liste over mediaobjekter i gridet."},onReorder:{action:"reorder",description:"Kalles når rekkefølgen endres."},onDelete:{action:"delete",description:"Kalles ved sletting."}}},r={args:{assets:[{id:"1",url:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",status:"confirmed"},{id:"2",url:"https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",status:"confirmed"},{id:"3",url:"https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",status:"confirmed"}]}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    assets: [{
      id: '1',
      url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'confirmed'
    }, {
      id: '2',
      url: 'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'confirmed'
    }, {
      id: '3',
      url: 'https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'confirmed'
    }]
  }
}`,...r.parameters?.docs?.source}}};const f=["Standard"];export{r as Standard,f as __namedExportsOrder,l as default};
