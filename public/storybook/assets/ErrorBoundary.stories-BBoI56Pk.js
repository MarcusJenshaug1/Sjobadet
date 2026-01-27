import{E as o,j as r}from"./iframe-DpagJM2z.js";import"./preload-helper-D1UD9lgW.js";const d=`# ErrorBoundary\r
\r
Kort beskrivelse: Fanger runtime-feil og viser fallback i UI.\r
\r
## Bruk\r
- Bruk rundt komponenter som kan feile.\r
\r
## Ikke bruk\r
- Ikke bruk som generell try/catch for alle sider uten å vurdere behov.\r
\r
## Retningslinjer for innhold\r
- Fallback bør være kort og gi neste steg.\r
\r
## Props (kort)\r
- \`children\`: Komponenttreet som skal beskyttes.\r
- \`fallback\`: Valgfri funksjon som returnerer custom UI.\r
\r
## Eksempler\r
\`\`\`tsx\r
<ErrorBoundary>\r
  <PotensieltUstabilKomponent />\r
</ErrorBoundary>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Fallback har \`role="alert"\` og tydelig tekst.\r
\r
## Vedlikehold/Notater\r
- Logger feil til konsoll i \`componentDidCatch\`.\r
\r
## Gjør\r
- Gi brukeren en tydelig next-step.\r
- Bruk fallback for kritiske områder.\r
\r
## Unngå\r
- Ikke skjul feil uten beskjed.\r
- Ikke bruk for kontrollflyt.\r
`,c={title:"Komponenter/Layout/ErrorBoundary",component:o,tags:["autodocs"],parameters:{docs:{description:{component:d}}},argTypes:{fallback:{control:!1,description:"Egendefinert fallback-visning."}}},t=()=>{throw new Error("Simulert feil")},e={render:()=>r.jsx(o,{children:r.jsx(t,{})})},n={render:()=>r.jsx(o,{fallback:(a,s)=>r.jsxs("div",{style:{padding:"1rem",borderRadius:"0.5rem",background:"#fff7ed",border:"1px solid #fed7aa"},children:[r.jsx("strong",{children:"Feil: "}),a.message,r.jsx("div",{style:{marginTop:"0.75rem"},children:r.jsx("button",{onClick:s,style:{padding:"0.5rem 0.75rem"},children:"Prøv igjen"})})]}),children:r.jsx(t,{})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <ErrorBoundary>\r
            <Broken />\r
        </ErrorBoundary>
}`,...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <ErrorBoundary fallback={(error, reset) => <div style={{
    padding: '1rem',
    borderRadius: '0.5rem',
    background: '#fff7ed',
    border: '1px solid #fed7aa'
  }}>\r
                    <strong>Feil: </strong>{error.message}\r
                    <div style={{
      marginTop: '0.75rem'
    }}>\r
                        <button onClick={reset} style={{
        padding: '0.5rem 0.75rem'
      }}>Prøv igjen</button>\r
                    </div>\r
                </div>}>\r
            <Broken />\r
        </ErrorBoundary>
}`,...n.parameters?.docs?.source}}};const k=["Standard","EgendefinertFallback"];export{n as EgendefinertFallback,e as Standard,k as __namedExportsOrder,c as default};
