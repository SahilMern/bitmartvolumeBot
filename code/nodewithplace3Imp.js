const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();

const API_KEY = 'your_api_key';
const API_SECRET = 'your_api_secret';
const API_MEMO = 'cryptotredingbot';
const BASE_URL = 'https://api-cloud.bitmart.com';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/tradingData', { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose schema
const tradingDataSchema = new mongoose.Schema({
    limit: Number,
    time: Number
});

const TradingData = mongoose.model('TradingData', tradingDataSchema);

// Get current timestamp
function getTimestamp() {
    return new Date().getTime().toString();
}

// Generate signature
function generateSignature(timestamp, body) {
    const message = `${timestamp}#${API_MEMO}#${body}`;
    return crypto.createHmac('sha256', API_SECRET).update(message).digest('hex');
}

// Place order
async function placeOrder(sideAction) {
    const path = '/spot/v2/submit_order';
    const timestamp = getTimestamp();
    const body = {
        size: 1,
        price: 5,
        side: sideAction,
        symbol: 'DEOD_USDT',
        type: 'limit',
    };
    const headers = {
        'Content-Type': 'application/json',
        'X-BM-KEY': API_KEY,
        'X-BM-TIMESTAMP': timestamp,
        'X-BM-SIGN': generateSignature(timestamp, JSON.stringify(body)),
    };
    const url = BASE_URL + path;
    try {
        const response = await axios.post(url, body, { headers });
        console.log(response.data);
    } catch (error) {
        console.error(`Error placing ${sideAction} order:`);
        console.error(error.response.data);
    }
}

// Buy or sell function based on current action
async function buyOrSell(currentAction) {
    try {
        await placeOrder(currentAction);
    } catch (error) {
        console.error(error);
    }
}

// Function to start trading
async function startTrading() {
    try {
        // Fetch data from database
        const tradingData = await TradingData.findOne().sort({ _id: -1 }).exec();
        const { limit, time } = tradingData;

        // Calculate milliseconds for time interval
        const milliseconds = time * 60 * 1000;

        // Perform buying and selling actions within the specified time and limit
        let count = 0;
        const intervalId = setInterval(async () => {
            if (count < limit) {
                await buyOrSell(count % 2 === 0 ? 'buy' : 'sell');
                count++;
            } else {
                clearInterval(intervalId);
                console.log('Trading completed.');
            }
        }, milliseconds);
    } catch (error) {
        console.error('Error starting trading:', error);
    }
}

// Start trading when server starts
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    startTrading();
});
