const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

const API_KEY = '216923741401081b27ee25a1cae0226a6a4ac796';
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

// Define route to handle button click event
app.post('/place-order', async (req, res) => {
    // Fetch data from database (e.g., time and limit)
    const time = 10; // Example time fetched from database
    const limit = 100; // Example limit fetched from database

    // Place order with fetched parameters
    const response = await place_order(time, limit);
    
    // Send response back to client
    res.send(response);
});

// Place order function with parameters
async function place_order(time, limit) {
    const path = '/spot/v2/submit_order';
    const timestamp = get_timestamp();
    const body = {
        size: 1,
        price: 5,
        side: 'buy/sell',
        symbol: 'DEOD_USDT',
        type: 'limit',
        time, // Use fetched time parameter
        limit, // Use fetched limit parameter
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
        return response.data;
    } catch (error) {
        console.error(`Error:`);
        console.error(error.response.data);
        return error.response.data;
    }
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
