const express = require("express");
const router = express.Router();
const tokenStaticsController = require("../controllers/tokenStaticsController");
const tokenDynamicsController = require("../controllers/tokenDynamicsController");
const tokenPricesController = require("../controllers/tokenPricesController");
const tokenBasicTxController = require("../controllers/tokenBasicTxController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/statics").post(tokenStaticsController.getTokenStatics);
router.route("/dynamics").post(tokenDynamicsController.getTokenDynamics);

router.route("/prices/buy").post(tokenPricesController.getTokenBuyPrice);
router.route("/prices/sell").post(tokenPricesController.getTokenSellPrice);

router.route("/transactions/buy/standard").post(tokenBasicTxController.basicBuyTx);
router.route("/transactions/buy/custom").post(tokenBasicTxController.basicBuyTxCustomGas);
router.route("/transactions/sell/standard").post(tokenBasicTxController.basicSellTx);
router.route("/transactions/sell/custom").post(tokenBasicTxController.basicSellTxCustomGas);

module.exports = router;
