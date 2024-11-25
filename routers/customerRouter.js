//routers/adminRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get("/customer-home", customerController.index);

module.exports = router;