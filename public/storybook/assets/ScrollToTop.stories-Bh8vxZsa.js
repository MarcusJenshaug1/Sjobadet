import{S as e,j as n}from"./iframe-ChuUt2dm.js";import"./preload-helper-D1UD9lgW.js";const o=`# ScrollToTop\r
\r
Kort beskrivelse: Skroller til toppen ved rutenavigasjon.\r
\r
## Bruk\r
- Bruk globalt i appen når navigasjon skal starte øverst.\r
\r
## Ikke bruk\r
- Ikke bruk på sider der scroll-posisjon skal bevares.\r
\r
## Retningslinjer for innhold\r
- Ingen visuelt innhold.\r
\r
## Props (kort)\r
- Ingen props.\r
\r
## Eksempler\r
\`\`\`tsx\r
<ScrollToTop />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Påvirker ikke fokus eller aria.\r
\r
## Vedlikehold/Notater\r
- Kaller \`window.scrollTo\` ved ruteendring.\r
\r
## Gjør\r
- Bruk der navigasjon skal starte på toppen.\r
- Test på mobil og desktop.\r
\r
## Unngå\r
- Ikke bruk på sider som skal beholde scroll-posisjon.\r
- Ikke bruk sammen med egne scroll-håndterere.\r
`,l={title:"Komponenter/Layout/ScrollToTop",component:e,tags:["autodocs"],parameters:{docs:{description:{component:o}},controls:{disable:!0}}},r={render:()=>n.jsxs("div",{children:[n.jsx(e,{}),n.jsx("p",{children:"Denne komponenten har ingen visuell representasjon."})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div>\r
            <ScrollToTop />\r
            <p>Denne komponenten har ingen visuell representasjon.</p>\r
        </div>
}`,...r.parameters?.docs?.source}}};const a=["Standard"];export{r as Standard,a as __namedExportsOrder,l as default};
