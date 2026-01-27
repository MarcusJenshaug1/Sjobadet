import{M as a}from"./MediaItem-c2Z6YF3L.js";import"./jsx-runtime-C8V8hRFh.js";import"./iframe-2gXNPU8n.js";import"./preload-helper-D1UD9lgW.js";import"./MediaManager.module-BIXRbq_H.js";import"./image-CD-QxPcS.js";import"./use-merged-ref-B51OLTfl.js";import"./createLucideIcon-DP3iA5K4.js";import"./x-B4Dzqw0X.js";const n=`# MediaItem\r
\r
Kort beskrivelse: Enkeltkort for bildeopplasting i admin.\r
\r
## Bruk\r
- Bruk i admin for å vise bilde, status og slett/omlast.\r
\r
## Ikke bruk\r
- Ikke bruk i offentlig UI.\r
\r
## Retningslinjer for innhold\r
- Vis tydelige status-tekster og progress.\r
\r
## Props (kort)\r
- \`asset\`: Bildeobjekt med status og URL.\r
- \`onDelete\`: Kalles ved sletting.\r
- \`onRetry\`: Kalles ved feil for å prøve igjen.\r
- \`isPrimary\`: Marker som hovedbilde.\r
- \`dragHandleProps\`: Brukes for sortering.\r
\r
## Eksempler\r
\`\`\`tsx\r
<MediaItem asset={asset} onDelete={handleDelete} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Sletteknapp har \`aria-label\`.\r
\r
## Vedlikehold/Notater\r
- Støtter \`blob:\` URL-er for lokale previews.\r
\r
## Gjør\r
- Vis tydelig status (opplasting, feil, bekreftet).\r
- Bruk \`isPrimary\` for hovedbilde.\r
\r
## Unngå\r
- Ikke bruk i offentlig UI.\r
- Ikke skjul feil uten tekst.\r
`,x={title:"Komponenter/Admin/MediaItem",component:a,tags:["autodocs"],parameters:{docs:{description:{component:n}}}},r={args:{asset:{id:"1",url:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",status:"confirmed"},onDelete:e=>console.log("Delete",e)}},t={args:{asset:{id:"2",url:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",status:"uploading",progress:45},onDelete:e=>console.log("Delete",e)}},o={args:{asset:{id:"3",url:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",status:"processing"},onDelete:e=>console.log("Delete",e)}},s={args:{asset:{id:"4",url:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",status:"error",error:"Filen er for stor"},onDelete:e=>console.log("Delete",e)}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    asset: {
      id: '1',
      url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'confirmed'
    },
    onDelete: id => console.log('Delete', id)
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    asset: {
      id: '2',
      url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'uploading',
      progress: 45
    },
    onDelete: id => console.log('Delete', id)
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    asset: {
      id: '3',
      url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'processing'
    },
    onDelete: id => console.log('Delete', id)
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    asset: {
      id: '4',
      url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'error',
      error: 'Filen er for stor'
    },
    onDelete: id => console.log('Delete', id)
  }
}`,...s.parameters?.docs?.source}}};const D=["Bekreftet","LasterOpp","Behandler","Feil"];export{o as Behandler,r as Bekreftet,s as Feil,t as LasterOpp,D as __namedExportsOrder,x as default};
