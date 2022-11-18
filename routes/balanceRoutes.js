const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balanceController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/").get(balanceController.getBalance);

module.exports = router;
