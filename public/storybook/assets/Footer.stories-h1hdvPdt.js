import{j as e}from"./jsx-runtime-DDl-KI2x.js";import{L as i}from"./link-XK0mguUS.js";import{C as k}from"./CookieSettingsTrigger-CEAnX1kh.js";import{M as h}from"./map-pin-O-PiCWul.js";import{c as u}from"./createLucideIcon-DMVqFKYz.js";import"./iframe-C_JdCeVj.js";import"./preload-helper-PPVm8Dsz.js";import"./use-merged-ref-B-uQP8i3.js";const y=[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]],v=u("facebook",y);const b=[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]],x=u("instagram",b);const j=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],w=u("mail",j);const _=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],S=u("phone",_),q="_footer_oh5to_1",N="_content_oh5to_15",T="_section_oh5to_39",D="_links_oh5to_51",F="_bottom_oh5to_71",A="_icon_oh5to_97",I="_socialLink_oh5to_107",s={footer:q,content:N,section:T,links:D,bottom:F,icon:A,socialLink:I};function L(o){if(!o||o.length===0)return"Kontakt oss for åpningstider";const t=o.filter(n=>n.type==="weekly").sort((n,f)=>(n.weekday??0)-(f.weekday??0));if(t.length===0)return"Kontakt oss for åpningstider";const l=t.filter(n=>n.active);if(l.length===0)return"Stengt";const a=l[0];if(t.length===7&&t.every(n=>n.active&&n.opens===a.opens&&n.closes===a.closes))return`Alle dager: ${a.opens} - ${a.closes}`;const c=t.filter(n=>(n.weekday??0)<5),r=c[0];return c.every(n=>n.active===r.active&&n.opens===r.opens&&n.closes===r.closes)&&c.length===5?`Man-Fre: ${r.active?`${r.opens} - ${r.closes}`:"Stengt"}, Lør-Søn: Se detaljer`:"Åpent - se detaljer"}function p({address:o,email:t,phone:l,instagram:a,facebook:m,saunas:c}){return e.jsx("footer",{className:s.footer,children:e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:s.content,children:[e.jsxs("div",{className:s.section,children:[e.jsx("h3",{children:"Sjøbadet Badstue"}),e.jsx("p",{children:"Avslappende badstueopplevelser for kropp og sjel i Tønsberg."}),e.jsxs("div",{style:{marginTop:"1.5rem",display:"flex",flexDirection:"column",gap:"0.75rem"},children:[e.jsxs("div",{style:{display:"flex",gap:"0.75rem",alignItems:"start"},children:[e.jsx(h,{size:18,className:s.icon}),e.jsx("span",{children:o})]}),e.jsxs("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center"},children:[e.jsx(w,{size:18,className:s.icon}),e.jsx("a",{href:`mailto:${t}`,style:{color:"inherit"},children:t})]}),e.jsxs("div",{style:{display:"flex",gap:"0.75rem",alignItems:"center"},children:[e.jsx(S,{size:18,className:s.icon}),e.jsx("a",{href:`tel:${l.replace(/\s/g,"")}`,style:{color:"inherit"},children:l})]})]}),(a||m)&&e.jsxs("div",{style:{marginTop:"1.5rem",display:"flex",gap:"1rem"},children:[a&&e.jsx("a",{href:a,target:"_blank",rel:"noopener noreferrer",className:s.socialLink,children:e.jsx(x,{size:24})}),m&&e.jsx("a",{href:m,target:"_blank",rel:"noopener noreferrer",className:s.socialLink,children:e.jsx(v,{size:24})})]})]}),e.jsxs("div",{className:s.section,children:[e.jsx("h3",{children:"Åpningstider"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"1.25rem"},children:c.map(r=>{const g=r.driftStatus==="closed";return e.jsxs("div",{children:[e.jsxs("p",{style:{fontWeight:600,marginBottom:"0.25rem",color:"var(--primary)",display:"flex",alignItems:"center",gap:"0.5rem"},children:[r.name,g&&e.jsx("span",{style:{color:"#ef4444",fontSize:"0.75rem",backgroundColor:"#fee2e2",padding:"0.1rem 0.4rem",borderRadius:"4px"},children:"STENGT"})]}),g?e.jsx("p",{style:{fontSize:"0.85rem",color:"#666",fontStyle:"italic"},children:r.stengeArsak||"Midlertidig stengt"}):e.jsx("p",{style:{fontSize:"0.85rem",color:"#444"},children:r.flexibleHours?r.hoursMessage||"Tilgjengelig ved leie":L(r.openingHours)})]},r.id)})})]}),e.jsxs("div",{className:s.section,children:[e.jsx("h3",{children:"Informasjon"}),e.jsxs("div",{className:s.links,children:[e.jsx(i,{href:"/info/faq",children:"Ofte stilte spørsmål"}),e.jsx(i,{href:"/info/regler",children:"Badstueregler"}),e.jsx(i,{href:"/info/vilkar",children:"Salgsbetingelser"}),e.jsx(i,{href:"/info/om-oss",children:"Om oss"}),e.jsx(i,{href:"/info/apningstider",children:"Åpningstider"}),e.jsx(i,{href:"/info/personvern",children:"Personvernerklæring"})]})]})]}),e.jsxs("div",{className:s.bottom,children:[e.jsxs("p",{children:["© ",new Date().getFullYear()," Sjøbadet AS. Org.nr: 926 084 275."]}),e.jsx(k,{label:"Personvernvalg"})]})]})})}p.__docgenInfo={description:"",methods:[],displayName:"FooterView",props:{address:{required:!0,tsType:{name:"string"},description:""},email:{required:!0,tsType:{name:"string"},description:""},phone:{required:!0,tsType:{name:"string"},description:""},instagram:{required:!1,tsType:{name:"string"},description:""},facebook:{required:!1,tsType:{name:"string"},description:""},saunas:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{\r
    id: string;\r
    name: string;\r
    slug?: string | null;\r
    location?: string | null;\r
    shortDescription?: string | null;\r
    capacityDropin?: number | null;\r
    capacityPrivat?: number | null;\r
    driftStatus?: string | null;\r
    flexibleHours?: boolean | null;\r
    hoursMessage?: string | null;\r
    stengeArsak?: string | null;\r
    openingHours?: OpeningHour[] | null;\r
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"slug",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"location",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"shortDescription",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"capacityDropin",value:{name:"union",raw:"number | null",elements:[{name:"number"},{name:"null"}],required:!1}},{key:"capacityPrivat",value:{name:"union",raw:"number | null",elements:[{name:"number"},{name:"null"}],required:!1}},{key:"driftStatus",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"flexibleHours",value:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}],required:!1}},{key:"hoursMessage",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"stengeArsak",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"openingHours",value:{name:"union",raw:"OpeningHour[] | null",elements:[{name:"Array",elements:[{name:"signature",type:"object",raw:`{\r
    id?: string;\r
    saunaId?: string;\r
    type?: string | null;\r
    weekday?: number | null;\r
    date?: Date | null;\r
    opens?: string | null;\r
    closes?: string | null;\r
    active?: boolean | null;\r
    createdAt?: Date;\r
}`,signature:{properties:[{key:"id",value:{name:"string",required:!1}},{key:"saunaId",value:{name:"string",required:!1}},{key:"type",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"weekday",value:{name:"union",raw:"number | null",elements:[{name:"number"},{name:"null"}],required:!1}},{key:"date",value:{name:"union",raw:"Date | null",elements:[{name:"Date"},{name:"null"}],required:!1}},{key:"opens",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"closes",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!1}},{key:"active",value:{name:"union",raw:"boolean | null",elements:[{name:"boolean"},{name:"null"}],required:!1}},{key:"createdAt",value:{name:"Date",required:!1}}]}}],raw:"OpeningHour[]"},{name:"null"}],required:!1}}]}}],raw:"FooterSauna[]"},description:""}}};const H=`# FooterView\r
\r
Kort beskrivelse: Bunnseksjon med kontaktinfo og lenker.\r
\r
## Bruk\r
- Bruk som global footer på alle sider.\r
- Viser kontaktinformasjon og lenker til badstuer.\r
\r
## Ikke bruk\r
- Ikke bruk for lange tekster eller markedsføringsinnhold.\r
\r
## Retningslinjer for innhold\r
- Hold kontaktinfo oppdatert.\r
- Begrens antall lenker for oversiktlighet.\r
\r
## Props (kort)\r
- \`address\`: Adresse.\r
- \`email\`: Kontakt e-post.\r
- \`phone\`: Telefonnummer.\r
- \`instagram\`: URL til Instagram.\r
- \`facebook\`: URL til Facebook.\r
- \`saunas\`: Liste over aktive badstuer.\r
\r
## Eksempler\r
\`\`\`tsx\r
<FooterView address="Nedre Langgate 44" email="booking@sjobadet.com" phone="+47 401 55 365" saunas={[]} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Bruk tydelige lenketekster.\r
\r
## Vedlikehold/Notater\r
- Server-komponenten \`Footer\` henter data og sender til \`FooterView\`.\r
\r
## Gjør\r
- Hold kontaktinfo oppdatert.\r
- Bruk tydelige lenketekster.\r
\r
## Unngå\r
- Ikke legg inn lange tekster.\r
- Ikke skjul viktig kontaktinfo.\r
`,R={title:"Komponenter/Layout/Footer",component:p,tags:["autodocs"],parameters:{docs:{description:{component:H}}},argTypes:{address:{control:"text",description:"Adresse som vises i footer."},email:{control:"text",description:"Kontakt e-postadresse."},phone:{control:"text",description:"Telefonnummer."},instagram:{control:"text",description:"Instagram-lenke."},facebook:{control:"text",description:"Facebook-lenke."},saunas:{control:"object",description:"Liste over badstuer som vises i footer."}}},d={args:{address:"Nedre Langgate 44, 3126 Tønsberg",email:"booking@sjobadet.com",phone:"+47 401 55 365",instagram:"https://instagram.com",facebook:"https://facebook.com",saunas:[{id:"1",slug:"tonsberg-brygge",name:"Tønsberg Brygge",location:"Tønsberg",shortDescription:"Badstue ved brygga",capacityDropin:8,capacityPrivat:10,driftStatus:"open",flexibleHours:!1},{id:"2",slug:"hjemseng-brygge",name:"Hjemseng brygge",location:"Hjemseng",shortDescription:"Badstue med sjøutsikt",capacityDropin:6,capacityPrivat:8,driftStatus:"closed",stengeArsak:"Is på vannet"}]}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    address: 'Nedre Langgate 44, 3126 Tønsberg',
    email: 'booking@sjobadet.com',
    phone: '+47 401 55 365',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    saunas: [{
      id: '1',
      slug: 'tonsberg-brygge',
      name: 'Tønsberg Brygge',
      location: 'Tønsberg',
      shortDescription: 'Badstue ved brygga',
      capacityDropin: 8,
      capacityPrivat: 10,
      driftStatus: 'open',
      flexibleHours: false
    }, {
      id: '2',
      slug: 'hjemseng-brygge',
      name: 'Hjemseng brygge',
      location: 'Hjemseng',
      shortDescription: 'Badstue med sjøutsikt',
      capacityDropin: 6,
      capacityPrivat: 8,
      driftStatus: 'closed',
      stengeArsak: 'Is på vannet'
    }]
  }
}`,...d.parameters?.docs?.source}}};const C=["Standard"];export{d as Standard,C as __namedExportsOrder,R as default};
