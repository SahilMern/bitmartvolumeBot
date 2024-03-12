console.log("JAI HANUMAN JI ");
const axios = require("axios");
const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const API_KEY = "216923741401081b27ee25a1cae0226a6a4ac796";
const API_SECRET = "be2a73cdfe14602d67fbc30941412456e6ea31bc4bba2d284c5370227049948d";
const API_MEMO = "cryptotredingbot";
const BASE_URL = "https://api-cloud.bitmart.com";
let currentAction = "buy";

const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server

// WebSocket connection handler
wss.on("connection", function connection(ws) {
  console.log("WebSocket connected");

  // Error handler
  ws.on("error", function (error) {
    console.error("WebSocket error:", error);
  });
});

// Get current timestamp
function get_timestamp() {
  return new Date().getTime().toString();
}

// Generate signature
function generate_signature(timestamp, body) {
  const message = `${timestamp}#${API_MEMO}#${body}`;
  return crypto.createHmac("sha256", API_SECRET).update(message).digest("hex");
}

const getOverallprice = async () => {
  try {
    const bestBidPrice = await axios.get(
      "https://api-cloud.bitmart.com/spot/v1/ticker_detail?symbol=DEOD_USDT"
    );
    console.log(bestBidPrice.data.data, "bestBidPrice");
    const num1 = bestBidPrice.data.data.best_ask;
    const num2 = bestBidPrice.data.data.best_bid;
    return num1;
  } catch (error) {
    console.error("Error fetching best bid price:", error);
    return null;
  }
};

// Function to place order
async function place_order(side, symbol) {
  const path = "/spot/v2/submit_order";
  const getPrice = await getOverallprice();
  const timestamp = get_timestamp();
  const size = currentAction === "buy" ? 5 / getPrice : 5 * 10; // Adjust size based on currentAction
  const body = {
    size: size,
    price: getPrice,
    side: side,
    symbol: symbol,
    type: "limit",
  };
  const headers = {
    "Content-Type": "application/json",
    "X-BM-KEY": API_KEY,
    "X-BM-TIMESTAMP": timestamp,
    "X-BM-SIGN": generate_signature(timestamp, JSON.stringify(body)),
  };
  const url = BASE_URL + path;
  try {
    const response = await axios.post(url, body, { headers });
    console.log(response.data);
  } catch (error) {
    console.error(`Error:`);
    console.error(error.response.data);
    sendWebSocketNotification(error.response.data); // Send WebSocket notification to frontend
  }
}

// Function to send WebSocket notification to frontend
function sendWebSocketNotification(errorData) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "error", data: errorData }));
    }
  });
}

// Function to continuously alternate buy and sell orders
async function alternate_orders() {
  while (true) {
    // Detect current action and place order accordingly
    if (currentAction === "buy") {
      await place_order("buy", "DEOD_USDT");
      currentAction = "sell"; // Switch action to sell
    } else {
      await place_order("sell", "DEOD_USDT");
      currentAction = "buy"; // Switch action to buy
    }
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  alternate_orders(); // Start alternating orders
});
