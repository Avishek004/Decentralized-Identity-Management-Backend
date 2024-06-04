const express = require("express");

const router = express.Router();

const authenticateJWT = require("../middlewares/auth");
const { signup, login, updateUserInfo, getUserInfo, authenticate, loginWithMetamask, getNonce } = require("../controllers/auth");

router.get("/get-nonce", getNonce);
router.post("/signup", signup);
router.post("/login", login);
router.post("/login-with-metamask", loginWithMetamask);
router.put(`/update-user-info`, authenticateJWT, updateUserInfo);
router.get(`/get-user-info`, authenticateJWT, getUserInfo);
router.get(`/authenticate`, authenticateJWT, authenticate);

module.exports = router;
