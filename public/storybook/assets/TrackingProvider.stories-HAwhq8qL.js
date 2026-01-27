const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ConsentBanner-CMj8GK7H.js","assets/jsx-runtime-C8V8hRFh.js","assets/iframe-2gXNPU8n.js","assets/preload-helper-D1UD9lgW.js","assets/iframe-Cw6jP7NW.css","assets/link-mazOOwm8.js","assets/use-merged-ref-B51OLTfl.js","assets/Button-CV0DL16h.js","assets/clsx-B-dksMZM.js","assets/Button-CieTKgsn.css","assets/tracking-CB1Ze4Aw.js","assets/createLucideIcon-DP3iA5K4.js","assets/ConsentBanner-DCZlsnXf.css"])))=>i.map(i=>d[i]);
import{j as E}from"./jsx-runtime-C8V8hRFh.js";import{_ as N}from"./preload-helper-D1UD9lgW.js";import{j as A,m as q,g as O,b as _,k as V}from"./iframe-2gXNPU8n.js";import{g as T,b as M}from"./tracking-CB1Ze4Aw.js";function F(t){throw new Error('Could not dynamically require "'+t+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var C={},R={},L;function G(){return L||(L=1,(function(t){"use client";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"LoadableContext",{enumerable:!0,get:function(){return r}});const r=q()._(A()).default.createContext(null)})(R)),R}var x;function W(){return x||(x=1,(function(t){Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return D}});const i=q()._(A()),r=G();function c(n){return n&&n.default?n.default:n}const p=[],f=[];let d=!1;function m(n){let o=n(),e={loading:!0,loaded:null,error:null};return e.promise=o.then(a=>(e.loading=!1,e.loaded=a,a)).catch(a=>{throw e.loading=!1,e.error=a,a}),e}function P(n,o){let e=Object.assign({loader:null,loading:null,delay:200,timeout:null,webpack:null,modules:null},o),a=null;function b(){if(!a){const s=new j(n,e);a={getCurrentValue:s.getCurrentValue.bind(s),subscribe:s.subscribe.bind(s),retry:s.retry.bind(s),promise:s.promise.bind(s)}}return a.promise()}if(typeof window>"u"&&p.push(b),!d&&typeof window<"u"){const s=e.webpack&&typeof F.resolveWeak=="function"?e.webpack():e.modules;s&&f.push(h=>{for(const l of s)if(h.includes(l))return b()})}function B(){b();const s=i.default.useContext(r.LoadableContext);s&&Array.isArray(e.modules)&&e.modules.forEach(h=>{s(h)})}function w(s,h){B();const l=i.default.useSyncExternalStore(a.subscribe,a.getCurrentValue,a.getCurrentValue);return i.default.useImperativeHandle(h,()=>({retry:a.retry}),[]),i.default.useMemo(()=>l.loading||l.error?i.default.createElement(e.loading,{isLoading:l.loading,pastDelay:l.pastDelay,timedOut:l.timedOut,error:l.error,retry:a.retry}):l.loaded?i.default.createElement(c(l.loaded),s):null,[s,l])}return w.preload=()=>b(),w.displayName="LoadableComponent",i.default.forwardRef(w)}class j{constructor(o,e){this._loadFn=o,this._opts=e,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}promise(){return this._res.promise}retry(){this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};const{_res:o,_opts:e}=this;o.loading&&(typeof e.delay=="number"&&(e.delay===0?this._state.pastDelay=!0:this._delay=setTimeout(()=>{this._update({pastDelay:!0})},e.delay)),typeof e.timeout=="number"&&(this._timeout=setTimeout(()=>{this._update({timedOut:!0})},e.timeout))),this._res.promise.then(()=>{this._update({}),this._clearTimeouts()}).catch(a=>{this._update({}),this._clearTimeouts()}),this._update({})}_update(o){this._state={...this._state,error:this._res.error,loaded:this._res.loaded,loading:this._res.loading,...o},this._callbacks.forEach(e=>e())}_clearTimeouts(){clearTimeout(this._delay),clearTimeout(this._timeout)}getCurrentValue(){return this._state}subscribe(o){return this._callbacks.add(o),()=>{this._callbacks.delete(o)}}}function g(n){return P(m,n)}function v(n,o){let e=[];for(;n.length;){let a=n.pop();e.push(a(o))}return Promise.all(e).then(()=>{if(n.length)return v(n,o)})}g.preloadAll=()=>new Promise((n,o)=>{v(p).then(n,o)}),g.preloadReady=(n=[])=>new Promise(o=>{const e=()=>(d=!0,o());v(f,n).then(e,e)}),typeof window<"u"&&(window.__NEXT_PRELOADREADY=g.preloadReady);const D=g})(C)),C}var K=W();const Y=O(K);function I(t){return{default:t?.default||t}}function Z(t,u){const i=Y;let r={loading:({error:f,isLoading:d,pastDelay:m})=>null};t instanceof Promise?r.loader=()=>t:typeof t=="function"?r.loader=t:typeof t=="object"&&(r={...r,...t}),r={...r,...u};const c=r.loader,p=()=>c!=null?c().then(I):Promise.resolve(I(()=>null));return r.loadableGenerated&&(r={...r,...r.loadableGenerated},delete r.loadableGenerated),typeof r.ssr=="boolean"&&!r.ssr&&(delete r.ssr,delete r.webpack,delete r.modules),i({...r,loader:p})}const H=Z(()=>N(()=>import("./ConsentBanner-CMj8GK7H.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])).then(t=>t.ConsentBanner),{loadableGenerated:{webpack:()=>[require.resolveWeak("./ConsentBanner")]},ssr:!1}),J=_.createContext(void 0);function S({children:t,isAdmin:u}){const[i,r]=_.useState(()=>T()),[c,p]=_.useState(()=>!T()&&!u),f=V();return _.useEffect(()=>{window.SJOBADET_IS_ADMIN=u;const d=m=>{r(m.detail)};return window.addEventListener("consentChange",d),()=>window.removeEventListener("consentChange",d)},[u,i]),_.useEffect(()=>{u||i?.analysis&&M(f)},[f,i?.analysis,u]),E.jsxs(J.Provider,{value:{consent:i,showBanner:c,setShowBanner:p},children:[t,E.jsx(H,{})]})}S.__docgenInfo={description:`TrackingProvider wraps the app to:\r
1. Initialize consent state from cookies.\r
2. Automatically track pageviews on route changes (if consented).\r
3. Provide a way for child components to interact with consent.`,methods:[],displayName:"TrackingProvider",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},isAdmin:{required:!0,tsType:{name:"boolean"},description:""}}};const U=`# TrackingProvider\r
\r
Kort beskrivelse: Wrapper som håndterer samtykke og sporing av sidevisninger.\r
\r
## Bruk\r
- Bruk på toppnivå rundt hele appen.\r
\r
## Ikke bruk\r
- Ikke bruk i isolerte komponenter.\r
\r
## Retningslinjer for innhold\r
- Barn bør være full app eller sideinnhold.\r
\r
## Props (kort)\r
- \`children\`: Innholdet som skal spores.\r
- \`isAdmin\`: Deaktiverer sporing og banner for admin.\r
\r
## Eksempler\r
\`\`\`tsx\r
<TrackingProvider isAdmin={false}>\r
  <App />\r
</TrackingProvider>\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Samtykkebanneret vises kun når det er relevant.\r
\r
## Vedlikehold/Notater\r
- Lytter på \`consentChange\` og sporer sidevisninger via \`trackPageview\`.\r
\r
## Gjør\r
- Plasser høyt i treet (rundt hele appen).\r
- Skru av sporing for admin-brukere.\r
\r
## Unngå\r
- Ikke bruk flere nested providers.\r
- Ikke spor uten samtykke.\r
`,ee={title:"Komponenter/Analyse/TrackingProvider",component:S,tags:["autodocs"],parameters:{layout:"padded",docs:{description:{component:U}},controls:{exclude:["children"]}},argTypes:{isAdmin:{control:"boolean",description:"Deaktiverer sporing og banner når true."}},args:{isAdmin:!1,children:E.jsx("div",{style:{background:"#f8fafc",padding:"1rem",borderRadius:"0.5rem"},children:"Eksempelinnhold som ligger inne i TrackingProvider."})}},k={},y={args:{isAdmin:!0}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:"{}",...k.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    isAdmin: true
  }
}`,...y.parameters?.docs?.source}}};const re=["Standard","Admin"];export{y as Admin,k as Standard,re as __namedExportsOrder,ee as default};
