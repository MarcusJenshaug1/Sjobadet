import{M as r}from"./MediaDropzone-CfbhmIHP.js";import"./jsx-runtime-C8V8hRFh.js";import"./iframe-2gXNPU8n.js";import"./preload-helper-D1UD9lgW.js";import"./MediaManager.module-BIXRbq_H.js";import"./createLucideIcon-DP3iA5K4.js";const n=`# MediaDropzone\r
\r
Kort beskrivelse: Dra-og-slipp felt for bildeopplasting i admin.\r
\r
## Bruk\r
- Bruk når admin skal laste opp bilder.\r
\r
## Ikke bruk\r
- Ikke bruk i offentlig UI.\r
\r
## Retningslinjer for innhold\r
- Vis klare filkrav (format og maks størrelse).\r
\r
## Props (kort)\r
- \`onFilesSelected\`: Kalles med gyldige filer.\r
- \`multiple\`: Tillater flere filer.\r
- \`accept\`: Tillatte MIME-typer.\r
- \`maxSize\`: Maks størrelse i MB.\r
\r
## Eksempler\r
\`\`\`tsx\r
<MediaDropzone onFilesSelected={handleFiles} multiple />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Sørg for klikkbar flate og tydelig tekst.\r
\r
## Vedlikehold/Notater\r
- Validering skjer i komponenten.\r
\r
## Gjør\r
- Oppgi tydelige filkrav.\r
- Begrens filstørrelse.\r
\r
## Unngå\r
- Ikke bruk uten \`onFilesSelected\`.\r
- Ikke tillat ubegrenset opplasting.\r
`,p={title:"Komponenter/Admin/MediaDropzone",component:r,tags:["autodocs"],parameters:{docs:{description:{component:n}}},argTypes:{onFilesSelected:{action:"filesSelected",description:"Kalles med gyldige filer etter dropp/valg."},multiple:{control:"boolean",description:"Tillat flere filer samtidig."},accept:{control:"text",description:"MIME-typer som aksepteres."},maxSize:{control:"number",description:"Maks størrelse i MB."}},args:{multiple:!0,maxSize:10}},e={};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};const d=["Standard"];export{e as Standard,d as __namedExportsOrder,p as default};
