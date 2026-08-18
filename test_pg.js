const url = 'https://constrain-skyline-cubical.ngrok-free.dev/api/addpg/';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyb21lZXQ5MDExIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTc4NzQ4ODU1OX0.27I0tUwMEmUAeJp01ns1WWBCSuHaM1MC8dNl8tyKIXs';

fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
}).then(res => res.text()).then(text => {
    try {
        console.log(JSON.stringify(JSON.parse(text), null, 2));
    } catch (e) {
        console.log("TEXT:", text);
    }
}).catch(err => console.error(err));
