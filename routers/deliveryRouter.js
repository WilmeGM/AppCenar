//routers/adminRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require("../middlewares/authMiddleware");
const Roles = require("../enums/roles");

router.get("/delivery-home",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.DELIVERY),
    deliveryController.index);

module.exports = router;