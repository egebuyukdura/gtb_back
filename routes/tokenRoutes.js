const express = require("express");
const router = express.Router();
const tokenStaticsController = require("../controllers/tokenStaticsController");
const tokenDynamicsController = require("../controllers/tokenDynamicsController");
const tokenPricesController = require("../controllers/tokenPricesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/statics").post(tokenStaticsController.getTokenStatics);
router.route("/dynamics").post(tokenDynamicsController.getTokenDynamics);
router.route("/prices/buy").post(tokenPricesController.getTokenBuyPrice);
router.route("/prices/sell").post(tokenPricesController.getTokenSellPrice);

module.exports = router;
