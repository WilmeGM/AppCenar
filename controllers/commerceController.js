//controllers/commerceController.js
const Commerce = require('../models/commerce/commerces');
const Category = require('../models/commerce/categories');
const Product = require('../models/commerce/products');
const Order = require("../models/customer/orders");
const OrderProduct = require("../models/OrderProduct/orderProduct");
const Delivery = require('../models/delivery/delivery');

exports.index = (req, res) => {
    res.render("commerce/index", {
        pageTitle: "Commerce Home - AppCenar"
    });
};

exports.getCommerceProfile = (req, res) => {
    const commerceId = req.session.user.id;

    Commerce.findOne({ where: { id: commerceId } })
        .then(result => {
            const commerce = result.dataValues;

            res.render("commerce/commerce-profile", {
                pageTitle: "Commerce Profile",
                commerce: commerce
            });
        }).catch(error => {
            console.log(error);
        });
};

exports.editCommerce = (req, res) => {
    const logo = req.file;
    const openingTime = req.body.openingTime;
    const closingTime = req.body.closingTime;
    const phone = req.body.phone;
    const email = req.body.email;

    if (!openingTime || !closingTime || !phone || !email) {
        req.flash("errors", "All fields are required");
        return res.redirect("/commerce-profile");
    }

    Commerce.findOne({ where: { id: req.session.user.id } })
        .then(commerce => {
            if (!commerce) {
                req.flash("errors", "Commerce not found");
                return res.redirect("/commerce-profile");
            }

            const updatedLogo = logo ? "/" + logo.path : commerce.logo;

            return commerce.update({
                openingTime: openingTime,
                closingTime: closingTime,
                logo: updatedLogo,
                phone: phone,
                email: email
            });
        })
        .then(() => {
            req.flash("success", "Commerce profile updated successfully");
            res.redirect("/commerce-home");
        })
        .catch(error => {
            console.log(error);
            req.flash("errors", "An error occurred while updating the commerce profile");
            res.redirect(`/commerce-profile`);
        });
};

exports.categoryList = (req, res) => {
    const commerceId = req.session.user.id;

    Category.findAll({ where: { commerceId: commerceId } })
        .then(result => {
            const categories = result.map(c => c.dataValues);

            res.render("commerce/category-list", {
                pageTitle: "Category List",
                categories: categories,
                thereAreCategories: categories.length > 0
            });
        }).catch(error => {
            console.log(error);
        })
};

exports.getSaveCategory = (req, res) => {
    res.render("commerce/save-category", {
        pageTitle: "Save category"
    });
};

exports.postSaveCategory = (req, res) => {
    const name = req.body.name;
    const description = req.body.description;

    if (!name || !description) {
        req.flash("errors", "All fields are required");
        return res.redirect("/save-category");
    }

    Category.create({
        name: name,
        description: description,
        commerceId: req.session.user.id
    }).then(result => {
        req.flash("success", "Category created successfully");
        return res.redirect("/category-list");
    }).catch(error => {
        req.flash("errors", "An error ocurred while saving that category")
        console.log(error);
    });
};

exports.getEditCategory = (req, res) => {
    const categoryId = req.params.categoryId;

    Category.findOne({ where: { id: categoryId } })
        .then(result => {
            const category = result.dataValues;

            if (!category) {
                req.flash("errors", "Category not found");
                return res.redirect("/category-list");
            }

            res.render("commerce/edit-category", {
                pageTitle: "Edit category",
                category: category
            });
        }).catch(error => {
            console.log(error);
        })
};

exports.postEditCategory = (req, res) => {
    const categoryId = req.body.categoryId;
    const name = req.body.name;
    const description = req.body.description;

    if (!name || !description) {
        req.flash("errors", "All fields are required");
        return res.redirect("/category-list");
    }

    Category.update({
        name: name,
        description: description
    }, {
        where: { id: categoryId }
    }).then(result => {
        req.flash("success", "Category updated successfully");
        return res.redirect("/category-list");
    }).catch(error => {
        req.flash("errors", "An error ocurred while editing the category");
        console.log(error);
    });
};

exports.deleteCategory = (req, res) => {
    const categoryId = req.body.categoryId;

    Category.destroy({ where: { id: categoryId } })
        .then(result => {
            req.flash("success", "Category removed successfully");
            return res.redirect("/category-list");
        }).catch(error => {
            req.flash("errors", "An error ocurred while removing this category");
            console.log(error);
        });
};

exports.productList = (req, res) => {
    const commerceId = req.session.user.id;

    Product.findAll({
        where: { commerceId },
        include: [{ model: Category, attributes: ['name'] }],
    }).then(products => {
        res.render('commerce/product-list', {
            pageTitle: 'Product List',
            products: products.map(p => p.dataValues),
            thereAreProducts: products.length > 0,
        });
    }).catch(error => {
        console.error(error);
        req.flash('errors', 'An error occurred while fetching the product list.');
        res.redirect('/commerce-home');
    });
};

exports.getCreateProduct = (req, res) => {
    const commerceId = req.session.user.id;

    Category.findAll({ where: { commerceId } })
        .then(categories => {
            res.render('commerce/save-product', {
                pageTitle: 'Create Product',
                categories: categories.map(c => c.dataValues),
            });
        }).catch(error => {
            console.error(error);
            req.flash('errors', 'An error occurred while fetching categories.');
            res.redirect('/product-list');
        });
};

exports.postCreateProduct = (req, res) => {
    const { name, description, price, categoryId } = req.body;
    const image = req.file;

    if (!name || !description || !price || !categoryId || !image) {
        req.flash('errors', 'All fields are required.');
        return res.redirect('/save-product');
    }

    Product.create({
        name,
        description,
        price,
        categoryId,
        image: '/' + image.path,
        commerceId: req.session.user.id,
    }).then(() => {
        req.flash('success', 'Product created successfully.');
        res.redirect('/product-list');
    }).catch(error => {
        console.error(error);
        req.flash('errors', 'An error occurred while creating the product.');
        res.redirect('/save-product');
    });
};

