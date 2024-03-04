const axios = require('axios');
const crypto = require('crypto');

const API_KEY = '216923741401081b27ee25a1cae0226a6a4ac796';
// const secretKey = "be2a73cdfe14602d67fbc30941412456e6ea31bc4bba2d284c5370227049948d";
// const apiKey = "216923741401081b27ee25a1cae0226a6a4ac796";
const API_SECRET = 'be2a73cdfe14602d67fbc30941412456e6ea31bc4bba2d284c5370227049948d';
const API_MEMO = 'cryptotredingbot';

const BASE_URL = 'https://api-cloud.bitmart.com';

// Get current timestamp
function get_timestamp() {
    return new Date().getTime().toString();
}

// Generate signature
function generate_signature(timestamp, body) {
    const message = `${timestamp}#${API_MEMO}#${body}`;
    return crypto.createHmac('sha256', API_SECRET).update(message).digest('hex');
}

// Place order
async function place_order() {
    const path = '/spot/v2/submit_order';
    const timestamp = get_timestamp();
    const body = {
        size: 1,
        price: 5,
        side: 'sell',
        symbol: 'DEOD_USDT',
        type: 'limit',
    };
    const headers = {
        'Content-Type': 'application/json',
        'X-BM-KEY': API_KEY,
        'X-BM-TIMESTAMP': timestamp,
        'X-BM-SIGN': generate_signature(timestamp, JSON.stringify(body)),
    };
    const url = BASE_URL + path;
    try {
        const response = await axios.post(url, body, { headers });
        console.log(response.data);
    } catch (error) {
        console.error(`Error:`);
        console.error(error.response.data);
    }
}

place_order();