import{j as r}from"./jsx-runtime-C8V8hRFh.js";import{R as i}from"./iframe-2gXNPU8n.js";import{T as l}from"./triangle-alert-B9yUFiOi.js";import"./preload-helper-D1UD9lgW.js";import"./createLucideIcon-DP3iA5K4.js";class t extends i.Component{constructor(e){super(e),this.resetError=()=>{this.setState({hasError:!1,error:null})},this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,c){}render(){return this.state.hasError&&this.state.error?this.props.fallback?this.props.fallback(this.state.error,this.resetError):r.jsxs("div",{style:{padding:"2rem",backgroundColor:"#fff5f5",border:"1px solid #feb2b2",borderRadius:"0.75rem",textAlign:"center"},role:"alert",children:[r.jsx(l,{size:48,color:"#f56565",style:{margin:"0 auto 1rem",display:"block"},"aria-hidden":"true"}),r.jsx("h2",{style:{color:"#c53030",marginBottom:"0.5rem"},children:"Noe gikk galt"}),r.jsx("p",{style:{color:"#9b2c2c",marginBottom:"1.5rem"},children:"Vi opplevde et teknisk problem. Vennligst prøv igjen."}),r.jsx("button",{onClick:this.resetError,style:{padding:"0.75rem 1.5rem",backgroundColor:"#dc2626",color:"white",border:"none",borderRadius:"0.5rem",cursor:"pointer",fontSize:"1rem",fontWeight:"500",transition:"background-color 0.2s"},onMouseEnter:e=>e.currentTarget.style.backgroundColor="#b91c1c",onMouseLeave:e=>e.currentTarget.style.backgroundColor="#dc2626",children:"Prøv igjen"})]}):this.props.children}}t.__docgenInfo={description:"",methods:[{name:"resetError",docblock:null,modifiers:[],params:[],returns:null}],displayName:"ErrorBoundary",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},fallback:{required:!1,tsType:{name:"signature",type:"function",raw:"(error: Error, reset: () => void) => ReactNode",signature:{arguments:[{type:{name:"Error"},name:"error"},{type:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},name:"reset"}],return:{name:"ReactNode"}}},description:""}}};const d=`# ErrorBoundary\r
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
`,f={title:"Komponenter/Layout/ErrorBoundary",component:t,tags:["autodocs"],parameters:{docs:{description:{component:d}}},argTypes:{fallback:{control:!1,description:"Egendefinert fallback-visning."}}},a=()=>{throw new Error("Simulert feil")},n={render:()=>r.jsx(t,{children:r.jsx(a,{})})},o={render:()=>r.jsx(t,{fallback:(s,e)=>r.jsxs("div",{style:{padding:"1rem",borderRadius:"0.5rem",background:"#fff7ed",border:"1px solid #fed7aa"},children:[r.jsx("strong",{children:"Feil: "}),s.message,r.jsx("div",{style:{marginTop:"0.75rem"},children:r.jsx("button",{onClick:e,style:{padding:"0.5rem 0.75rem"},children:"Prøv igjen"})})]}),children:r.jsx(a,{})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <ErrorBoundary>\r
            <Broken />\r
        </ErrorBoundary>
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const b=["Standard","EgendefinertFallback"];export{o as EgendefinertFallback,n as Standard,b as __namedExportsOrder,f as default};
