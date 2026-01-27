import{j as r}from"./jsx-runtime-C8V8hRFh.js";import{b as N}from"./iframe-2gXNPU8n.js";import{M as S}from"./MediaDropzone-CfbhmIHP.js";import{M as P}from"./MediaGrid-8TyVbbeC.js";import{M as B}from"./MediaItem-c2Z6YF3L.js";import{s as u}from"./MediaManager.module-BIXRbq_H.js";import"./preload-helper-D1UD9lgW.js";import"./createLucideIcon-DP3iA5K4.js";import"./index-3RtVpP5u.js";import"./image-CD-QxPcS.js";import"./use-merged-ref-B51OLTfl.js";import"./x-B4Dzqw0X.js";function R({saunaId:y,initialAssets:A=[]}){const[x,o]=N.useState(A.filter(e=>{const t=(e.storageKeyThumb||e.storageKeyLarge||"").trim();return t&&t!=="pending"&&(t.startsWith("/")||t.startsWith("blob:")||t.startsWith("http"))}).map(e=>({id:e.id,url:(e.storageKeyThumb||e.storageKeyLarge).trim(),status:"confirmed",kind:e.kind}))),d=x.find(e=>e.kind==="PRIMARY"),g=x.filter(e=>e.kind==="GALLERY"),M=async(e,t)=>{for(const i of e)await I(i,t)},I=async(e,t)=>{const i=Math.random().toString(36).substring(7),m=URL.createObjectURL(e),h={id:i,url:m,status:"uploading",progress:0};o(a=>t==="PRIMARY"?[h,...a.filter(p=>A.find(c=>c.id===p.id)?.kind!=="PRIMARY")]:[...a,h]);try{const a=await fetch("/api/media/init",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({saunaId:y,kind:t,filename:e.name,mimeType:e.type,fileSize:e.size})}),{assetId:p,uploadUrl:c,error:l}=await a.json();if(l)throw new Error(l);const n=new XMLHttpRequest;n.open("PUT",c,!0),n.upload.onprogress=s=>{if(s.lengthComputable){const f=Math.round(s.loaded/s.total*100);o(T=>T.map(k=>k.id===i?{...k,progress:f,status:f===100?"processing":"uploading"}:k))}};const D=new Promise((s,f)=>{n.onload=()=>n.status>=200&&n.status<300?s(JSON.parse(n.response)):f(new Error("Upload failed")),n.onerror=()=>f(new Error("Network error"))});n.send(e),await D;const E=await fetch("/api/media/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({assetId:p,saunaId:y,kind:t,orderIndex:t==="GALLERY"?g.length:0})}),{allAssets:L,error:w}=await E.json();if(w)throw new Error(w);o(L.map(s=>({id:s.id,url:(s.storageKeyThumb||s.storageKeyLarge)?.trim()||"",status:"confirmed",kind:s.kind})))}catch(a){const p=a instanceof Error?a.message:String(a);o(c=>c.map(l=>l.id===i?{...l,status:"error",error:p}:l))}},j=async e=>{if(confirm("Er du sikker på at du vil slette dette bildet?"))try{(await fetch(`/api/media/${e}`,{method:"DELETE"})).ok&&o(i=>i.filter(m=>m.id!==e))}catch{}},v=async e=>{const t=d?[d,...e]:e;o(t);try{const i=e.map((m,h)=>({id:m.id,orderIndex:h}));await fetch("/api/media/reorder",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({saunaId:y,assetOrders:i})})}catch{}};return r.jsxs("div",{className:u.container,children:[r.jsx("input",{type:"hidden",name:"imageUrl",value:d?.url||""}),r.jsx("input",{type:"hidden",name:"assetIds",value:JSON.stringify(x.map(e=>e.id))}),r.jsx("input",{type:"hidden",name:"gallery",value:JSON.stringify(g.map(e=>e.url))}),r.jsxs("div",{className:u.section,style:{backgroundColor:"#f8fafc",padding:"1.5rem",borderRadius:"0.75rem",border:"2px dashed #e2e8f0"},children:[r.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"},children:[r.jsx("label",{className:u.label,style:{fontSize:"1.1rem",color:"#1e293b",marginBottom:0},children:"Hovedbilde"}),d&&r.jsx("span",{style:{fontSize:"0.75rem",fontWeight:600,color:"#16a34a",backgroundColor:"#dcfce7",padding:"0.25rem 0.75rem",borderRadius:"999px"},children:"Aktivt"})]}),d?r.jsx("div",{style:{maxWidth:"300px"},children:r.jsx(B,{asset:d,onDelete:j,isPrimary:!0})}):r.jsx(S,{onFilesSelected:e=>M(e,"PRIMARY")}),r.jsx("p",{style:{fontSize:"0.8rem",color:"#64748b",marginTop:"0.75rem"},children:"Dette er bildet som vises på forsiden og øverst på badstue-siden."})]}),r.jsxs("div",{className:u.section,style:{marginTop:"2rem"},children:[r.jsx("label",{className:u.label,style:{fontSize:"1.1rem",color:"#1e293b"},children:"Galleri (0-20 bilder)"}),r.jsx("div",{style:{marginBottom:"1rem"},children:r.jsx(P,{assets:g,onReorder:v,onDelete:j})}),g.length<20&&r.jsx(S,{onFilesSelected:e=>M(e,"GALLERY"),multiple:!0})]})]})}R.__docgenInfo={description:"",methods:[],displayName:"SaunaMediaManager",props:{saunaId:{required:!0,tsType:{name:"string"},description:""},initialAssets:{required:!1,tsType:{name:"Array",elements:[{name:"MediaAsset"}],raw:"MediaAsset[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};const G=`# SaunaMediaManager\r
\r
Kort beskrivelse: Komplett administrasjon av hovedbilde og galleri for badstue.\r
\r
## Bruk\r
- Bruk i admin når man skal laste opp og sortere bilder.\r
\r
## Ikke bruk\r
- Ikke bruk i offentlig UI.\r
\r
## Retningslinjer for innhold\r
- Begrens galleri til maks 20 bilder.\r
- Gi tydelige statusindikasjoner.\r
\r
## Props (kort)\r
- \`saunaId\`: ID for badstuen.\r
- \`initialAssets\`: Startliste med eksisterende media.\r
\r
## Eksempler\r
\`\`\`tsx\r
<SaunaMediaManager saunaId="1" initialAssets={[]} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Sørg for at viktige knapper har \`aria-label\`.\r
\r
## Vedlikehold/Notater\r
- Avhengig av API-endepunkter for opplasting.\r
\r
## Gjør\r
- Hold galleri under 20 bilder.\r
- Bruk hovedbilde for beste førstinntrykk.\r
\r
## Unngå\r
- Ikke bruk i offentlig UI.\r
- Ikke start opplasting uten visuell feedback.\r
`,_={title:"Komponenter/Admin/SaunaMediaManager",component:R,tags:["autodocs"],parameters:{docs:{description:{component:G}},controls:{exclude:["initialAssets"]}},argTypes:{saunaId:{control:"text",description:"ID for badstuen som administreres."},initialAssets:{control:!1,description:"Startliste med eksisterende media."}},args:{saunaId:"1",initialAssets:[{id:"a1",kind:"PRIMARY",storageKeyLarge:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},{id:"a2",kind:"GALLERY",storageKeyLarge:"https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},{id:"a3",kind:"GALLERY",storageKeyLarge:"https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}]}},b={};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:"{}",...b.parameters?.docs?.source}}};const X=["Standard"];export{b as Standard,X as __namedExportsOrder,_ as default};
