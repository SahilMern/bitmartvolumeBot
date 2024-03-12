console.log("JAI HANUMAN JI ");
const axios = require("axios");
const { log } = require("console");
const crypto = require("crypto");
const API_KEY = "216923741401081b27ee25a1cae0226a6a4ac796";
const API_SECRET =
  "be2a73cdfe14602d67fbc30941412456e6ea31bc4bba2d284c5370227049948d";
const API_MEMO = "cryptotredingbot";
const BASE_URL = "https://api-cloud.bitmart.com";
let currentAction = "buy";
let buyAmount = 0; // Variable to store the amount used for buying

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
    const num1 = bestBidPrice.data.data.best_ask;
    const num2 = bestBidPrice.data.data.best_bid;
    return num1;
  } catch (error) {
    console.error("Error fetching best bid price:", error);
  }
};

// Function to place order
async function place_order(side, symbol, size, price) {
  const path = "/spot/v2/submit_order";
  const timestamp = get_timestamp();
  const body = {
    size: size,
    price: price,
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
  }
}

// Function to generate a random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to continuously alternate buy and sell orders
async function alternate_orders() {
  while (true) {
    // Detect current action and place order accordingly
    if (currentAction === "buy") {
      const getPrice = await getOverallprice();
      const randomSize = getRandomNumber(6, 20); // Generate random size between 6 and 20
      console.log(randomSize, "size");
      console.log(getPrice, "getPrice");
      const size = randomSize/getPrice;
      console.log(size);
      await place_order("buy", "DEOD_USDT", size, getPrice);
      buyAmount = size / getPrice;
      console.log(buyAmount); // Store the amount used for buying
      currentAction = "sell"; // Switch action to sell
    } else {
      const size = getRandomNumber(6, 20); // Generate random size between 6 and 20
      console.log(buyAmount, "buyAmount");
      process.exit()
      await place_order("sell", "DEOD_USDT", size, buyAmount); // Sell using the stored amount
      currentAction = "buy"; // Switch action to buy
    }
  }
}

const startBot = async () => {
    await alternate_orders()
};

const stopBot = async () => {
    await alternate_orders();
};
module.exports = {startBot, stopBot};
