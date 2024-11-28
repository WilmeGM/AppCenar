//routers/adminRouter.js
//@ts-nocheck

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require("../middlewares/authMiddleware");
const Roles = require("../enums/roles");

router.get("/admin-home",
    authMiddleware.isAuthenticated,
    authMiddleware.hasRole(Roles.ADMIN),
    adminController.index);

router.get("/customer-list", adminController.customerList);
router.post("/activate-customer", adminController.activateCustomer);
router.post("/inactivate-customer", adminController.inactivateCustomer);

router.get("/delivery-list", adminController.deliveryList);
router.post("/activate-delivery", adminController.activateDelivery);
router.post("/inactivate-delivery", adminController.inactivateDelivery);

router.get("/commerce-list", adminController.commerceList);
router.post("/activate-commerce", adminController.activateCommerce);
router.post("/inactivate-commerce", adminController.inactivateCommerce);

router.get("/settings", adminController.getSettings);
router.get("/edit-settings/:itbisId", adminController.getEditSettings);
router.post("/edit-settings", adminController.postEditSettings);

router.get("/admin-list", adminController.adminList);
router.get("/save-admin", adminController.getSaveAdmin);
router.post("/save-admin", adminController.postSaveAdmin);
router.post("/inactivate-admin", adminController.inactivateAdmin);
router.post("/activate-admin", adminController.activateAdmin);
router.get("/edit-admin/:adminId", adminController.getEditAdmin);
router.post("/edit-admin", adminController.postEditAdmin);

router.get("/commerce-types-list", adminController.commerceTypeList);
router.get("/save-commerce-type", adminController.getSaveCommerceType);
router.post("/save-commerce-type", adminController.postSaveCommerceType);
router.get("/edit-commerce-type/:commerceTypeId", adminController.getEditCommerceType);
router.post("/edit-commerce-type", adminController.postEditCommerceType);
router.post("/delete-commerce-type", adminController.deleteCommerceType);

module.exports = router;