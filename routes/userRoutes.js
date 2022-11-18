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
  .get(walletsController.getAllWallets)
  .post(walletsController.createWallet)
  .patch(walletsController.updateWallet)
  .delete(walletsController.deleteWallet);

router
  .route("/activeOrders")
  .get(activeOrdersController.getActiveOrders)
  .post(activeOrdersController.createActiveOrder)
  .patch(activeOrdersController.updateActiveOrder)
  .delete(activeOrdersController.deleteActiveOrder);

router
  .route("/pastOrders")
  .get(pastOrdersController.getPastOrders)
  .post(pastOrdersController.createPastOrder)
  .patch(pastOrdersController.updatePastOrder)
  .delete(pastOrdersController.deletePastOrder);

module.exports = router;
