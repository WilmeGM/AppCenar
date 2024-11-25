//routers/commerceRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const commerceController = require('../controllers/commerceController');

router.get("/commerce-home", commerceController.index);

module.exports = router;