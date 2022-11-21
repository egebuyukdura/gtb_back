const express = require("express");
const router = express.Router();
const usersController = require("../controllers/database/usersController");
const walletsController = require("../controllers/database/walletsController");
const activeOrdersController = require("../controllers/database/activeOrdersController");
const pastOrdersController = require("../controllers/database/pastOrdersController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

router
  .route("/wallets")
  .post(walletsController.createWallet)
  .patch(walletsController.updateWallet)
  .delete(walletsController.deleteWallet);

router.route("/wallets/get").post(walletsController.getAllWallets);

router
  .route("/activeOrders")
  .post(activeOrdersController.createActiveOrder)
  .patch(activeOrdersController.updateActiveOrder)
  .delete(activeOrdersController.deleteActiveOrder);

router.route("/activeOrders/get").post(activeOrdersController.getActiveOrders);

router
  .route("/pastOrders")
  .post(pastOrdersController.createPastOrder)
  .patch(pastOrdersController.updatePastOrder)
  .delete(pastOrdersController.deletePastOrder);

router.route("/pastOrders/get").post(pastOrdersController.getPastOrders);

module.exports = router;
