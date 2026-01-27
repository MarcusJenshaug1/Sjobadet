import{a as b,j as e,t as v}from"./iframe-BeGkvnHr.js";import{B as y}from"./BookingModal-BbSyfe_L.js";import{E as g}from"./external-link-mrAcOcOW.js";import"./preload-helper-D1UD9lgW.js";import"./index-Dn476rUD.js";const j="_sectionTitle_1mg8g_215",x="_bookingOptions_1mg8g_229",_="_bookingCardsGrid_1mg8g_237",h="_bookingOptionCard_1mg8g_261",N="_cardHeader_1mg8g_303",f="_optionTitle_1mg8g_311",C="_optionDesc_1mg8g_327",T="_cardFooter_1mg8g_339",D="_dropinCard_1mg8g_371",O="_privateCard_1mg8g_401",r={sectionTitle:j,bookingOptions:x,bookingCardsGrid:_,bookingOptionCard:h,cardHeader:N,optionTitle:f,optionDesc:C,cardFooter:T,dropinCard:D,privateCard:O};function k({saunaId:m,saunaName:a,capacityDropin:t,capacityPrivat:s,bookingUrlDropin:d,bookingUrlPrivat:l}){const[c,i]=b.useState(null),p=u=>{v("booking_click",{type:u,saunaId:m,saunaName:a})};return e.jsxs("div",{className:r.bookingOptions,children:[e.jsx("h2",{className:r.sectionTitle,children:"Velg type booking"}),e.jsxs("div",{className:r.bookingCardsGrid,children:[t>0&&(d?e.jsxs("button",{type:"button",className:`${r.bookingOptionCard} ${r.dropinCard}`,onClick:()=>{p("drop-in"),i(d)},children:[e.jsxs("div",{className:r.cardHeader,children:[e.jsx("div",{className:r.optionTitle,children:"Enkeltbillett (drop-in)"}),e.jsx("div",{className:r.optionDesc,children:"Kom alene eller med venner i fellesbadstue"})]}),e.jsxs("div",{className:r.cardFooter,children:[e.jsxs("div",{style:{fontSize:"0.9rem",opacity:.9},children:["Kapasitet: ",t," pers."]}),e.jsx(g,{size:20})]})]}):e.jsx("div",{className:`${r.bookingOptionCard} ${r.dropinCard}`,style:{opacity:.7,cursor:"not-allowed"},children:e.jsxs("div",{className:r.cardHeader,children:[e.jsx("div",{className:r.optionTitle,children:"Enkeltbillett (drop-in)"}),e.jsx("div",{className:r.optionDesc,children:"Ikke tilgjengelig for øyeblikket"})]})})),s>0&&(l?e.jsxs("button",{type:"button",className:`${r.bookingOptionCard} ${r.privateCard}`,onClick:()=>{p("private"),i(l)},children:[e.jsxs("div",{className:r.cardHeader,children:[e.jsx("div",{className:r.optionTitle,children:"Privat booking"}),e.jsx("div",{className:r.optionDesc,children:"Book hele badstuen for ditt selskap"})]}),e.jsxs("div",{className:r.cardFooter,children:[e.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:["Kapasitet: ",s," pers."]}),e.jsx(g,{size:20,color:"#719898"})]})]}):e.jsx("div",{className:`${r.bookingOptionCard} ${r.privateCard}`,style:{opacity:.7,cursor:"not-allowed"},children:e.jsxs("div",{className:r.cardHeader,children:[e.jsx("div",{className:r.optionTitle,children:"Privat booking"}),e.jsx("div",{className:r.optionDesc,children:"Ikke tilgjengelig for øyeblikket"})]})}))]}),e.jsx(y,{open:!!c,url:c||"",onClose:()=>i(null),title:`${a} booking`})]})}k.__docgenInfo={description:"",methods:[],displayName:"SaunaBookingOptions",props:{saunaId:{required:!0,tsType:{name:"string"},description:""},saunaName:{required:!0,tsType:{name:"string"},description:""},capacityDropin:{required:!0,tsType:{name:"number"},description:""},capacityPrivat:{required:!0,tsType:{name:"number"},description:""},bookingUrlDropin:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},bookingUrlPrivat:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""}}};const B=`# SaunaBookingOptions\r
\r
Kort beskrivelse: Kort med valg for drop-in og privat booking.\r
\r
## Bruk\r
- Bruk på badstuesider for å starte booking.\r
\r
## Ikke bruk\r
- Ikke bruk hvis booking-URL-er mangler og kapasitet er 0.\r
\r
## Retningslinjer for innhold\r
- Hold tekstene korte og tydelige.\r
\r
## Props (kort)\r
- \`saunaId\`: ID for badstuen.\r
- \`saunaName\`: Navn på badstue.\r
- \`capacityDropin\`: Kapasitet for drop-in.\r
- \`capacityPrivat\`: Kapasitet for privat booking.\r
- \`bookingUrlDropin\`: URL for drop-in booking.\r
- \`bookingUrlPrivat\`: URL for privat booking.\r
\r
## Eksempler\r
\`\`\`tsx\r
<SaunaBookingOptions saunaId="1" saunaName="Tønsberg" capacityDropin={8} capacityPrivat={10} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Kortene er knapper med tydelig tekst.\r
\r
## Vedlikehold/Notater\r
- Bruker \`BookingModal\` for å vise booking-iframe.\r
\r
## Gjør\r
- Gi tydelige beskrivelser av booking-typer.\r
- Vis kapasitet der det er relevant.\r
\r
## Unngå\r
- Ikke skjul at en bookingtype er utilgjengelig.\r
- Ikke bruk uklare label-tekster.\r
`,E={title:"Komponenter/Badstue/SaunaBookingOptions",component:k,tags:["autodocs"],parameters:{docs:{description:{component:B}}},argTypes:{saunaId:{control:"text",description:"ID for badstuen."},saunaName:{control:"text",description:"Navn på badstuen."},capacityDropin:{control:"number",description:"Kapasitet for drop-in."},capacityPrivat:{control:"number",description:"Kapasitet for privat booking."}},args:{saunaId:"1",saunaName:"Tønsberg Brygge",capacityDropin:8,capacityPrivat:10,bookingUrlDropin:"about:blank",bookingUrlPrivat:"about:blank"}},n={},o={args:{capacityDropin:0,bookingUrlDropin:null}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"{}",...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    capacityDropin: 0,
    bookingUrlDropin: null
  }
}`,...o.parameters?.docs?.source}}};const $=["Standard","KunPrivat"];export{o as KunPrivat,n as Standard,$ as __namedExportsOrder,E as default};
