import{S as o}from"./SaunaCard-DXpzEOcM.js";import"./iframe-BeGkvnHr.js";import"./preload-helper-D1UD9lgW.js";import"./SaunaCard.module-ChdoFVbf.js";import"./Badge-gq3LtFzO.js";import"./BookingModal-BbSyfe_L.js";import"./index-Dn476rUD.js";import"./availability-utils-DC47xJm5.js";import"./external-link-mrAcOcOW.js";const s=`# SaunaCard\r
\r
Kort beskrivelse: Kortvisning av en badstue med status, kapasitet og handlinger.\r
\r
## Bruk\r
- Bruk i lister og oversikter over badstuer.\r
- Vis alltid navn, lokasjon og kort beskrivelse.\r
\r
## Ikke bruk\r
- Ikke bruk når detaljerte timeplaner skal vises (bruk egen side).\r
\r
## Retningslinjer for innhold\r
- Beskrivelsen bør være én kort setning.\r
- Bruk tydelig status (åpen/stengt/få plasser).\r
\r
## Props (kort)\r
- \`sauna\`: Objekt med navn, lokasjon, status og booking-lenker.\r
- \`isMaintenanceMode\`: Skjuler booking-status og handlinger ved vedlikehold.\r
\r
## Eksempler\r
\`\`\`tsx\r
<SaunaCard sauna={{ id: '1', name: 'Tønsberg', location: 'Tønsberg', slug: 'tonsberg', shortDescription: 'Badstue ved brygga' }} />\r
\`\`\`\r
\r
## Tilgjengelighet\r
- Kortet er tastaturnavigerbart (\`role="link"\`).\r
- Viktig informasjon vises både med tekst og ikon.\r
\r
## Vedlikehold/Notater\r
- Booking-knapper åpner modal når URL er tilgjengelig.\r
\r
## Gjør\r
- Bruk korte beskrivelser.\r
- Vis tydelig status for tilgjengelighet.\r
\r
## Unngå\r
- Ikke bruk lange avsnitt i kortet.\r
- Ikke skjul viktig statusinformasjon.\r
`,f={title:"Komponenter/Badstue/SaunaCard",component:o,tags:["autodocs"],parameters:{docs:{description:{component:s}}},argTypes:{sauna:{control:"object",description:"Badstue-data som vises i kortet."},isMaintenanceMode:{control:"boolean",description:"Skjuler bookingstatus og handlinger ved vedlikehold."}}},e={args:{sauna:{id:"1",name:"Tønsberg Brygge",location:"Tønsberg",slug:"tonsberg-brygge",shortDescription:"Vår mest populære badstue med fantastisk utsikt over havna.",imageUrl:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",bookingUrlDropin:"#",bookingUrlPrivat:"#",driftStatus:"open",capacityDropin:10,nextAvailableSlot:{time:"18:30",availableSpots:6,date:new Date().toISOString()}}}},n={args:{sauna:{id:"2",name:"Hjemseng brygge",location:"Nøtterøy",slug:"hjemseng-brygge",shortDescription:"En fredelig oase på vakre Nøtterøy.",imageUrl:"https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",bookingUrlDropin:"#",bookingUrlPrivat:"#",driftStatus:"closed"}}},r={args:{sauna:{id:"3",name:"Hjemseng Brygge",location:"Nøtterøy",slug:"hjemseng-brygge",shortDescription:"Lite ledig kapasitet i dag.",imageUrl:"https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",bookingUrlDropin:"#",bookingUrlPrivat:"#",driftStatus:"open",capacityDropin:8,nextAvailableSlot:{time:"20:00",availableSpots:2,date:new Date().toISOString()}}}},t={args:{sauna:{id:"4",name:"Planlagt Badstue",location:"Sandefjord",slug:"sandefjord",shortDescription:"Kommer snart til en havn nær deg!",driftStatus:"open"}}},a={args:{isMaintenanceMode:!0,sauna:{id:"5",name:"Tønsberg Brygge",location:"Tønsberg",slug:"tonsberg-brygge",shortDescription:"Kortet skjuler status og handlinger i vedlikeholdsmodus.",imageUrl:"https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",driftStatus:"open"}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    sauna: {
      id: '1',
      name: 'Tønsberg Brygge',
      location: 'Tønsberg',
      slug: 'tonsberg-brygge',
      shortDescription: 'Vår mest populære badstue med fantastisk utsikt over havna.',
      imageUrl: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bookingUrlDropin: '#',
      bookingUrlPrivat: '#',
      driftStatus: 'open',
      capacityDropin: 10,
      nextAvailableSlot: {
        time: '18:30',
        availableSpots: 6,
        date: new Date().toISOString()
      }
    }
  }
}`,...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    sauna: {
      id: '2',
      name: 'Hjemseng brygge',
      location: 'Nøtterøy',
      slug: 'hjemseng-brygge',
      shortDescription: 'En fredelig oase på vakre Nøtterøy.',
      imageUrl: 'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bookingUrlDropin: '#',
      bookingUrlPrivat: '#',
      driftStatus: 'closed'
    }
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    sauna: {
      id: '3',
      name: 'Hjemseng Brygge',
      location: 'Nøtterøy',
      slug: 'hjemseng-brygge',
      shortDescription: 'Lite ledig kapasitet i dag.',
      imageUrl: 'https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      bookingUrlDropin: '#',
      bookingUrlPrivat: '#',
      driftStatus: 'open',
      capacityDropin: 8,
      nextAvailableSlot: {
        time: '20:00',
        availableSpots: 2,
        date: new Date().toISOString()
      }
    }
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    sauna: {
      id: '4',
      name: 'Planlagt Badstue',
      location: 'Sandefjord',
      slug: 'sandefjord',
      shortDescription: 'Kommer snart til en havn nær deg!',
      driftStatus: 'open'
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    isMaintenanceMode: true,
    sauna: {
      id: '5',
      name: 'Tønsberg Brygge',
      location: 'Tønsberg',
      slug: 'tonsberg-brygge',
      shortDescription: 'Kortet skjuler status og handlinger i vedlikeholdsmodus.',
      imageUrl: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      driftStatus: 'open'
    }
  }
}`,...a.parameters?.docs?.source}}};const k=["Standard","Stengt","FåPlasser","IngenBilde","Vedlikehold"];export{r as FåPlasser,t as IngenBilde,e as Standard,n as Stengt,a as Vedlikehold,k as __namedExportsOrder,f as default};
