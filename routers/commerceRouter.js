//routers/commerceRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const commerceController = require('../controllers/commerceController');
const authMiddleware = require("../middlewares/authMiddleware");
const Roles = require("../enums/roles");

router.get("/commerce-home",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.index);

module.exports = router;