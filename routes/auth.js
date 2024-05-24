const express = require("express");

const router = express.Router();

const authenticateJWT = require("../middlewares/auth");
const { signup, login, updateUserInfo, getUserInfo } = require("../controllers/auth");

router.post("/signup", signup);
router.post("/login", login);
router.put(`/update-user-info`, authenticateJWT, updateUserInfo);
router.get(`/get-user-info`, authenticateJWT, getUserInfo);

module.exports = router;
