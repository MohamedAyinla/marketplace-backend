const express = require("express");
const {
  register,
  login,
  protectedRoute,
  refresh,
} = require("./userController");
const {
  authMiddleware,
  refreshMiddleware,
} = require("../middlewares/tokenValidator");

const router = express.Router();

// Routes utilisateur
router.post("/register", register);
router.post("/login", login);
// à titre d'exemple
router.get("/protected", authMiddleware, protectedRoute);
router.post("/refresh", refreshMiddleware, refresh);

module.exports = router;
