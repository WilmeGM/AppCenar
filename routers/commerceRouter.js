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

router.get("/commerce-profile",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.getCommerceProfile);

router.post("/edit-commerce",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.editCommerce);

router.get("/category-list",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.categoryList);

router.get("/save-category",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.getSaveCategory);

router.post("/save-category",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.postSaveCategory);

router.get("/edit-category/:categoryId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.getEditCategory);

router.post("/edit-category",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.postEditCategory);

router.post("/delete-category",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.deleteCategory);

router.get('/product-list',
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.productList);

router.get('/save-product',
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.getCreateProduct);

router.post('/save-product',
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.postCreateProduct);

router.get('/edit-product/:productId',
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.getEditProduct);

router.post('/edit-product',
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.postEditProduct);

router.post('/delete-product/:productId',
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.COMMERCE),
    commerceController.deleteProduct);

router.get("/commerce-orders",
    authMiddleware.isAuthenticated,
    commerceController.getOrders);

router.get("/commerce-order-details/:orderId",
    authMiddleware.isAuthenticated,
    commerceController.getOrderDetails);

router.post("/commerce-assign-delivery",
    authMiddleware.isAuthenticated,
    commerceController.assignDelivery);

module.exports = router;