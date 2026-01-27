import{F as n}from"./iframe-ChuUt2dm.js";import"./preload-helper-D1UD9lgW.js";const r=`# FooterView\r
\r
Kort beskrivelse: Bunnseksjon med kontaktinfo og lenker.\r
\r
## Bruk\r
- Bruk som global footer på alle sider.\r
- Viser kontaktinformasjon og lenker til badstuer.\r
\r
## Ikke bruk\r
- Ikke bruk for lange tekster eller markedsføringsinnhold.\r
\r
## Retningslinjer for innhold\r
- Hold kontaktinfo oppdatert.\r
- Begrens antall lenker for oversiktlighet.\r
\r
## Props (kort)\r
- \`address\`: Adresse.\r
- \`email\`: Kontakt e-post.\r
- \`phone\`: Telefonnummer.\r
- \`instagram\`: URL til Instagram.\r
- \`facebook\`: URL til Facebook.\r
- \`saunas\`: Liste over aktive badstuer.\r
\r
## Eksempler\r
\`\`\`tsx\r
<FooterView address="Nedre Langgate 44" email="booking@sjobadet.com" phone="+47 401 55 365" saunas={[]} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Bruk tydelige lenketekster.\r
\r
## Vedlikehold/Notater\r
- Server-komponenten \`Footer\` henter data og sender til \`FooterView\`.\r
\r
## Gjør\r
- Hold kontaktinfo oppdatert.\r
- Bruk tydelige lenketekster.\r
\r
## Unngå\r
- Ikke legg inn lange tekster.\r
- Ikke skjul viktig kontaktinfo.\r
`,s={title:"Komponenter/Layout/Footer",component:n,tags:["autodocs"],parameters:{docs:{description:{component:r}}},argTypes:{address:{control:"text",description:"Adresse som vises i footer."},email:{control:"text",description:"Kontakt e-postadresse."},phone:{control:"text",description:"Telefonnummer."},instagram:{control:"text",description:"Instagram-lenke."},facebook:{control:"text",description:"Facebook-lenke."},saunas:{control:"object",description:"Liste over badstuer som vises i footer."}}},e={args:{address:"Nedre Langgate 44, 3126 Tønsberg",email:"booking@sjobadet.com",phone:"+47 401 55 365",instagram:"https://instagram.com",facebook:"https://facebook.com",saunas:[{id:"1",slug:"tonsberg-brygge",name:"Tønsberg Brygge",location:"Tønsberg",shortDescription:"Badstue ved brygga",capacityDropin:8,capacityPrivat:10,driftStatus:"open",flexibleHours:!1},{id:"2",slug:"hjemseng-brygge",name:"Hjemseng brygge",location:"Hjemseng",shortDescription:"Badstue med sjøutsikt",capacityDropin:6,capacityPrivat:8,driftStatus:"closed",stengeArsak:"Is på vannet"}]}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    address: 'Nedre Langgate 44, 3126 Tønsberg',
    email: 'booking@sjobadet.com',
    phone: '+47 401 55 365',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    saunas: [{
      id: '1',
      slug: 'tonsberg-brygge',
      name: 'Tønsberg Brygge',
      location: 'Tønsberg',
      shortDescription: 'Badstue ved brygga',
      capacityDropin: 8,
      capacityPrivat: 10,
      driftStatus: 'open',
      flexibleHours: false
    }, {
      id: '2',
      slug: 'hjemseng-brygge',
      name: 'Hjemseng brygge',
      location: 'Hjemseng',
      shortDescription: 'Badstue med sjøutsikt',
      capacityDropin: 6,
      capacityPrivat: 8,
      driftStatus: 'closed',
      stengeArsak: 'Is på vannet'
    }]
  }
}`,...e.parameters?.docs?.source}}};const a=["Standard"];export{e as Standard,a as __namedExportsOrder,s as default};
