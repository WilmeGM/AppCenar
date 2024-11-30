//routers/customerRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require("../middlewares/authMiddleware");
const Roles = require("../enums/roles");

router.get("/customer-dashboard",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.index);

router.get("/my-profile",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.myProfile);

router.post("/update-my-profile",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.updateProfile);

router.get("/my-addresses",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.myAddresses);

router.get("/save-address",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getSaveAddress);

router.post("/save-address",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.postSaveAddress);

router.get("/edit-address/:addressId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getEditAddress);

router.post("/edit-address",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.postEditAddress);

router.post("/delete-address",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.deleteAddress);

router.get("/customer-home",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getCustomerHome);

router.get("/commerce-customer-list/:commerceTypeId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getCommercesByCategory);

router.post("/markupAsFavorite",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.markupAsFavorite);

router.get("/my-favorites",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getMyFavorites);

router.post("/remove-favorite",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.removeFavorite);

router.get("/catalog/:commerceId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getCatalog);

router.post("/cart/add",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.addToCart);

router.post("/cart/remove",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.removeFromCart);

router.get("/checkout",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getCheckout);

router.post("/order/create",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.createOrder);

router.get("/my-orders",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getMyOrders);

router.get("/my-orders/:orderId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.CUSTOMER),
    customerController.getOrderDetails);


module.exports = router;