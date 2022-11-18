const express = require("express");
const router = express.Router();
const currenciesController = require("../controllers/currenciesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/").get(currenciesController.getAllCurrencies);

module.exports = router;
