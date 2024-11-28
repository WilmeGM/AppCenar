//routers/adminRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require("../middlewares/authMiddleware");
const Roles = require("../enums/roles");

router.get("/customer-home",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.index);

module.exports = router;