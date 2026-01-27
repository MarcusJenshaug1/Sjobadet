import{j as r}from"./jsx-runtime-DDl-KI2x.js";import{b}from"./iframe-C_JdCeVj.js";import{t as v}from"./tracking-CB1Ze4Aw.js";import{B as y}from"./BookingModal-f4v_DzpU.js";import{E as g}from"./external-link-CM5_4Tjb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Du2c9-pM.js";import"./createLucideIcon-DMVqFKYz.js";const j="_sectionTitle_1mg8g_215",x="_bookingOptions_1mg8g_229",_="_bookingCardsGrid_1mg8g_237",h="_bookingOptionCard_1mg8g_261",f="_cardHeader_1mg8g_303",N="_optionTitle_1mg8g_311",C="_optionDesc_1mg8g_327",T="_cardFooter_1mg8g_339",D="_dropinCard_1mg8g_371",O="_privateCard_1mg8g_401",e={sectionTitle:j,bookingOptions:x,bookingCardsGrid:_,bookingOptionCard:h,cardHeader:f,optionTitle:N,optionDesc:C,cardFooter:T,dropinCard:D,privateCard:O};function k({saunaId:m,saunaName:t,capacityDropin:a,capacityPrivat:s,bookingUrlDropin:d,bookingUrlPrivat:l}){const[c,i]=b.useState(null),p=u=>{v("booking_click",{type:u,saunaId:m,saunaName:t})};return r.jsxs("div",{className:e.bookingOptions,children:[r.jsx("h2",{className:e.sectionTitle,children:"Velg type booking"}),r.jsxs("div",{className:e.bookingCardsGrid,children:[a>0&&(d?r.jsxs("button",{type:"button",className:`${e.bookingOptionCard} ${e.dropinCard}`,onClick:()=>{p("drop-in"),i(d)},children:[r.jsxs("div",{className:e.cardHeader,children:[r.jsx("div",{className:e.optionTitle,children:"Enkeltbillett (drop-in)"}),r.jsx("div",{className:e.optionDesc,children:"Kom alene eller med venner i fellesbadstue"})]}),r.jsxs("div",{className:e.cardFooter,children:[r.jsxs("div",{style:{fontSize:"0.9rem",opacity:.9},children:["Kapasitet: ",a," pers."]}),r.jsx(g,{size:20})]})]}):r.jsx("div",{className:`${e.bookingOptionCard} ${e.dropinCard}`,style:{opacity:.7,cursor:"not-allowed"},children:r.jsxs("div",{className:e.cardHeader,children:[r.jsx("div",{className:e.optionTitle,children:"Enkeltbillett (drop-in)"}),r.jsx("div",{className:e.optionDesc,children:"Ikke tilgjengelig for øyeblikket"})]})})),s>0&&(l?r.jsxs("button",{type:"button",className:`${e.bookingOptionCard} ${e.privateCard}`,onClick:()=>{p("private"),i(l)},children:[r.jsxs("div",{className:e.cardHeader,children:[r.jsx("div",{className:e.optionTitle,children:"Privat booking"}),r.jsx("div",{className:e.optionDesc,children:"Book hele badstuen for ditt selskap"})]}),r.jsxs("div",{className:e.cardFooter,children:[r.jsxs("div",{style:{fontSize:"0.9rem",color:"#64748b"},children:["Kapasitet: ",s," pers."]}),r.jsx(g,{size:20,color:"#719898"})]})]}):r.jsx("div",{className:`${e.bookingOptionCard} ${e.privateCard}`,style:{opacity:.7,cursor:"not-allowed"},children:r.jsxs("div",{className:e.cardHeader,children:[r.jsx("div",{className:e.optionTitle,children:"Privat booking"}),r.jsx("div",{className:e.optionDesc,children:"Ikke tilgjengelig for øyeblikket"})]})}))]}),r.jsx(y,{open:!!c,url:c||"",onClose:()=>i(null),title:`${t} booking`})]})}k.__docgenInfo={description:"",methods:[],displayName:"SaunaBookingOptions",props:{saunaId:{required:!0,tsType:{name:"string"},description:""},saunaName:{required:!0,tsType:{name:"string"},description:""},capacityDropin:{required:!0,tsType:{name:"number"},description:""},capacityPrivat:{required:!0,tsType:{name:"number"},description:""},bookingUrlDropin:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""},bookingUrlPrivat:{required:!1,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:""}}};const B=`# SaunaBookingOptions\r
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
`,q={title:"Komponenter/Badstue/SaunaBookingOptions",component:k,tags:["autodocs"],parameters:{docs:{description:{component:B}}},argTypes:{saunaId:{control:"text",description:"ID for badstuen."},saunaName:{control:"text",description:"Navn på badstuen."},capacityDropin:{control:"number",description:"Kapasitet for drop-in."},capacityPrivat:{control:"number",description:"Kapasitet for privat booking."}},args:{saunaId:"1",saunaName:"Tønsberg Brygge",capacityDropin:8,capacityPrivat:10,bookingUrlDropin:"about:blank",bookingUrlPrivat:"about:blank"}},n={},o={args:{capacityDropin:0,bookingUrlDropin:null}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"{}",...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    capacityDropin: 0,
    bookingUrlDropin: null
  }
}`,...o.parameters?.docs?.source}}};const G=["Standard","KunPrivat"];export{o as KunPrivat,n as Standard,G as __namedExportsOrder,q as default};
