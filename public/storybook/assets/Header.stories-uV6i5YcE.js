import{j as e}from"./jsx-runtime-DDl-KI2x.js";import{b as i}from"./iframe-C_JdCeVj.js";import{L as s}from"./link-XK0mguUS.js";import{n as _}from"./image-BVT29y58.js";import{B as g}from"./Button-Beo3o9mi.js";import{c as a}from"./createLucideIcon-DMVqFKYz.js";import{X as x}from"./x-BMxvtbSS.js";import{U as q}from"./users-BwxUpH-y.js";import{I as O}from"./info-9Qx_PVBD.js";import"./preload-helper-PPVm8Dsz.js";import"./use-merged-ref-B-uQP8i3.js";import"./clsx-B-dksMZM.js";const R=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],E=a("briefcase",R);const F=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],v=a("chevron-down",F);const D=[["path",{d:"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",key:"1slcih"}]],W=a("flame",D);const U=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],P=a("menu",U);const K=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],j=a("shield-check",K);const X=[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]],Z=a("ticket",X),G="_header_c24xf_1",Q="_scrolled_c24xf_27",Y="_navContainer_c24xf_43",J="_logo_c24xf_57",ee="_nav_c24xf_43",ne="_mobileMenuBtn_c24xf_77",oe="_mobileMenu_c24xf_77",re="_open_c24xf_127",se="_mobileMenuHeader_c24xf_135",ie="_mobileLogo_c24xf_169",ae="_closeBtn_c24xf_179",le="_mobileScrollArea_c24xf_219",te="_mobileLinks_c24xf_237",ce="_mobileLinkWrapper_c24xf_249",de="_mobileLinkRow_c24xf_271",me="_mobileLink_c24xf_237",pe="_linkIcon_c24xf_321",fe="_mobileToggle_c24xf_355",he="_mobileAccordion_c24xf_379",be="_mobileAccordionLink_c24xf_395",ue="_mobileAdmin_c24xf_423",ke="_adminBadge_c24xf_437",_e="_mobileFooter_c24xf_461",ge="_navLink_c24xf_497",xe="_dropdownContainer_c24xf_543",ve="_dropdownMenu_c24xf_553",je="_dropdownItem_c24xf_599",Le="_chevron_c24xf_633",n={header:G,scrolled:Q,navContainer:Y,logo:J,nav:ee,mobileMenuBtn:ne,mobileMenu:oe,open:re,mobileMenuHeader:se,mobileLogo:ie,closeBtn:ae,mobileScrollArea:le,mobileLinks:te,mobileLinkWrapper:ce,mobileLinkRow:de,mobileLink:me,linkIcon:pe,mobileToggle:fe,mobileAccordion:he,mobileAccordionLink:be,mobileAdmin:ue,adminBadge:ke,mobileFooter:_e,navLink:ge,dropdownContainer:xe,dropdownMenu:ve,dropdownItem:je,chevron:Le},L=""+new URL("sjobadet-logo-BBIKdd6i.png?ignore",import.meta.url).href,y={src:L,height:120,width:120,blurDataURL:L};function w({isAdmin:m,isMaintenanceMode:M=!1,saunaLinks:N=[],infoLinks:A=[]}){const[p,l]=i.useState(!1),[B,I]=i.useState(!1),[h,S]=i.useState(m),[C,z]=i.useState(!1),[T,V]=i.useState(!1);i.useEffect(()=>{const o=()=>{I(window.scrollY>10)};return window.addEventListener("scroll",o),()=>window.removeEventListener("scroll",o)},[]),i.useEffect(()=>{let o=!1;return fetch("/api/auth/session",{cache:"no-store"}).then(r=>r.ok?r.json():{isAdmin:m}).then(r=>{!o&&typeof r?.isAdmin=="boolean"&&S(r.isAdmin)}).catch(()=>{}),()=>{o=!0}},[m]);const b=()=>l(!p),u=[{href:"/#saunas",label:"Badstuer",icon:e.jsx(W,{size:20}),dropdown:N},{href:"/medlemskap",label:"Medlemskap",icon:e.jsx(q,{size:20})},{href:"/gavekort",label:"Gavekort",icon:e.jsx(Z,{size:20})},{href:"/bedrift",label:"Bedrift",icon:e.jsx(E,{size:20})},{href:"/info",label:"Info",icon:e.jsx(O,{size:20}),dropdown:A}],H=h?e.jsxs(s,{href:"/admin",className:`${n.navLink} ${n.adminLink}`,style:{color:"#2563eb",fontWeight:"600"},children:[e.jsx(j,{size:18}),"Admin"]}):null;return e.jsx("header",{className:`${n.header} ${B?n.scrolled:""}`,children:e.jsxs("div",{className:`container ${n.navContainer}`,children:[e.jsx(s,{href:"/",className:n.logo,children:e.jsx(_,{src:y,alt:"Sjøbadet Logo",height:40,style:{objectFit:"contain",width:"auto"},priority:!0})}),e.jsxs("nav",{className:n.nav,children:[u.map(o=>M&&o.href!=="/"?e.jsx("div",{className:n.navLink,style:{opacity:.5,cursor:"not-allowed"},children:o.label},o.label):o.dropdown&&o.dropdown.length>0?e.jsxs("div",{className:n.dropdownContainer,children:[e.jsxs(s,{href:o.href,className:n.navLink,children:[o.label,e.jsx(v,{size:14,className:n.chevron})]}),e.jsx("div",{className:n.dropdownMenu,children:o.dropdown.map(r=>e.jsx(s,{href:r.href,className:n.dropdownItem,children:r.label},r.href))})]},o.label):e.jsx(s,{href:o.href,className:n.navLink,children:o.label},o.href)),H,e.jsx(g,{href:"https://minside.periode.no/landing/aZNzpP9Mk1XohfwTswm1/0",external:!0,variant:"outline",style:{marginLeft:"1rem"},children:"Min Side"})]}),e.jsx("button",{className:n.mobileMenuBtn,onClick:b,"aria-label":"Toggle menu",children:p?e.jsx(x,{size:28}):e.jsx(P,{size:28})}),e.jsxs("nav",{className:`${n.mobileMenu} ${p?n.open:""}`,children:[e.jsxs("div",{className:n.mobileMenuHeader,children:[e.jsx(s,{href:"/",onClick:()=>l(!1),className:n.mobileLogo,children:e.jsx(_,{src:y,alt:"Sjøbadet Logo",height:32,style:{objectFit:"contain",width:"auto"},priority:!0})}),e.jsx("button",{className:n.closeBtn,onClick:b,"aria-label":"Lukk meny",children:e.jsx(x,{size:24})})]}),e.jsx("div",{className:n.mobileScrollArea,children:e.jsxs("div",{className:n.mobileLinks,children:[u.map(o=>{const r=o.dropdown&&o.dropdown.length>0,k=o.label==="Badstuer",t=k?C:T,$=k?z:V;return e.jsxs("div",{className:n.mobileLinkWrapper,children:[e.jsxs("div",{className:n.mobileLinkRow,children:[e.jsxs(s,{href:o.href,onClick:()=>l(!1),className:n.mobileLink,children:[o.icon&&e.jsx("span",{className:n.linkIcon,children:o.icon}),o.label]}),r&&e.jsx("button",{onClick:()=>$(!t),className:n.mobileToggle,style:{transform:t?"rotate(180deg)":"none"},"aria-label":t?"Lukk undermeny":"Åpne undermeny",children:e.jsx(v,{size:22})})]}),r&&t&&e.jsx("div",{className:n.mobileAccordion,children:o.dropdown?.map(f=>e.jsx(s,{href:f.href,onClick:()=>l(!1),className:n.mobileAccordionLink,children:f.label},f.href))})]},o.label)}),h&&e.jsxs(s,{href:"/admin",onClick:()=>l(!1),className:`${n.mobileLinkRow} ${n.mobileAdmin}`,children:[e.jsxs("div",{className:n.mobileLink,children:[e.jsx(j,{size:20}),"Admin"]}),e.jsx("span",{className:n.adminBadge,children:"Admin Panel"})]})]})}),e.jsx("div",{className:n.mobileFooter,children:e.jsx(g,{href:"https://minside.periode.no/landing/aZNzpP9Mk1XohfwTswm1/0",external:!0,variant:"primary",fullWidth:!0,children:"Min Side"})})]})]})})}w.__docgenInfo={description:"",methods:[],displayName:"HeaderView",props:{isAdmin:{required:!0,tsType:{name:"boolean"},description:""},isMaintenanceMode:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},saunaLinks:{required:!1,tsType:{name:"Array",elements:[{name:"NavLink"}],raw:"NavLink[]"},description:"",defaultValue:{value:"[]",computed:!1}},infoLinks:{required:!1,tsType:{name:"Array",elements:[{name:"NavLink"}],raw:"NavLink[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};const ye=`# HeaderView\r
\r
Kort beskrivelse: Toppnavigasjon med hovedmeny og mobilmeny.\r
\r
## Bruk\r
- Bruk som global header på alle offentlige sider.\r
- Bruk \`saunaLinks\` og \`infoLinks\` for dynamiske menyer.\r
\r
## Ikke bruk\r
- Ikke bruk i admin-områder uten tilpasning.\r
\r
## Retningslinjer for innhold\r
- Menypunkter skal være korte og entydige.\r
- Dropdowns bør begrenses til 6–10 punkter.\r
\r
## Props (kort)\r
- \`isAdmin\`: Viser adminlenke når brukeren er admin.\r
- \`isMaintenanceMode\`: Deaktiverer lenker ved vedlikehold.\r
- \`saunaLinks\`: Liste over badstuer i menyen.\r
- \`infoLinks\`: Liste over infosider i menyen.\r
\r
## Eksempler\r
\`\`\`tsx\r
<HeaderView\r
  isAdmin={false}\r
  saunaLinks={[{ label: 'Tønsberg', href: '/home/tonsberg' }]}\r
  infoLinks={[{ label: 'FAQ', href: '/info/faq' }]}\r
/>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Mobilmenyen har tydelig \`aria-label\` på åpne/lukk.\r
- Dropdowns bør kunne nås via tastatur (sjekk i praksis).\r
\r
## Vedlikehold/Notater\r
- Server-komponenten \`Header\` henter data og sender til \`HeaderView\`.\r
\r
## Gjør\r
- Hold menypunkter korte og tydelige.\r
- Begrens antall dropdown-elementer.\r
\r
## Unngå\r
- Ikke overfyll menyen.\r
- Ikke bruk utydelige label-tekster.\r
`,$e={title:"Komponenter/Layout/Header",component:w,tags:["autodocs"],parameters:{layout:"fullscreen",docs:{description:{component:ye}}},argTypes:{isAdmin:{control:"boolean",description:"Viser adminlenke når brukeren er admin."},isMaintenanceMode:{control:"boolean",description:"Deaktiverer lenker når vedlikehold er aktivt."},saunaLinks:{control:"object",description:"Menylenker til badstuer."},infoLinks:{control:"object",description:"Menylenker til infosider."}},args:{isAdmin:!1,isMaintenanceMode:!1,saunaLinks:[{label:"Tønsberg Brygge",href:"/home/tonsberg"},{label:"Hjemseng Brygge",href:"/home/hjemseng"}],infoLinks:[{label:"Ofte stilte spørsmål",href:"/info/faq"},{label:"Åpningstider",href:"/info/apningstider"}]}},c={},d={args:{isMaintenanceMode:!0}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:"{}",...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    isMaintenanceMode: true
  }
}`,...d.parameters?.docs?.source}}};const qe=["Standard","Vedlikehold"];export{c as Standard,d as Vedlikehold,qe as __namedExportsOrder,$e as default};