exports.getEditProduct = (req, res) => {
    const productId = req.params.productId;

    Product.findOne({ where: { id: productId }, include: Category })
        .then(product => {
            if (!product) {
                req.flash('errors', 'Product not found.');
                return res.redirect('/product-list');
            }

            const commerceId = req.session.user.id;
            Category.findAll({ where: { commerceId } })
                .then(categories => {
                    res.render('commerce/edit-product', {
                        pageTitle: 'Edit Product',
                        product: product.dataValues,
                        categories: categories.map(c => c.dataValues),
                    });
                });
        }).catch(error => {
            console.error(error);
            req.flash('errors', 'An error occurred while fetching the product.');
            res.redirect('/product-list');
        });
};

exports.postEditProduct = (req, res) => {
    const { productId, name, description, price, categoryId } = req.body;
    const image = req.file;

    if (!name || !description || !price || !categoryId) {
        req.flash('errors', 'All fields except image are required.');
        return res.redirect(`/edit-product/${productId}`);
    }

    Product.findOne({ where: { id: productId } })
        .then(product => {
            if (!product) {
                req.flash('errors', 'Product not found.');
                return res.redirect('/product-list');
            }

            const updatedImage = image ? '/' + image.path : product.image;

            return product.update({
                name,
                description,
                price,
                categoryId,
                image: updatedImage,
            });
        }).then(() => {
            req.flash('success', 'Product updated successfully.');
            res.redirect('/product-list');
        }).catch(error => {
            console.error(error);
            req.flash('errors', 'An error occurred while updating the product.');
            res.redirect(`/edit-product/${productId}`);
        });
};

exports.deleteProduct = (req, res) => {
    const productId = req.params.productId;

    Product.destroy({ where: { id: productId } })
        .then(() => {
            req.flash('success', 'Product deleted successfully.');
            res.redirect('/product-list');
        })
        .catch(error => {
            console.error(error);
            req.flash('errors', 'An error occurred while deleting the product.');
            res.redirect('/product-list');
        });
};

exports.getOrders = async (req, res) => {
    const commerceId = req.session.user.id;

    try {
        const orders = await Order.findAll({
            where: { commerceId },
            include: [
                {
                    model: OrderProduct,
                    as: "orderProducts",
                    include: {
                        model: Product,
                        attributes: ['name', 'image', 'price'],
                    },
                },
                {
                    model: Commerce,
                    attributes: ['username', 'logo'],
                },
            ],
            order: [['createdAt', 'DESC']], // Ordenar del más reciente al más antiguo
        });

        const ordersToView = orders.map(order => ({
            id: order.id,
            status: order.status,
            total: order.total,
            productCount: order.orderProducts.length,
            commerceName: order.commerce?.username || "Unknown Commerce",
            commerceLogo: order.commerce?.logo || "/default-logo.png",
            date: order.date,
            time: order.hour,
        }));

        res.render("commerce/orders", {
            pageTitle: "Orders",
            orders: ordersToView,
            hasOrders: ordersToView.length > 0,
        });
    } catch (error) {
        console.error(error);
        req.flash("errors", "An error occurred while retrieving your orders.");
        res.redirect("/commerce-dashboard");
    }
};

exports.getOrderDetails = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: OrderProduct,
                    as: "orderProducts",
                    include: {
                        model: Product,
                        attributes: ['name', 'image', 'price'],
                    },
                },
                {
                    model: Commerce,
                    attributes: ['username'],
                },
            ],
        });

        if (!order) {
            req.flash("errors", "Order not found.");
            return res.redirect("/commerce-orders");
        }

        const orderDetails = {
            id: order.id,
            commerceName: order.commerce.username,
            status: order.status,
            date: order.date,
            time: order.hour,
            total: order.total,
            products: order.orderProducts.map(product => ({
                name: product.product.name,
                image: product.product.image,
                price: product.product.price,
            })),
        };

        res.render("commerce/order-details", {
            pageTitle: `Order #${orderDetails.id}`,
            order: orderDetails,
            isPending: order.status === "pending",
        });
    } catch (error) {
        console.error(error);
        req.flash("errors", "An error occurred while retrieving the order details.");
        res.redirect("/commerce-orders");
    }
};

exports.assignDelivery = async (req, res) => {
    const orderId = req.body.orderId;

    try {
        // Buscar el pedido
        const order = await Order.findByPk(orderId);

        if (!order || order.status !== "pending") {
            req.flash("errors", "Invalid order or order is not pending.");
            return res.redirect(`/commerce-order-details/${orderId}`);
        }

        // Buscar un delivery disponible
        const availableDelivery = await Delivery.findOne({
            where: { status: "available" }, // Usamos el campo `status`
        });

        if (!availableDelivery) {
            req.flash("errors", "No delivery available. Try again later.");
            return res.redirect(`/commerce-order-details/${orderId}`);
        }

        // Actualizar el pedido con el delivery asignado
        await order.update({
            deliveryId: availableDelivery.id,
            status: "in-process",
        });

        // Marcar el delivery como ocupado
        await availableDelivery.update({
            status: "busy", // Cambiar el estado a 'busy'
        });

        req.flash("success", "Delivery assigned and order is now in process.");
        res.redirect(`/commerce-order-details/${orderId}`);
    } catch (error) {
        console.error(error);
        req.flash("errors", "An error occurred while assigning the delivery.");
        res.redirect(`/commerce-order-details/${orderId}`);
    }
};