// routers/adminRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require("../middlewares/authMiddleware");
const Roles = require("../enums/roles");

router.get(
    "/admin-home",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.index
);

//#region Customer
router.get(
    "/customer-list",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.customerList
);
router.post(
    "/activate-customer",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.activateCustomer
);
router.post(
    "/inactivate-customer",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.inactivateCustomer
);
//#endregion

//#region Delivery
router.get(
    "/delivery-list",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.deliveryList
);
router.post(
    "/activate-delivery",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.activateDelivery
);
router.post(
    "/inactivate-delivery",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.inactivateDelivery
);
//#endregion

//#region Commerce
router.get(
    "/commerce-list",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.commerceList
);
router.post(
    "/activate-commerce",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.activateCommerce
);
router.post(
    "/inactivate-commerce",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.inactivateCommerce
);
//#endregion

//#region Seetting
router.get(
    "/settings",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.getSettings
);
router.get(
    "/edit-settings/:itbisId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.getEditSettings
);
router.post(
    "/edit-settings",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.postEditSettings
);
//#endregion

//#region Admin
router.get(
    "/admin-list",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.adminList
);
router.get(
    "/save-admin",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.getSaveAdmin
);
router.post(
    "/save-admin",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.postSaveAdmin
);
router.post(
    "/inactivate-admin",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.inactivateAdmin
);
router.post(
    "/activate-admin",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.activateAdmin
);
router.get(
    "/edit-admin/:adminId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.getEditAdmin
);
router.post(
    "/edit-admin",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.postEditAdmin
);
//#endregion

//#region Commerce Type
router.get(
    "/commerce-types-list",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.commerceTypeList
);
router.get(
    "/save-commerce-type",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.getSaveCommerceType
);
router.post(
    "/save-commerce-type",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.postSaveCommerceType
);
router.get(
    "/edit-commerce-type/:commerceTypeId",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.getEditCommerceType
);
router.post(
    "/edit-commerce-type",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.postEditCommerceType
);
router.post(
    "/delete-commerce-type",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.deleteCommerceType
);
//#endregion

module.exports = router;
