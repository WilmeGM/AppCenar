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

router.get('/my-delivery-profile',
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.DELIVERY),
    deliveryController.getProfile);

router.post(
    '/update-profile',
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.DELIVERY),
    deliveryController.updateProfile);

router.get("/delivery-assigned-orders",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.DELIVERY),
    deliveryController.getAssignedOrders);

router.get("/delivery-order-details/:orderId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.DELIVERY),
    deliveryController.getOrderDetails);

router.post("/delivery-complete-order",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.DELIVERY),
    deliveryController.completeOrder);

module.exports = router;