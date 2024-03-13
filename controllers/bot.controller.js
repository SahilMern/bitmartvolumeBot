console.log("JAI SHREE RAM / JAI HANUMAN JI ");
const axios = require("axios");
const { log } = require("console");
const crypto = require("crypto");
const API_KEY = "216923741401081b27ee25a1cae0226a6a4ac796";
const API_SECRET =
  "be2a73cdfe14602d67fbc30941412456e6ea31bc4bba2d284c5370227049948d";
const API_MEMO = "cryptotredingbot";
const BASE_URL = "https://api-cloud.bitmart.com";
let currentAction = "buy";
let setedBuysize = 0;
let setBuyPrice = 0; // Variable to store the amount used for buying
console.log(setBuyPrice,"setBuyPrice");
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
  console.log(side, symbol, size, price);
  
  // await place_order("buy", "DEOD_USDT", size, getDeodPrice)
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
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function alternate_orders() {
  while (true) {
    // Detect current action and place order accordingly
    if (currentAction === "buy") {
      const getDeodPrice = await getOverallprice();
      console.log(getDeodPrice, "DEOD PRICE BETWEEN TWO NUMBERS");
      const randomUsdtPrice = randomNumber(6, 8);
      console.log(randomUsdtPrice, "RANDOM USDT PRICE");
      const size = Math.floor(randomUsdtPrice / getDeodPrice);
      console.log(size, "SIZE FOR BUY");
      // await place_order("buy", "DEOD_USDT", size, getDeodPrice);
      currentAction = "sell";
      setedBuysize= size;
      setBuyPrice =getDeodPrice;
      // process.exit()

      // setRandomSize = randomSizegenrate;
      // console.log(setRandomSize, "randomSize");
      // currentAction = "sell"; // Switch action to sell
      // setBuyPrice= getPrice;
      // console.log("I AM INSIDE BUY FUNCTION");
    } else {

      console.log(setBuyPrice,setedBuysize);
      const size = setedBuysize * setBuyPrice;
      console.log( size, "Size inside buy");
      // await place_order("sell", "DEOD_USDT", 3361 , 0.001511); // Sell using the stored amount
      currentAction = "buy"; // Switch action to buy
      console.log("I AM INSIDE SELL FUNCTION", currentAction);
    }

    // Introduce a delay of 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

const startBot = async () => {
  await alternate_orders();
};

const stopBot = async () => {
  await alternate_orders();
};
module.exports = { startBot, stopBot };
