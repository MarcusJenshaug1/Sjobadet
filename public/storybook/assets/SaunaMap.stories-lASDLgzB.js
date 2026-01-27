import{a,j as e,M as p}from"./iframe-BeGkvnHr.js";import"./preload-helper-D1UD9lgW.js";function i({address:d,mapEmbedUrl:r,saunaName:l}){const[m,o]=a.useState(!1),t=a.useRef(null);return a.useEffect(()=>{if(!r)return;const s=new IntersectionObserver(u=>{u[0].isIntersecting&&(o(!0),s.disconnect())},{rootMargin:"200px"});return t.current&&s.observe(t.current),()=>s.disconnect()},[r]),r?e.jsxs("div",{ref:t,style:{minHeight:"300px",display:"flex",flexDirection:"column"},children:[e.jsx("p",{style:{marginBottom:"1rem",color:"#475569"},children:d}),e.jsx("div",{style:{position:"relative",flex:1,backgroundColor:"#f1f5f9",borderRadius:"0.75rem",overflow:"hidden",minHeight:"300px"},children:m?e.jsx("iframe",{src:r,title:`Kart over ${l}`,width:"100%",height:"100%",style:{border:0,position:"absolute",top:0,left:0},allowFullScreen:!0,loading:"lazy",referrerPolicy:"no-referrer-when-downgrade"}):e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",padding:"2rem",textAlign:"center"},children:[e.jsx(p,{size:48,color:"#94a3b8"}),e.jsx("button",{onClick:()=>o(!0),style:{padding:"0.75rem 1.5rem",backgroundColor:"var(--primary)",color:"white",border:"none",borderRadius:"0.5rem",fontWeight:"600",cursor:"pointer"},children:"Last inn kart"})]})})]}):null}i.__docgenInfo={description:"",methods:[],displayName:"SaunaMap",props:{address:{required:!0,tsType:{name:"string"},description:""},mapEmbedUrl:{required:!0,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},saunaName:{required:!0,tsType:{name:"string"},description:""}}};const c=`# SaunaMap\r
\r
Kort beskrivelse: Kartvisning for badstueadresse.\r
\r
## Bruk\r
- Bruk for å vise lokasjon med iframe-kart.\r
\r
## Ikke bruk\r
- Ikke bruk uten \`mapEmbedUrl\`.\r
\r
## Retningslinjer for innhold\r
- Vis tydelig adresse over kartet.\r
\r
## Props (kort)\r
- \`address\`: Adresse som vises over kartet.\r
- \`mapEmbedUrl\`: Iframe-URL til kart.\r
- \`saunaName\`: Brukes i \`title\`.\r
\r
## Eksempler\r
\`\`\`tsx\r
<SaunaMap address="Nedre Langgate 44" mapEmbedUrl="https://..." saunaName="Tønsberg" />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Iframe har beskrivende \`title\`.\r
\r
## Vedlikehold/Notater\r
- Kartet lastes inn når komponenten er synlig.\r
\r
## Gjør\r
- Bruk riktig adresse og tittel.\r
- Gi brukeren mulighet til å laste inn kart.\r
\r
## Unngå\r
- Ikke bruk uten \`mapEmbedUrl\`.\r
- Ikke bruk i områder med strenge personvernkrav uten vurdering.\r
`,f={title:"Komponenter/Badstue/SaunaMap",component:i,tags:["autodocs"],parameters:{docs:{description:{component:c}},layout:"padded"},argTypes:{address:{control:"text",description:"Adresse som vises over kartet."},mapEmbedUrl:{control:"text",description:"URL til kart-iframe."},saunaName:{control:"text",description:"Brukes i iframe-tittel."}},args:{address:"Nedre Langgate 44, 3126 Tønsberg",saunaName:"Tønsberg Brygge",mapEmbedUrl:"https://www.openstreetmap.org/export/embed.html?bbox=10.4085%2C59.2669%2C10.4208%2C59.2747&layer=mapnik"}},n={};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"{}",...n.parameters?.docs?.source}}};const b=["Standard"];export{n as Standard,b as __namedExportsOrder,f as default};
