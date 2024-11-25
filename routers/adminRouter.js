//routers/adminRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get("/admin-home", adminController.index);

module.exports = router;