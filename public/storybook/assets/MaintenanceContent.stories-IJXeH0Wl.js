import{j as e}from"./iframe-DpagJM2z.js";import{S as s}from"./SaunaCard-DGns6I0U.js";import"./preload-helper-D1UD9lgW.js";import"./SaunaCard.module-ChdoFVbf.js";import"./Badge-UpVByw1f.js";import"./BookingModal-QTC6XLr0.js";import"./index-BfpS9d6p.js";import"./availability-utils-DC47xJm5.js";import"./external-link-C3z-2HDX.js";function i({saunas:o,generatedAt:a}){return e.jsx("div",{style:{minHeight:"100vh",backgroundColor:"#f0f4f8",padding:"2rem 1rem",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'},children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto"},children:[e.jsxs("div",{style:{textAlign:"center",marginBottom:"3rem",paddingTop:"2rem"},children:[e.jsx("h1",{style:{fontSize:"2.5rem",fontWeight:700,color:"#0f172a",marginBottom:"0.75rem",letterSpacing:"-0.02em"},children:"Sjøbadet er under vedlikehold"}),e.jsxs("p",{style:{fontSize:"1.1rem",color:"#475569",marginBottom:"1.5rem",lineHeight:1.7},children:["Vi utfører rutinvedlikehold for å forbedre din opplevelse. Vi er tilbake snart!",e.jsx("br",{}),"I mellomtiden kan du se badstuer og booke direkte:"]}),e.jsxs("div",{style:{display:"inline-block",padding:"0.75rem 1.25rem",backgroundColor:"#f3f4f6",borderRadius:"0.5rem",fontSize:"0.85rem",color:"#6b7280",marginBottom:"2rem",border:"1px solid #d1d5db"},children:["Sist oppdatert: ",a]})]}),o.length>0?e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"1.5rem",marginBottom:"4rem"},children:o.map(r=>e.jsx(s,{sauna:{id:r.id,slug:r.slug,name:r.name,location:r.location,shortDescription:"",imageUrl:r.imageUrl,bookingUrlDropin:r.bookingUrlDropin,bookingUrlPrivat:r.bookingUrlPrivat,driftStatus:r.driftStatus},isMaintenanceMode:!0},r.id))}):e.jsx("div",{style:{textAlign:"center",padding:"4rem 2rem",backgroundColor:"white",borderRadius:"0.75rem",color:"#64748b",border:"1px solid #e2e8f0"},children:e.jsx("p",{style:{fontSize:"1.05rem",fontWeight:500},children:"Ingen badstuer tilgjengelig i vedlikeholdsmodus"})}),e.jsx("div",{style:{textAlign:"center",paddingTop:"2rem",paddingBottom:"2rem",color:"#64748b",fontSize:"0.9rem"},children:e.jsx("p",{style:{marginBottom:"0.5rem"},children:"Takk for tålmodigheten. Vi er tilbake snart!"})})]})})}i.__docgenInfo={description:"",methods:[],displayName:"MaintenanceContent",props:{saunas:{required:!0,tsType:{name:"Array",elements:[{name:"SaunaSnapshot"}],raw:"SaunaSnapshot[]"},description:""},generatedAt:{required:!0,tsType:{name:"string"},description:""}}};const d=`# MaintenanceContent\r
\r
Kort beskrivelse: Vedlikeholdsside med liste over badstuer og bookinglenker.\r
\r
## Bruk\r
- Bruk når hele tjenesten er i vedlikeholdsmodus.\r
\r
## Ikke bruk\r
- Ikke bruk som vanlig innholdsside.\r
\r
## Retningslinjer for innhold\r
- Bruk tydelig tittel og status.\r
- Oppgi tidspunkt for sist oppdatering.\r
\r
## Props (kort)\r
- \`saunas\`: Snapshot av badstuer med booking-URL.\r
- \`generatedAt\`: Tidspunkt for snapshot.\r
\r
## Eksempler\r
\`\`\`tsx\r
<MaintenanceContent saunas={[]} generatedAt="26.01.2026 12:00" />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Tekst er høykontrast og sentrert.\r
\r
## Vedlikehold/Notater\r
- Brukes sammen med vedlikeholdsmodus i admin.\r
\r
## Gjør\r
- Oppgi sist oppdatert tidspunkt.\r
- Hold teksten rolig og informativ.\r
\r
## Unngå\r
- Ikke bruk for kampanjer.\r
- Ikke skjul statusinformasjon.\r
`,h={title:"Komponenter/Vedlikehold/MaintenanceContent",component:i,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:d}}}},n={args:{generatedAt:"26.01.2026 12:00",saunas:[{id:"1",slug:"tonsberg-brygge",name:"Tønsberg Brygge",location:"Tønsberg",imageUrl:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",bookingUrlDropin:"#",bookingUrlPrivat:"#",driftStatus:"open"},{id:"2",slug:"hjemseng-brygge",name:"Hjemseng Brygge",location:"Nøtterøy",imageUrl:"https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",bookingUrlDropin:"#",bookingUrlPrivat:"#",driftStatus:"closed"}]}},t={args:{generatedAt:"26.01.2026 12:00",saunas:[]}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    generatedAt: '26.01.2026 12:00',
    saunas: [{
      id: '1',
      slug: 'tonsberg-brygge',
      name: 'Tønsberg Brygge',
      location: 'Tønsberg',
      imageUrl: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bookingUrlDropin: '#',
      bookingUrlPrivat: '#',
      driftStatus: 'open'
    }, {
      id: '2',
      slug: 'hjemseng-brygge',
      name: 'Hjemseng Brygge',
      location: 'Nøtterøy',
      imageUrl: 'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bookingUrlDropin: '#',
      bookingUrlPrivat: '#',
      driftStatus: 'closed'
    }]
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    generatedAt: '26.01.2026 12:00',
    saunas: []
  }
}`,...t.parameters?.docs?.source}}};const x=["Standard","IngenBadstuer"];export{t as IngenBadstuer,n as Standard,x as __namedExportsOrder,h as default};
