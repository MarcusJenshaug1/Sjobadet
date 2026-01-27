import{k as n,j as r}from"./iframe-BeGkvnHr.js";import"./preload-helper-D1UD9lgW.js";const t=`# SmartPrefetcher\r
\r
Kort beskrivelse: Prefetcher ruter når nettverket tillater det.\r
\r
## Bruk\r
- Bruk globalt i appen for raskere navigasjon.\r
\r
## Ikke bruk\r
- Ikke bruk på enheter med begrenset data der det er uønsket.\r
\r
## Retningslinjer for innhold\r
- Ingen visuelt innhold.\r
\r
## Props (kort)\r
- Ingen props.\r
\r
## Eksempler\r
\`\`\`tsx\r
<SmartPrefetcher />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Ingen direkte effekt på tilgjengelighet.\r
\r
## Vedlikehold/Notater\r
- Bruker Speculation Rules API når tilgjengelig.\r
\r
## Gjør\r
- Bruk på offentlige sider med høy trafikk.\r
- Test at prefetch ikke påvirker LCP.\r
\r
## Unngå\r
- Ikke bruk på nettverk med databesparelse.\r
- Ikke prefetch for store sider uten behov.\r
`,a={title:"Komponenter/Layout/SmartPrefetcher",component:n,tags:["autodocs"],parameters:{docs:{description:{component:t}},controls:{disable:!0}}},e={render:()=>r.jsxs("div",{children:[r.jsx(n,{}),r.jsx("p",{children:"Denne komponenten prefetcher ruter i bakgrunnen uten å vise UI."})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <div>\r
            <SmartPrefetcher />\r
            <p>Denne komponenten prefetcher ruter i bakgrunnen uten å vise UI.</p>\r
        </div>
}`,...e.parameters?.docs?.source}}};const i=["Standard"];export{e as Standard,i as __namedExportsOrder,a as default};
