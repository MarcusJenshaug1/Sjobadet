import{c as y,a as u,j as e,B as g}from"./iframe-BeGkvnHr.js";import{C as p}from"./Card-hqAF1pWI.js";import{I as m}from"./Input-CJf-07ch.js";import{T as h}from"./Textarea-CkIv_ZZA.js";import"./preload-helper-D1UD9lgW.js";const B=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],f=y("circle-check-big",B);const j=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],E=y("send",j),w="_form_i5roo_1",_="_formGroup_i5roo_13",S="_label_i5roo_25",T="_successMessage_i5roo_37",N="_successButton_i5roo_53",t={form:w,formGroup:_,label:S,successMessage:T,successButton:N};function k(){const[s,n]=u.useState("idle"),[r,d]=u.useState({name:"",email:"",subject:"",message:""}),x=async o=>{o.preventDefault(),n("submitting"),setTimeout(()=>{n("success"),d({name:"",email:"",subject:"",message:""})},1500)},l=o=>{d({...r,[o.target.id]:o.target.value})};return s==="success"?e.jsxs(p,{className:t.successMessage,padding:"lg",children:[e.jsx(f,{size:40,style:{marginBottom:"1rem"}}),e.jsx("h3",{children:"Melding sendt!"}),e.jsx("p",{children:"Takk for at du kontakter oss. Vi svarer deg så fort vi kan."}),e.jsx(g,{onClick:()=>n("idle"),className:t.successButton,size:"md",children:"Send ny melding"})]}):e.jsxs(p,{as:"form",className:t.form,onSubmit:x,padding:"lg",children:[e.jsxs("div",{className:t.formGroup,children:[e.jsx("label",{htmlFor:"name",className:t.label,children:"Navn"}),e.jsx(m,{type:"text",id:"name",required:!0,placeholder:"Ditt fulle navn",value:r.name,onChange:l})]}),e.jsxs("div",{className:t.formGroup,children:[e.jsx("label",{htmlFor:"email",className:t.label,children:"E-post"}),e.jsx(m,{type:"email",id:"email",required:!0,placeholder:"din@epost.no",value:r.email,onChange:l})]}),e.jsxs("div",{className:t.formGroup,children:[e.jsx("label",{htmlFor:"subject",className:t.label,children:"Emne"}),e.jsx(m,{type:"text",id:"subject",required:!0,placeholder:"Hva gjelder det?",value:r.subject,onChange:l})]}),e.jsxs("div",{className:t.formGroup,children:[e.jsx("label",{htmlFor:"message",className:t.label,children:"Melding"}),e.jsx(h,{id:"message",required:!0,placeholder:"Skriv din melding her...",value:r.message,onChange:l})]}),e.jsx(g,{type:"submit",disabled:s==="submitting",size:"lg",children:s==="submitting"?"Sender...":e.jsxs(e.Fragment,{children:["Send melding",e.jsx(E,{size:18})]})})]})}k.__docgenInfo={description:"",methods:[],displayName:"ContactForm"};const L=`# ContactForm\r
\r
Kort beskrivelse: Skjema for å sende henvendelser til kundeservice.\r
\r
## Bruk\r
- Bruk når brukeren skal sende en fri tekstmelding.\r
- Bruk i offentlige infosider eller supportsider.\r
\r
## Ikke bruk\r
- Ikke bruk til innlogging eller registrering.\r
- Ikke bruk når du trenger avansert validering eller vedlegg (lag egen løsning).\r
\r
## Retningslinjer for innhold\r
- Hold feltene korte og relevante.\r
- Bruk tydelige etiketter og korte plassholdertekster.\r
\r
## Props (kort)\r
- Ingen props. Komponenten håndterer egen intern tilstand.\r
\r
## Eksempler\r
\`\`\`tsx\r
<ContactForm />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Etiketter er koblet til feltene via \`htmlFor\`/\`id\`.\r
- Knappen er alltid tekstlig beskrevet.\r
\r
## Vedlikehold/Notater\r
- API-kall er simulert i komponenten. Bytt ut med faktisk integrasjon ved behov.\r
\r
## Gjør\r
- Bruk klare feltetiketter.\r
- Hold skjemaet kort.\r
\r
## Unngå\r
- Ikke legg inn for mange felt.\r
- Ikke bruk uklare placeholder-tekster.\r
`,{expect:v,userEvent:a,within:b}=__STORYBOOK_MODULE_TEST__,R={title:"Komponenter/Skjema/ContactForm",component:k,tags:["autodocs"],parameters:{docs:{description:{component:L}}}},i={play:async({canvasElement:s})=>{const n=b(s);await a.type(n.getByLabelText("Navn"),"Ola Nordmann"),await a.type(n.getByLabelText("E-post"),"ola@example.com"),await a.type(n.getByLabelText("Emne"),"Spørsmål"),await a.type(n.getByLabelText("Melding"),"Hei!"),await v(n.getByRole("button",{name:/Send melding/i})).toBeEnabled()}},c={play:async({canvasElement:s})=>{const n=b(s);await a.type(n.getByLabelText("Navn"),"Ola Nordmann"),await a.type(n.getByLabelText("E-post"),"ola@example.com"),await a.type(n.getByLabelText("Emne"),"Spørsmål"),await a.type(n.getByLabelText("Melding"),"Hei!"),await a.click(n.getByRole("button",{name:/Send melding/i})),await new Promise(r=>setTimeout(r,1600)),await v(n.getByRole("button",{name:"Send ny melding"})).toBeInTheDocument()}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Navn'), 'Ola Nordmann');
    await userEvent.type(canvas.getByLabelText('E-post'), 'ola@example.com');
    await userEvent.type(canvas.getByLabelText('Emne'), 'Spørsmål');
    await userEvent.type(canvas.getByLabelText('Melding'), 'Hei!');
    await expect(canvas.getByRole('button', {
      name: /Send melding/i
    })).toBeEnabled();
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Navn'), 'Ola Nordmann');
    await userEvent.type(canvas.getByLabelText('E-post'), 'ola@example.com');
    await userEvent.type(canvas.getByLabelText('Emne'), 'Spørsmål');
    await userEvent.type(canvas.getByLabelText('Melding'), 'Hei!');
    await userEvent.click(canvas.getByRole('button', {
      name: /Send melding/i
    }));
    await new Promise(resolve => setTimeout(resolve, 1600));
    await expect(canvas.getByRole('button', {
      name: 'Send ny melding'
    })).toBeInTheDocument();
  }
}`,...c.parameters?.docs?.source}}};const G=["Standard","EtterInnsending"];export{c as EtterInnsending,i as Standard,G as __namedExportsOrder,R as default};
