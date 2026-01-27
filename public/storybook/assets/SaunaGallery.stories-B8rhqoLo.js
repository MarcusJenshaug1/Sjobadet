import{j as e}from"./jsx-runtime-DDl-KI2x.js";import{b as s}from"./iframe-C_JdCeVj.js";import{n as f}from"./image-BVT29y58.js";import{c as _}from"./createLucideIcon-DMVqFKYz.js";import{X as w}from"./x-BMxvtbSS.js";import"./preload-helper-PPVm8Dsz.js";import"./use-merged-ref-B-uQP8i3.js";const k=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],x=_("chevron-left",k);const N=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],b=_("chevron-right",N),y="_gallerySection_1cm5a_1",j="_title_1cm5a_15",B="_slideshowContainer_1cm5a_29",D="_mainImageWrapper_1cm5a_41",C="_mainImage_1cm5a_41",I="_imageOverlay_1cm5a_83",H="_slideNavPrev_1cm5a_137",M="_slideNavNext_1cm5a_139",A="_thumbnailRow_1cm5a_207",G="_thumbnailWrapper_1cm5a_243",W="_thumbnailActive_1cm5a_277",L="_thumbnailImage_1cm5a_289",R="_lightboxOverlay_1cm5a_299",S="_lightboxContent_1cm5a_327",q="_fullImage_1cm5a_351",E="_closeButton_1cm5a_359",O="_lightboxNavLeft_1cm5a_361",z="_lightboxNavRight_1cm5a_363",T="_imageCounter_1cm5a_467",a={gallerySection:y,title:j,slideshowContainer:B,mainImageWrapper:D,mainImage:C,imageOverlay:I,slideNavPrev:H,slideNavNext:M,thumbnailRow:A,thumbnailWrapper:G,thumbnailActive:W,thumbnailImage:L,lightboxOverlay:R,lightboxContent:S,fullImage:q,closeButton:E,lightboxNavLeft:O,lightboxNavRight:z,imageCounter:T};function v({images:r,saunaName:u}){const[i,g]=s.useState(0),[h,p]=s.useState(!1),l=s.useCallback(n=>{n?.stopPropagation(),g(t=>t<r.length-1?t+1:0)},[r.length]),o=s.useCallback(n=>{n?.stopPropagation(),g(t=>t>0?t-1:r.length-1)},[r.length]),c=s.useCallback(()=>{p(!1)},[]);return s.useEffect(()=>{const n=t=>{h&&(t.key==="Escape"&&c(),t.key==="ArrowRight"&&l(),t.key==="ArrowLeft"&&o())};return window.addEventListener("keydown",n),()=>window.removeEventListener("keydown",n)},[h,l,o,c]),!r||r.length===0?null:e.jsxs("div",{className:a.gallerySection,children:[e.jsx("h2",{className:a.title,children:"Galleri"}),e.jsxs("div",{className:a.slideshowContainer,children:[e.jsxs("div",{className:a.mainImageWrapper,onClick:()=>p(!0),children:[e.jsx(f,{src:r[i],alt:`${u} galleri ${i+1}`,fill:!0,className:a.mainImage,sizes:"(max-width: 1200px) 100vw, 800px",quality:85,loading:"lazy"}),r.length>1&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:a.slideNavPrev,onClick:o,"aria-label":"Forrige bilde",children:e.jsx(x,{size:24})}),e.jsx("button",{className:a.slideNavNext,onClick:l,"aria-label":"Neste bilde",children:e.jsx(b,{size:24})})]}),e.jsx("div",{className:a.imageOverlay,children:e.jsx("span",{children:"Klikk for fullskjerm"})})]}),r.length>1&&e.jsx("div",{className:a.thumbnailRow,children:r.map((n,t)=>e.jsx("button",{className:`${a.thumbnailWrapper} ${t===i?a.thumbnailActive:""}`,onClick:()=>g(t),children:e.jsx(f,{src:n,alt:`${u} miniatyr ${t+1}`,fill:!0,className:a.thumbnailImage,sizes:"100px",quality:70,loading:"lazy"})},t))})]}),h&&e.jsxs("div",{className:a.lightboxOverlay,onClick:c,children:[e.jsx("button",{className:a.closeButton,onClick:c,children:e.jsx(w,{size:32})}),r.length>1&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:a.lightboxNavLeft,onClick:o,children:e.jsx(x,{size:48})}),e.jsx("button",{className:a.lightboxNavRight,onClick:l,children:e.jsx(b,{size:48})})]}),e.jsxs("div",{className:a.lightboxContent,onClick:n=>n.stopPropagation(),children:[e.jsx(f,{src:r[i],alt:`${u} full view`,fill:!0,className:a.fullImage,priority:!0,sizes:"90vw"}),e.jsxs("div",{className:a.imageCounter,children:[i+1," / ",r.length]})]})]})]})}v.__docgenInfo={description:"",methods:[],displayName:"SaunaGallery",props:{images:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},saunaName:{required:!0,tsType:{name:"string"},description:""}}};const P=`# SaunaGallery\r
\r
Kort beskrivelse: Bildegalleri med slideshow og fullskjermsvisning.\r
\r
## Bruk\r
- Bruk på badstuesider med flere bilder.\r
- Bruk minst 2 bilder for best opplevelse.\r
\r
## Ikke bruk\r
- Ikke bruk hvis det ikke finnes bilder.\r
\r
## Retningslinjer for innhold\r
- Bruk bilder med lik stil og fargetone.\r
- Begrens til 6–10 bilder.\r
\r
## Props (kort)\r
- \`images\`: Liste over bilde-URL-er.\r
- \`saunaName\`: Brukes i \`alt\`-tekster.\r
\r
## Eksempler\r
\`\`\`tsx\r
<SaunaGallery saunaName="Tønsberg" images={["/1.jpg", "/2.jpg"]} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Navigasjon har \`aria-label\`.\r
- Tastaturnavigasjon støttes (piltaster og Escape).\r
\r
## Vedlikehold/Notater\r
- Returnerer \`null\` dersom \`images\` er tom.\r
\r
## Gjør\r
- Bruk bilder med konsistent format.\r
- Begrens antall bilder.\r
\r
## Unngå\r
- Ikke bruk tomme lister.\r
- Ikke bruk veldig tunge bilder uten komprimering.\r
`,J={title:"Komponenter/Badstue/SaunaGallery",component:v,tags:["autodocs"],parameters:{docs:{description:{component:P}}},argTypes:{images:{control:"object",description:"Liste over bilde-URL-er."},saunaName:{control:"text",description:"Navn på badstuen (brukes i alt-tekst)."}}},m={args:{saunaName:"Tønsberg Brygge",images:["https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]}},d={args:{saunaName:"Tønsberg Brygge",images:["https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    saunaName: 'Tønsberg Brygge',
    images: ['https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
  }
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    saunaName: 'Tønsberg Brygge',
    images: ['https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
  }
}`,...d.parameters?.docs?.source}}};const Q=["Standard","EttBilde"];export{d as EttBilde,m as Standard,Q as __namedExportsOrder,J as default};
