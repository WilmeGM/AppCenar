// routers/auth.js
//@ts-nocheck

const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/login", authController.GetLogin);
router.post("/login", authController.PostLogin);
router.post("/logout", authController.Logout);

router.get("/signup", authController.GetSignup);
router.post("/signup", authController.PostSignup);

router.get("/signup-commerce", authController.GetSignupCommerce);
router.post("/signup-commerce", authController.PostSignupCommerce);

module.exports = router;
