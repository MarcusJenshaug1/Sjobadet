import{j as e}from"./iframe-DpagJM2z.js";import{T as r}from"./Textarea--BcGKrhc.js";import"./preload-helper-D1UD9lgW.js";const d=`# Textarea\r
\r
Kort beskrivelse: Flerlinjet tekstfelt for meldinger og beskrivelser.\r
\r
## Bruk\r
- Bruk for lengre fritekst som kommentarer og beskrivelser.\r
\r
## Ikke bruk\r
- Ikke bruk for korte, enkle input (bruk \`Input\`).\r
\r
## Retningslinjer for innhold\r
- Gi tydelig ledetekst og forventet lengde.\r
- Bruk \`rows\` for å gi riktig høyde.\r
\r
## Props (kort)\r
- \`size\`: Størrelse (\`sm\`, \`md\`, \`lg\`).\r
- \`rows\`: Antall synlige linjer.\r
- \`placeholder\`: Hjelpetekst når feltet er tomt.\r
- \`disabled\`: Deaktiverer feltet.\r
- \`aria-invalid\`: Marker feiltilstand.\r
\r
## Eksempler\r
\`\`\`tsx\r
<label htmlFor="message">Melding</label>\r
<Textarea id="message" rows={4} placeholder="Skriv en kort melding" />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Koble \`label\` og \`textarea\` med \`htmlFor\`/\`id\`.\r
- Bruk \`aria-describedby\` for hjelpetekst og feil.\r
- Bruk \`aria-invalid\` ved valideringsfeil.\r
\r
## Vedlikehold/Notater\r
- Størrelse styres via \`size\` og CSS-variabler.\r
\r
## Gjør\r
- Oppgi forventet lengde eller innholdstype.\r
- Bruk label og feilmeldinger tett på feltet.\r
\r
## Unngå\r
- Ikke bruk til korte felt.\r
- Ikke skjul feilmeldinger kun med farge.\r
`,{expect:o,userEvent:m,within:c}=__STORYBOOK_MODULE_TEST__,h={title:"Komponenter/Skjema/Textarea",component:r,tags:["autodocs"],parameters:{docs:{description:{component:d}}},argTypes:{size:{control:"select",options:["sm","md","lg"],description:"Størrelse på feltets padding og tekst."},rows:{control:"number",description:"Antall synlige linjer."},placeholder:{control:"text",description:"Hjelpetekst når feltet er tomt."},disabled:{control:"boolean",description:"Deaktiverer feltet."},onChange:{action:"changed",description:"Kalles ved endring av verdi."}},args:{size:"md",rows:4,placeholder:"Skriv en melding…"}},a={play:async({canvasElement:s})=>{const i=c(s).getByPlaceholderText("Skriv en melding…");await m.type(i,"Hei"),await o(i).toHaveValue("Hei")}},t={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.75rem",maxWidth:420},children:[e.jsx(r,{size:"sm",rows:3,placeholder:"Liten"}),e.jsx(r,{size:"md",rows:4,placeholder:"Standard"}),e.jsx(r,{size:"lg",rows:5,placeholder:"Stor"})]})},l={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.75rem",maxWidth:420},children:[e.jsx(r,{rows:3,placeholder:"Normal"}),e.jsx(r,{rows:3,placeholder:"Deaktivert",disabled:!0}),e.jsx(r,{rows:3,readOnly:!0,value:"Låst verdi"})]})},n={render:()=>e.jsxs("div",{style:{display:"grid",gap:"0.5rem",maxWidth:420},children:[e.jsx("label",{htmlFor:"melding-feil",children:"Melding"}),e.jsx(r,{id:"melding-feil",rows:4,placeholder:"Skriv en kort melding","aria-invalid":"true","aria-describedby":"melding-feil-hjelp"}),e.jsx("small",{id:"melding-feil-hjelp",style:{color:"#b42318"},children:"Meldingen må være minst 20 tegn."})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText('Skriv en melding…');
    await userEvent.type(textarea, 'Hei');
    await expect(textarea).toHaveValue('Hei');
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '0.75rem',
    maxWidth: 420
  }}>\r
            <Textarea size="sm" rows={3} placeholder="Liten" />\r
            <Textarea size="md" rows={4} placeholder="Standard" />\r
            <Textarea size="lg" rows={5} placeholder="Stor" />\r
        </div>
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '0.75rem',
    maxWidth: 420
  }}>\r
            <Textarea rows={3} placeholder="Normal" />\r
            <Textarea rows={3} placeholder="Deaktivert" disabled />\r
            <Textarea rows={3} readOnly value="Låst verdi" />\r
        </div>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '0.5rem',
    maxWidth: 420
  }}>\r
            <label htmlFor="melding-feil">Melding</label>\r
            <Textarea id="melding-feil" rows={4} placeholder="Skriv en kort melding" aria-invalid="true" aria-describedby="melding-feil-hjelp" />\r
            <small id="melding-feil-hjelp" style={{
      color: '#b42318'
    }}>\r
                Meldingen må være minst 20 tegn.\r
            </small>\r
        </div>
}`,...n.parameters?.docs?.source}}};const x=["Standard","Størrelser","Tilstander","Feiltilstand"];export{n as Feiltilstand,a as Standard,t as Størrelser,l as Tilstander,x as __namedExportsOrder,h as default};
