const axios = require("axios");
const crypto = require("crypto");
const API_KEY = "216923741401081b27ee25a1cae0226a6a4ac796";
const API_SECRET = "be2a73cdfe14602d67fbc30941412456e6ea31bc4bba2d284c5370227049948d";
const API_MEMO = "cryptotredingbot";
const BASE_URL = "https://api-cloud.bitmart.com";

// Get current timestamp
function get_timestamp() {
  return new Date().getTime().toString();
}

// Generate signature
function generate_signature(timestamp, body) {
  const message = `${timestamp}#${API_MEMO}#${body}`;
  return crypto.createHmac("sha256", API_SECRET).update(message).digest("hex");
}

// Variable to track current action
let currentAction = "buy";

// Place order
async function place_order(sideAction) {
  const path = "/spot/v2/submit_order";
  const timestamp = get_timestamp();
  const body = {
    size: 1,
    price: 5,
    side: sideAction, // Use sideAction parameter to determine buy or sell
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
    console.log(response.data);
  } catch (error) {
    if (error.response.data.message === 'Balance not enough') {
      throw new Error('Balance not enough');
    } else {
      console.error(`Error placing ${sideAction} order:`);
      console.error(error.response.data);
    }
  }
}

const tradeTime = 1;
const milliseconds = tradeTime * 60 * 1000;
console.log(milliseconds, "milliseconds");
const limit = 4;
console.log(milliseconds - 10000);
console.log((milliseconds - 10000) / limit);

const buySell = async () => {
  try {
    if (currentAction === "buy") {
      await place_order("buy");
      currentAction = "sell"; // Toggle to sell
    } else {
      await place_order("sell");
      currentAction = "buy"; // Toggle to buy
    }
  } catch (error) {
    // clearInterval(interval);
    console.log(error); // Clear the interval if there's an error
  }
};

const interval = setInterval(buySell, (milliseconds - 10000) / limit);

setTimeout(function () {
  clearInterval(interval);
  console.log("Time limit reached.");
}, milliseconds);


// mai ek crypta treading bot bana raha hu jo volume genrate karne ka kaam karega isme aisa hai ki jab koi ek time decide karega use time mai buying or selling hogi,pahle buy or sell hoga samjho agar buy hua to thode time mai sell bhi ho jayega ekdam jaldi. step aisa hoga ki ek user frotend se time, limit decide karega usko save karega fhir vo data node js mai store hoga 


// mai ek crypta treading bot bana raha hu jo bot volume genrate karne ka kaam karega isme aisa hai ki jab koi ek time or limit  decide karega uss time mai buying or selling hogi,pahle buy or sell(koi bhi ho sakta) samjho agar buy hua to thode time mai sell bhi ho jayega ekdam jaldi or vo diye gaye time ek under hoga har limit ke hisab se. eg. jaise 2 min diya hia or limit 6 hai to buy 3 or selling teen baar but  buying or selling ke bech mai gap nahi aana chaiye jada kuch seconds ka he hona chaiye. samjho ek baar buy hua to sell ho jana chaiye fhir time mange karke next buy or thode der baad sell aise he flow chlte rahna chaiye time tak hone se pahle or limit tak pahuchane 


// step aisa hoga ki ek user frotend se time, limit decide karega usko save karega fhir vo data node js mai store hoga fhir waha se data lega or buy or sell prform karega 
