console.log("JAI HANUMAN JI ");
const axios = require("axios");
const crypto = require("crypto");
const API_KEY = "216923741401081b27ee25a1cae0226a6a4ac796";
const API_SECRET =
  "be2a73cdfe14602d67fbc30941412456e6ea31bc4bba2d284c5370227049948d";
const API_MEMO = "cryptotredingbot";
const BASE_URL = "https://api-cloud.bitmart.com";
let time = 0;
let isBuy = true; // Variable to track the current order type, initially set to buy

const callRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function get_timestamp() {
  return new Date().getTime().toString();
}

// Generate signature
function generate_signature(timestamp, body) {
  const message = `${timestamp}#${API_MEMO}#${body}`;
  return crypto.createHmac("sha256", API_SECRET).update(message).digest("hex");
}

async function getTickerPrice(symbol) {
  try {
    const response = await axios.get(
      `https://api-cloud.bitmart.com/spot/quotation/v3/ticker?symbol=DEOD_USDT`
    );

    console.log(response.data.data);
    const highPrice = response.data.data.ask_px;
    const lowPrice = response.data.data.bid_px;
     
    const a = 1;
    const b = 2;

    function generateRandomBetween(a, b) {
      // Generate a random number between a and b (inclusive)
      const random = Math.floor(Math.random() * (b - a - 1)) + a + 1;
      return random;
    }

    const randomNumber = generateRandomBetween(a, b);
    console.log("Random number between", a, "and", b, ":", randomNumber);

    process.exit();
    return parseFloat(price);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to create buy or sell order based on isBuy variable
async function place_order() {
  const path = "/spot/v2/submit_order";
  const timestamp = get_timestamp();
  const side = isBuy ? "buy" : "sell"; // Determine side based on isBuy variable
  const cureentpriceOfDeod = await getTickerPrice();
  console.log(
    5 / cureentpriceOfDeod,
    "cureentpriceOfDeod",
    20 / cureentpriceOfDeod
  );
  // console.log(5 * cureentpriceOfDeod, "cureentpriceOfDeod", 20* cureentpriceOfDeod);
  //   process.exit()
  const body = {
    size: isBuy ? 5 / cureentpriceOfDeod : 5 / cureentpriceOfDeod,
    price: cureentpriceOfDeod,
    side: side,
    symbol: "DEOD_USDT",
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
    console.log(response.data, "DATA WHEN BUY SELL CALL");
    const number = await callRandom(2, 4);
    console.log(number, "Generated Random Number");
    time = number * 60000; // Convert minutes to milliseconds
    console.log(time, "TIME IN MILLISECONDS");
    isBuy = !isBuy; // Toggle isBuy variable for the next order
    setTimeout(place_order, time);
  } catch (error) {
    console.error(`Error:`);
    console.error(error.response);
  }
}

// Start placing orders initially
place_order();
