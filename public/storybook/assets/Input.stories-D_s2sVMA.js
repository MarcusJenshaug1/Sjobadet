import{j as e}from"./iframe-ChuUt2dm.js";import{I as r}from"./Input-cg_8lEBO.js";import"./preload-helper-D1UD9lgW.js";const o='# Input\r\n\r\nKort beskrivelse: Enkeltlinjet tekstfelt for fritekst.\r\n\r\n## Bruk\r\n- Bruk for korte tekstinnslag som navn, e-post eller søk.\r\n- Bruk `type` for e-post, tall og passord der det passer.\r\n\r\n## Ikke bruk\r\n- Ikke bruk for lengre tekster (bruk `Textarea`).\r\n- Ikke bruk uten tilknyttet etikett (label).\r\n\r\n## Retningslinjer for innhold\r\n- Bruk presise plassholdertekster som beskriver forventet format.\r\n- Vis feilmeldinger i nærheten av feltet.\r\n\r\n## Props (kort)\r\n- `size`: Størrelse (`sm`, `md`, `lg`).\r\n- `type`: HTML-inputtype (`text`, `email`, `number`, osv.).\r\n- `placeholder`: Hjelpetekst når feltet er tomt.\r\n- `disabled`: Deaktiverer feltet.\r\n- `aria-invalid`: Marker feiltilstand.\r\n\r\n## Eksempler\r\n```tsx\r\n<label htmlFor="email">E-post</label>\r\n<Input id="email" type="email" placeholder="navn@domene.no" />\r\n```\r\n\r\n## Tilgjengelighet\r\n- Koble `label` og `input` med `htmlFor`/`id`.\r\n- Bruk `aria-describedby` for hjelpetekst og feil.\r\n- Bruk `aria-invalid` ved valideringsfeil.\r\n\r\n## Vedlikehold/Notater\r\n- Feltet er visuell komponent; validering håndteres utenfor.\r\n\r\n## Gjør\r\n- Gi alltid en synlig label.\r\n- Bruk `aria-describedby` for hjelpetekst og feil.\r\n\r\n## Unngå\r\n- Ikke bruk for lange tekster.\r\n- Ikke bruk uten type/format der det er relevant.\r\n',{expect:d,userEvent:p,within:c}=__STORYBOOK_MODULE_TEST__,g={title:"Komponenter/Skjema/Input",component:r,tags:["autodocs"],parameters:{docs:{description:{component:o}}},argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Størrelse på feltets padding og tekst."},type:{control:"text",description:"HTML-inputtype, f.eks. `text` eller `email`."},placeholder:{control:"text",description:"Hjelpetekst når feltet er tomt."},disabled:{control:"boolean",description:"Deaktiverer feltet."},required:{control:"boolean",description:"Markerer feltet som påkrevd i skjema."},onChange:{action:"changed",description:"Kalles ved endring av verdi."}},args:{size:"md",placeholder:"Skriv her…"}},t={play:async({canvasElement:i})=>{const s=c(i).getByPlaceholderText("Skriv her…");await p.type(s,"Test"),await d(s).toHaveValue("Test")}},a={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.75rem",maxWidth:360},children:[e.jsx(r,{size:"sm",placeholder:"Liten"}),e.jsx(r,{size:"md",placeholder:"Standard"}),e.jsx(r,{size:"lg",placeholder:"Stor"})]})},l={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.75rem",maxWidth:360},children:[e.jsx(r,{placeholder:"Normal"}),e.jsx(r,{placeholder:"Deaktivert",disabled:!0}),e.jsx(r,{placeholder:"Kun lesing",readOnly:!0,value:"Låst verdi"})]})},n={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.5rem",maxWidth:360},children:[e.jsx("label",{htmlFor:"email-feil",children:"E-post"}),e.jsx(r,{id:"email-feil",type:"email",placeholder:"navn@domene.no","aria-invalid":"true","aria-describedby":"email-feil-hjelp"}),e.jsx("small",{id:"email-feil-hjelp",style:{color:"#b42318"},children:"Ugyldig e-postadresse."})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Skriv her…');
    await userEvent.type(input, 'Test');
    await expect(input).toHaveValue('Test');
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '0.75rem',
    maxWidth: 360
  }}>\r
            <Input size="sm" placeholder="Liten" />\r
            <Input size="md" placeholder="Standard" />\r
            <Input size="lg" placeholder="Stor" />\r
        </div>
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '0.75rem',
    maxWidth: 360
  }}>\r
            <Input placeholder="Normal" />\r
            <Input placeholder="Deaktivert" disabled />\r
            <Input placeholder="Kun lesing" readOnly value="Låst verdi" />\r
        </div>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '0.5rem',
    maxWidth: 360
  }}>\r
            <label htmlFor="email-feil">E-post</label>\r
            <Input id="email-feil" type="email" placeholder="navn@domene.no" aria-invalid="true" aria-describedby="email-feil-hjelp" />\r
            <small id="email-feil-hjelp" style={{
      color: '#b42318'
    }}>\r
                Ugyldig e-postadresse.\r
            </small>\r
        </div>
}`,...n.parameters?.docs?.source}}};const v=["Standard","Størrelser","Tilstander","Feiltilstand"];export{n as Feiltilstand,t as Standard,a as Størrelser,l as Tilstander,v as __namedExportsOrder,g as default};
