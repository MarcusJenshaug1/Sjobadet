import{j as n}from"./jsx-runtime-C8V8hRFh.js";import{b as p}from"./iframe-2gXNPU8n.js";import{u as h}from"./optional-router-CIf5U-aS.js";import"./preload-helper-D1UD9lgW.js";function i(){const s=h(),[c,d]=p.useState([]);return p.useEffect(()=>{const r=navigator.connection;if(r&&(r.saveData||r.effectiveType&&/2g/.test(r.effectiveType)))return;const f=setTimeout(async()=>{const u=["/medlemskap","/info"];(window.requestIdleCallback||(e=>setTimeout(e,5e3)))(async()=>{u.forEach((e,o)=>{setTimeout(()=>s.prefetch(e),o*600)});try{const e=await fetch("/api/saunas/slugs");if(e.ok){const{slugs:o}=await e.json(),l=o.map(a=>`/home/${a}`);l.forEach((a,m)=>{setTimeout(()=>s.prefetch(a),(u.length+m)*800)}),d(l)}}catch{}})},4e3);return()=>clearTimeout(f)},[s]),c.length===0?null:n.jsx("script",{type:"speculationrules",dangerouslySetInnerHTML:{__html:JSON.stringify({prerender:[{source:"list",urls:c,eagerness:"conservative"}]})}})}i.__docgenInfo={description:`SmartPrefetcher intelligently prefetches key routes during idle time.\r
It also uses the Speculation Rules API to "pre-render" pages in the background\r
for an actual 0ms transition.`,methods:[],displayName:"SmartPrefetcher"};const k=`# SmartPrefetcher\r
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
`,y={title:"Komponenter/Layout/SmartPrefetcher",component:i,tags:["autodocs"],parameters:{docs:{description:{component:k}},controls:{disable:!0}}},t={render:()=>n.jsxs("div",{children:[n.jsx(i,{}),n.jsx("p",{children:"Denne komponenten prefetcher ruter i bakgrunnen uten å vise UI."})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div>\r
            <SmartPrefetcher />\r
            <p>Denne komponenten prefetcher ruter i bakgrunnen uten å vise UI.</p>\r
        </div>
}`,...t.parameters?.docs?.source}}};const x=["Standard"];export{t as Standard,x as __namedExportsOrder,y as default};
