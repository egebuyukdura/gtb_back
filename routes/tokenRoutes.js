const express = require("express");
const router = express.Router();
const tokenStaticsController = require("../controllers/tokenStaticsController");
const tokenDynamicsController = require("../controllers/tokenDynamicsController");
const tokenPricesController = require("../controllers/tokenPricesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/statics").get(tokenStaticsController.getTokenStatics);
router.route("/dynamics").get(tokenDynamicsController.getTokenDynamics);
router.route("/prices/buy").get(tokenPricesController.getTokenBuyPrice);
router.route("/prices/sell").get(tokenPricesController.getTokenSellPrice);

module.exports = router;
