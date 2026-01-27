import{ConsentBanner as i}from"./ConsentBanner-CMj8GK7H.js";import"./jsx-runtime-C8V8hRFh.js";import"./iframe-2gXNPU8n.js";import"./preload-helper-D1UD9lgW.js";import"./link-mazOOwm8.js";import"./use-merged-ref-B51OLTfl.js";import"./Button-CV0DL16h.js";import"./clsx-B-dksMZM.js";import"./tracking-CB1Ze4Aw.js";import"./createLucideIcon-DP3iA5K4.js";const l=`# ConsentBanner\r
\r
Kort beskrivelse: Banner og dialog for samtykke til infokapsler.\r
\r
## Bruk\r
- Bruk for å innhente samtykke til analyse/markedsføring.\r
- Viser banner til samtykke er valgt.\r
\r
## Ikke bruk\r
- Ikke bruk i admin-områder.\r
\r
## Retningslinjer for innhold\r
- Forklar kort hvorfor samtykke trengs.\r
- Bruk klar og enkel terminologi.\r
\r
## Props (kort)\r
- Ingen props. Tilstand håndteres internt.\r
\r
## Eksempler\r
\`\`\`tsx\r
<ConsentBanner />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Knapper har tydelig tekst.\r
- Dialog kan lukkes ved klikk utenfor.\r
\r
## Vedlikehold/Notater\r
- Bruker \`getConsent\` og \`setConsent\` fra tracking-modulen.\r
\r
## Gjør\r
- Forklar tydelig hvorfor samtykke trengs.\r
- Gi enkle valg med lik prioritet.\r
\r
## Unngå\r
- Ikke skjul avslag bak flere klikk.\r
- Ikke bruk uklare begreper.\r
`,{expect:t,userEvent:c,within:o}=__STORYBOOK_MODULE_TEST__,h={title:"Komponenter/Analyse/ConsentBanner",component:i,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:l}}}},n={play:async({canvasElement:r})=>{const s=await o(r).findByRole("button",{name:"Tilpass"});await t(s).toBeInTheDocument()}},e={play:async({canvasElement:r})=>{const a=o(r);await c.click(await a.findByRole("button",{name:"Tilpass"})),await t(a.getByRole("heading",{name:"Innstillinger for infokapsler"})).toBeInTheDocument()}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', {
      name: 'Tilpass'
    });
    await expect(button).toBeInTheDocument();
  }
}`,...n.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', {
      name: 'Tilpass'
    }));
    await expect(canvas.getByRole('heading', {
      name: 'Innstillinger for infokapsler'
    })).toBeInTheDocument();
  }
}`,...e.parameters?.docs?.source}}};const b=["Standard","Dialog"];export{e as Dialog,n as Standard,b as __namedExportsOrder,h as default};
