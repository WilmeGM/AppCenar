//routers/auth.js
//@ts-nocheck

const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authRedirectMiddleware = require("../middlewares/authRedirectMiddleware");
const Roles = require("../enums/roles");

router.get("/", (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
});

router.get("/login", authRedirectMiddleware, authController.getLogin);
router.post("/login", authController.postLogin);

router.post("/logout", authController.logout);

router.get("/signup", authRedirectMiddleware, authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/signup-commerce", authRedirectMiddleware, authController.getSignupCommerce);
router.post("/signup-commerce", authController.postSignupCommerce);

router.get("/activate/:token", authController.getActivateAccount);

router.get("/reset", authRedirectMiddleware, authController.getReset);
router.post("/reset", authController.postResetPassword);
router.get("/new-password/:token", authRedirectMiddleware, authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;