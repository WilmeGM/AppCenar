//controllers/deliveryController.js

const Delivery = require('../models/delivery/delivery');
const Commerce = require('../models/commerce/commerces');
const OrderProduct = require("../models/OrderProduct/orderProduct");
const Address = require("../models/customer/directions");
const Product = require("../models/commerce/products");
const Order = require("../models/customer/orders");

exports.index = (req, res) => {
    res.render("delivery/index", {
        pageTitle: "Delivery Home - AppCenar"
    });
};

exports.getProfile = (req, res) => {
    const deliveryId = req.session.user.id;

    Delivery.findOne({ where: { id: deliveryId } })
        .then(delivery => {
            if (!delivery) {
                req.flash('errors', 'Delivery not found.');
                return res.redirect('/delivery-home');
            }

            res.render('delivery/delivery-profile', {
                pageTitle: 'My Profile',
                delivery: delivery.dataValues,
            });
        }).catch(error => {
            console.error(error);
            req.flash('errors', 'An error occurred while fetching the delivery profile.');
            res.redirect('/delivery-home');
        });
};

exports.updateProfile = (req, res) => {
    const deliveryId = req.session.user.id;
    const { name, lastName, phone } = req.body;
    const profilePicture = req.file;

    if (!name || !lastName || !phone) {
        req.flash('errors', 'All fields except profile picture are required.');
        return res.redirect('/my-profile');
    }

    Delivery.findOne({ where: { id: deliveryId } })
        .then(delivery => {
            if (!delivery) {
                req.flash('errors', 'Delivery not found.');
                return res.redirect('/delivery-home');
            }

            const updatedProfilePicture = profilePicture
                ? '/' + profilePicture.path
                : delivery.profilePicture;

            return delivery.update({
                name,
                lastName,
                phone,
                profilePicture: updatedProfilePicture,
            });
        }).then(() => {
            req.flash('success', 'Profile updated successfully.');
            res.redirect('/delivery-home');
        }).catch(error => {
            console.error(error);
            req.flash('errors', 'An error occurred while updating the profile.');
            res.redirect('/my-profile');
        });
};

exports.getAssignedOrders = async (req, res) => {
    const deliveryId = req.session.user.id; // Obtener el ID del delivery logueado

    try {
        const orders = await Order.findAll({
            where: { deliveryId },
            include: [
                {
                    model: Commerce,
                    attributes: ['username', 'logo'],
                },
                {
                    model: OrderProduct,
                    as: "orderProducts",
                    attributes: ['quantity'],
                }
            ],
            order: [['createdAt', 'DESC']], // Ordenar desde el más reciente al más antiguo
        });

        const ordersToView = orders.map(order => ({
            id: order.id,
            commerceName: order.commerce.username,
            commerceLogo: order.commerce.logo,
            status: order.status,
            total: order.total,
            productCount: order.orderProducts.length,
            date: order.date,
            time: order.hour,
        }));

        res.render("delivery/assigned-orders", {
            pageTitle: "My Assigned Orders",
            orders: ordersToView,
            hasOrders: ordersToView.length > 0,
        });
    } catch (error) {
        console.error(error);
        req.flash("errors", "An error occurred while retrieving your assigned orders.");
        res.redirect("/delivery-dashboard");
    }
};

exports.getOrderDetails = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: Commerce,
                    attributes: ['username', 'logo'],
                },
                {
                    model: Address,
                    attributes: ['name', 'description'],
                },
                {
                    model: OrderProduct,
                    as: "orderProducts",
                    include: {
                        model: Product,
                        attributes: ['name', 'price', 'image'],
                    },
                }
            ],
        });

        if (!order) {
            req.flash("errors", "Order not found.");
            return res.redirect("/delivery-dashboard");
        }

        const orderDetails = {
            id: order.id,
            commerceName: order.commerce.username,
            commerceLogo: order.commerce.logo,
            status: order.status,
            total: order.total,
            date: order.date,
            time: order.hour,
            address: order.address,
            products: order.orderProducts.map(op => ({
                name: op.product.name,
                price: op.product.price,
                image: op.product.image,
            })),
        };

        res.render("delivery/order-details", {
            pageTitle: "Order Details",
            order: orderDetails,
            isInProcess: order.status === "in-process",
        });
    } catch (error) {
        console.error(error);
        req.flash("errors", "An error occurred while retrieving the order details.");
        res.redirect("/delivery-dashboard");
    }
};

exports.completeOrder = async (req, res) => {
    const orderId = req.body.orderId;
    const deliveryId = req.session.user.id;

    try {
        const order = await Order.findOne({ where: { id: orderId, deliveryId } });

        if (!order || order.status !== "in-process") {
            req.flash("errors", "Invalid order or order is not in process.");
            return res.redirect(`/delivery-order-details/${orderId}`);
        }

        // Marcar el pedido como completado
        await order.update({ status: "completed" });

        // Cambiar el estado del delivery a disponible
        const delivery = await Delivery.findByPk(deliveryId);
        await delivery.update({ status: "available" });

        req.flash("success", "Order completed successfully.");
        res.redirect("/delivery-home");
    } catch (error) {
        console.error(error);
        req.flash("errors", "An error occurred while completing the order.");
        res.redirect(`/delivery-order-details/${orderId}`);
    }
};