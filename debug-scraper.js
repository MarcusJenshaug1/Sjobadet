
const fs = require('fs');

async function testFetch() {
    const url = 'https://minside.periode.no/booking/aZNzpP9Mk1XohfwTswm1/5TIMrEsAib93g4fNtiO0/';
    console.log('Fetching:', url);
    try {
        const res = await fetch(url);
        const html = await res.text();

        console.log('HTML length:', html.length);

        if (html.includes('Ledig') || html.includes('ant-radio-button-wrapper')) {
            console.log('SUCCESS: Found phrases in HTML!');
        } else {
            console.log('FAILURE: Phrases not found. It is likely an SPA.');
            // Dump first 500 chars
            console.log(html.substring(0, 500));
        }
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

testFetch();
