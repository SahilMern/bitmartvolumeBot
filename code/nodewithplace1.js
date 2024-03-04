const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();

const API_KEY = '216923741401081b27ee25a1cae0226a6a4ac796';
const API_SECRET = 'be2a73cdfe14602d67fbc30941412456e6ea31bc4bba2d284c5370227049948d';
const API_MEMO = 'cryptotredingbot';
const BASE_URL = 'https://api-cloud.bitmart.com';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/tradingData', { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose schema
const tradingDataSchema = new mongoose.Schema({
    time: Number,
    limit: Number
});

const TradingData = mongoose.model('TradingData', tradingDataSchema);

// Get current timestamp
function get_timestamp() {
    return new Date().getTime().toString();
}

// Generate signature
function generate_signature(timestamp, body) {
    const message = `${timestamp}#${API_MEMO}#${body}`;
    return crypto.createHmac('sha256', API_SECRET).update(message).digest('hex');
}

// Start trading bot
app.post('/start-bot', async (req, res) => {
    try {
        // Fetch data from database
        const dataFromDB = await TradingData.findOne().sort({ _id: -1 }).exec();
        
        // Place order with fetched parameters
        const response = await place_order(dataFromDB.time, dataFromDB.limit);
        res.json(response);
    } catch (error) {
        console.error('Error starting trading bot:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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
        time,
        limit
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
        console.error('Error placing order:', error.response.data);
        throw new Error('Error placing order');
    }
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
