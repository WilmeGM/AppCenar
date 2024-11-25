//routers/adminRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.get("/delivery-home", deliveryController.index);

module.exports = router;