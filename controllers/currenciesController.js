const { sixDecimals } = require("../utils/formatting");
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const symbols = [
  "BTCBUSD",
  "ETHBUSD",
  "BNBBUSD",
  "SOLBUSD",
  "AVAXBUSD",
  "DOTBUSD",
  "MATICBUSD",
  "ADABUSD",
  "XRPBUSD",
];

let currencies = ["", "", "", "", "", "", "", "", ""];

async function fetchCurrency(symbol) {
  try {
    const response = await axios.get(
      `https://www.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    return response;
  } catch (e) {
    console.log(e);
    return;
  }
}

// @desc Get all currencies
// @route GET /currency
// @access Private
const getAllCurrencies = asyncHandler(async (req, res) => {
  try {
    Promise.all([
      fetchCurrency(symbols[0]),
      fetchCurrency(symbols[1]),
      fetchCurrency(symbols[2]),
      fetchCurrency(symbols[3]),
      fetchCurrency(symbols[4]),
      fetchCurrency(symbols[5]),
      fetchCurrency(symbols[6]),
      fetchCurrency(symbols[7]),
      fetchCurrency(symbols[8]),
    ]).then(function (results) {
      currencies = [
        sixDecimals(results[0].data.price),
        sixDecimals(results[1].data.price),
        sixDecimals(results[2].data.price),
        sixDecimals(results[3].data.price),
        sixDecimals(results[4].data.price),
        sixDecimals(results[5].data.price),
        sixDecimals(results[6].data.price),
        sixDecimals(results[7].data.price),
        sixDecimals(results[8].data.price),
      ];

      if (currencies[0]) {
        res.status(201).json(currencies);
      } else {
        res.status(400).json({ message: "Could not fetch currencies." });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = {
  getAllCurrencies,
};
