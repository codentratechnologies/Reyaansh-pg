const axios = require('axios');

axios.post('https://constrain-skyline-cubical.ngrok-free.dev/api/login/', {
    username: 'romeet9011',
    password: 'Romit@123'
}).then(res => {
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
}).catch(err => {
    console.error("ERROR:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
});
