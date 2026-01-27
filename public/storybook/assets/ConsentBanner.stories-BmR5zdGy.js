import{j as a,a as s}from"./iframe-BeGkvnHr.js";import{ConsentBanner as o}from"./ConsentBanner-B-8UM-tP.js";import"./preload-helper-D1UD9lgW.js";const m=`# ConsentBanner\r
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
`,{expect:i,userEvent:d,within:l}=__STORYBOOK_MODULE_TEST__,u=()=>{typeof document>"u"||(document.cookie="sjobadet_consent=; path=/; max-age=0; samesite=lax")},c=()=>{const[n,e]=s.useState(!1);return s.useEffect(()=>{u(),e(!0)},[]),n?a.jsx(o,{}):null},y={title:"Komponenter/Analyse/ConsentBanner",component:o,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:m}}}},r={render:()=>a.jsx(c,{}),play:async({canvasElement:n})=>{const k=await l(n).findByRole("button",{name:"Tilpass"});await i(k).toBeInTheDocument()}},t={render:()=>a.jsx(c,{}),play:async({canvasElement:n})=>{const e=l(n);await d.click(await e.findByRole("button",{name:"Tilpass"})),await i(e.getByRole("heading",{name:"Innstillinger for infokapsler"})).toBeInTheDocument()}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <ConsentBannerWithReset />,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', {
      name: 'Tilpass'
    });
    await expect(button).toBeInTheDocument();
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <ConsentBannerWithReset />,
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
}`,...t.parameters?.docs?.source}}};const B=["Standard","Dialog"];export{t as Dialog,r as Standard,B as __namedExportsOrder,y as default};
