//controllers/customerController.js

const Customer = require("../models/customer/customer");
const Address = require("../models/customer/directions");
const CommerceType = require("../models/admin/commerceTypes");
const Commerce = require("../models/commerce/commerces");
const Sequelize = require("sequelize");
const Favorite = require("../models/customer/favorites");
const Category = require("../models/commerce/categories");
const Product = require("../models/commerce/products");
const Configuration = require("../models/admin/configuration");
const Order = require("../models/customer/orders");
const OrderProduct = require("../models/OrderProduct/orderProduct");

exports.index = (req, res) => {
    res.render("customer/index", {
        pageTitle: "Customer Home - AppCenar"
    });
};

exports.myProfile = (req, res) => {
    const customerId = req.session.user.id;

    Customer.findOne({ where: { id: customerId } })
        .then(result => {
            const customer = result.dataValues;

            res.render("customer/my-profile", {
                pageTitle: "My profile",
                customer: customer
            });
        }).catch(error => {
            console.log(error);
        })
};

exports.updateProfile = (req, res) => {
    const customerId = req.body.customerId;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const profilePicture = req.file;

    if (!name || !lastName || !phone) {
        req.flash("errors", "All fields are required");
        return res.redirect("/my-profile");
    }

    Customer.findOne({ where: { id: customerId } })
        .then(customer => {
            if (!customer) {
                req.flash("errors", "Customer not found");
                return res.redirect("/my-profile");
            }

            const updatedPhoto = profilePicture ? "/" + profilePicture.path : customer.profilePicture;

            return customer.update({
                name: name,
                lastName: lastName,
                profilePicture: updatedPhoto,
                phone: phone
            });
        }).then(() => {
            req.flash("success", "Your profile updated successfully");
            res.redirect("/customer-dashboard");
        }).catch(error => {
            console.log(error);
            req.flash("errors", "An error occurred while updating your profile");
            res.redirect(`/customer-dashboard`);
        });
};

exports.myAddresses = (req, res) => {
    const customerId = req.session.user.id;

    Address.findAll({ where: { customerId: customerId } })
        .then(result => {
            const addresses = result.map(a => a.dataValues);

            res.render("customer/my-addresses", {
                pageTitle: "My Addresses",
                addresses: addresses,
                thereAreAddresses: addresses.length > 0
            });
        }).catch(error => {
            console.log(error);
        })
};

exports.getSaveAddress = (req, res) => {
    res.render("customer/save-address", {
        pageTitle: "Save Address"
    });
};

exports.postSaveAddress = (req, res) => {
    const name = req.body.name;
    const descr = req.body.description;

    if (!name || !descr) {
        req.flash("errors", "All fields are required");
        return res.redirect("/save-address");
    }

    Address.create({
        name: name,
        description: descr,
        customerId: req.session.user.id
    }).then(result => {
        return res.redirect("/my-addresses")
    }).catch(error => {
        console.log(error);
    });
};

exports.getEditAddress = (req, res) => {
    const addressId = req.params.addressId;

    Address.findOne({ where: { id: addressId } })
        .then(result => {
            const address = result.dataValues;

            if (!address) {
                req.flash("errors", "Address not found");
                return res.redirect("/my-addresses");
            }

            res.render("customer/edit-address", {
                pageTitle: "Edit Address",
                address: address
            });
        }).catch(error => {
            req.flash("errors", "An error ocurred finding the address");
            console.log(error);
        })
};

exports.postEditAddress = (req, res) => {
    const addressId = req.body.addressId;
    const name = req.body.name;
    const description = req.body.description;

    if (!name || !description) {
        req.flash("errors", "All fields are required");
        return res.redirect("/edit-address");
    }

    Address.update({
        name: name,
        description: description
    }, {
        where: { id: addressId }
    }).then(result => {
        req.flash("success", "Address updated successfully");
        return res.redirect("/my-addresses");
    }).catch(error => {
        req.flash("errors", "An error ocurred while editing the address");
        console.log(error);
    });
};

exports.deleteAddress = (req, res) => {
    const customerId = req.body.customerId;

    Address.destroy({ where: { id: customerId } })
        .then(result => {
            req.flash("success", "Address removed successfully");
            return res.redirect("/my-addresses");
        }).catch(error => {
            req.flash("errors", "An error ocurred while removing this address");
            console.log(error);
        });
};

exports.getCustomerHome = (req, res) => {
    CommerceType.findAll()
        .then(result => {
            const commerceTypes = result.map(c => c.dataValues);

            res.render("customer/customer-home", {
                pageTitle: "Customer home",
                commerceTypes: commerceTypes,
                thereAreCommerceTypes: commerceTypes.length > 0
            });
        }).catch(error => {
            req.flash("errors", "An error ocurred finding all commerce types");
            console.log(error);
        });
};

exports.getCommercesByCategory = (req, res) => {
    const commerceTypeId = req.params.commerceTypeId;
    const { name } = req.query;
    let commercesCount;

    console.log(commerceTypeId);
    console.log(name);

    Commerce.findAll({ where: { commerceTypeId: commerceTypeId } })
        .then(result => {
            commercesCount = result.map(c => c.dataValues).length;
        }).catch(error => {
            console.log(error);
        });

    Commerce.findAll({
        where: {
            username: { [Sequelize.Op.like]: `%${name}%` },
            commerceTypeId: commerceTypeId
        }
    }).then(result => {
        const commerces = result.map(c => c.dataValues);

        res.render("customer/commerce-customer-list", {
            pageTitle: "Commerces",
            commerces: commerces,
            thereAreCommerces: commerces.length > 0,
            nameFilter: name || "",
            commerceTypeId: commerceTypeId,
            commercesCount: commercesCount
        });
    }).catch(error => {
        req.flash("errors", "An error ocurred, try later");
        console.log(error);
    });
};

exports.markupAsFavorite = (req, res) => {
    const customerId = req.session.user.id;
    const commerceId = req.body.commerceId;

    Favorite.findOne({
        where: {
            customerId: customerId,
            commerceId: commerceId
        }
    }).then(result => {
        if (result) {
            req.flash("errors", "It's already in your favorites");
            return res.redirect("/customer-home");
        }

        Favorite.create({
            customerId: customerId,
            commerceId: commerceId
        }).then(result => {
            req.flash("success", "Add to favorite successfully");
            return res.redirect("/customer-home");
        }).catch(error => {
            req.flash("errors", "An error ocurred adding this commerce to favorite.");
            console.log(error);
        });
    }).catch(error => {
        console.log(error);
    });
};

exports.getMyFavorites = (req, res) => {
    const customerId = req.session.user.id;

    Favorite.findAll({
        where: { customerId: customerId },
        include: [
            {
                model: Commerce,
                attributes: ['id', 'username', 'logo'],
            }
        ]
    }).then(result => {
        const favorites = result.map(f => ({
            id: f.id,
            commerceId: f.commerce.id,
            commerceName: f.commerce.username,
            commerceLogo: f.commerce.logo,
        }));

        res.render("customer/my-favorites", {
            pageTitle: "My Favorites",
            favorites: favorites,
            thereAreFavorites: favorites.length > 0
        });
    }).catch(error => {
        console.log(error);
        req.flash("errors", "An error occurred while retrieving your favorites.");
        res.redirect("/customer-dashboard");
    });
};

exports.removeFavorite = (req, res) => {
    const favoriteId = req.body.favoriteId;

    Favorite.destroy({ where: { id: favoriteId } })
        .then(() => {
            req.flash("success", "Favorite removed successfully.");
            res.redirect("/my-favorites");
        })
        .catch(error => {
            console.log(error);
            req.flash("errors", "An error occurred while removing the favorite.");
            res.redirect("/my-favorites");
        });
};

exports.getCatalog = async (req, res) => {
    const commerceId = req.params.commerceId;

    try {
        const commerce = await Commerce.findByPk(commerceId, {
            include: {
                model: Category,
                include: Product,
            },
        });

        const cart = req.session.cart || { products: [], subtotal: 0 };

        const categories = commerce.categories.map(category => {
            return {
                ...category.dataValues,
                products: category.products.map(product => ({
                    ...product.dataValues,
                    inCart: cart.products.some(cartItem => cartItem.id === product.id),
                })),
            };
        });

        res.render("customer/catalog", {
            commerce: commerce.dataValues,
            categories,
            cart,
        });
    } catch (error) {
        console.error(error);
        res.redirect("/customer-home");
    }
};

exports.addToCart = async (req, res) => {
    const productId = parseInt(req.body.productId);

    if (!req.session.cart) req.session.cart = { products: [], subtotal: 0, commerceId: null };

    const product = req.session.cart.products.find(p => p.id === productId);
    if (!product) {
        try {
            const productData = await Product.findByPk(productId, {
                include: {
                    model: Commerce,
                    attributes: ['id'], // Obtener solo el id del comercio
                },
            });

            if (!req.session.cart.commerceId) {
                req.session.cart.commerceId = productData.commerce.id; // Asignar el commerceId
            } else if (req.session.cart.commerceId !== productData.commerce.id) {
                req.flash("errors", "You can only add products from the same commerce.");
                return res.redirect(req.get("Referrer"));
            }

            req.session.cart.products.push({
                id: productData.id,
                name: productData.name,
                price: productData.price,
            });
            req.session.cart.subtotal += parseFloat(productData.price);
            res.redirect(req.get("Referrer"));
        } catch (error) {
            console.error(error);
            req.flash("errors", "An error occurred while adding the product to the cart.");
            res.redirect(req.get("Referrer"));
        }
    } else {
        req.flash("errors", "This product is already in the cart.");
        res.redirect(req.get("Referrer"));
    }
};


exports.removeFromCart = (req, res) => {
    const productId = parseInt(req.body.productId);

    if (req.session.cart) {
        const product = req.session.cart.products.find(p => p.id === productId);

        if (product) {
            req.session.cart.subtotal -= parseFloat(product.price);
            req.session.cart.subtotal = Math.max(0, req.session.cart.subtotal);
            req.session.cart.products = req.session.cart.products.filter(p => p.id !== productId);
        }
    }
    res.redirect(req.get("Referrer"));
};

exports.getCheckout = async (req, res) => {
    const customerId = req.session.user.id;

    try {
        const addresses = await Address.findAll({ where: { customerId } });
        const addressesToView = addresses.map(a => a.dataValues);
        const itbisConfig = await Configuration.findOne();
        const itbisPercentage = itbisConfig.itbis;

        const commerceId = req.session.cart.commerceId;
        const commerce = await Commerce.findByPk(commerceId);

        const subtotal = req.session.cart.subtotal;
        const itbis = (subtotal * itbisPercentage) / 100;
        const total = subtotal + itbis;

        res.render("customer/select-address", {
            addresses: addressesToView,
            commerce: commerce.dataValues,
            order: {
                subtotal,
                itbis,
                total,
                itbisPercentage,
            },
        });
    } catch (error) {
        req.flash("errors", "An error ocurred, the order could not continue");
        console.error(error);
        res.redirect(req.get("Referrer"));
    }
};

exports.createOrder = async (req, res) => {
    const { commerceId, subtotal, total, itbis, addressId } = req.body;
    const customerId = req.session.user.id;

    try {
        const order = await Order.create({
            commerceId,
            customerId,
            addressId,
            subtotal,
            total,
            itbis,
            date: new Date().toISOString().split("T")[0],
            hour: new Date().toLocaleTimeString(),
            status: "pending",
        });

        const products = req.session.cart.products;
        const orderProducts = products.map(product => ({
            orderId: order.id,
            productId: product.id,
            quantity: 1,
            unitPrice: product.price,
            subtotal: product.price,
        }));

        await OrderProduct.bulkCreate(orderProducts);

        req.session.cart = { products: [], subtotal: 0 };

        res.redirect("/customer-home");
    } catch (error) {
        req.flash("errors", "An error ocurred, the order could not continue");
        console.error(error);
        res.redirect("/customer-home");
    }
};

exports.getMyOrders = async (req, res) => {
    const customerId = req.session.user.id;

    try {
        const orders = await Order.findAll({
            where: { customerId },
            include: [
                {
                    model: Commerce,
                    attributes: ['username', 'logo'],
                },
                {
                    model: OrderProduct,
                    as: "orderProducts", // Asegúrate de usar el alias correcto
                    attributes: ['quantity'],
                }
            ],
        });


        console.log(orders);

        const ordersToView = orders.map(order => ({
            id: order.id,
            commerceName: order.commerce?.username || "Unknown Commerce",
            commerceLogo: order.commerce?.logo || "/default-logo.png",
            status: order.status,
            total: order.total,
            productCount: order.orderProducts ? order.orderProducts.length : 0, // Manejar undefined
            date: order.date,
            time: order.hour,
        }));

        res.render("customer/my-orders", {
            pageTitle: "My Orders",
            orders: ordersToView,
            hasOrders: ordersToView.length > 0,
        });
    } catch (error) {
        console.error("Error in getMyOrders:", error);
        console.log("Orders fetched:", JSON.stringify(orders, null, 2));
        req.flash("errors", "An error occurred while retrieving your orders.");
        res.redirect("/customer-dashboard");
    }
};

exports.getOrderDetails = async (req, res) => {
    const orderId = req.params.orderId;
    const customerId = req.session.user.id;

    try {
        const order = await Order.findOne({
            where: { id: orderId, customerId },
            include: [
                {
                    model: Commerce,
                    attributes: ['username'],
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
            return res.redirect("/my-orders");
        }

        const orderDetails = {
            id: order.id,
            commerceName: order.commerce.username,
            status: order.status,
            date: order.date,
            time: order.hour,
            total: order.total,
            products: order.orderProducts.map(op => ({
                name: op.product.name,
                price: op.product.price,
                image: op.product.image,
            })),
        };

        res.render("customer/order-details", {
            pageTitle: "Order Details",
            order: orderDetails,
        });
    } catch (error) {
        console.error(error);
        req.flash("errors", "An error occurred while retrieving the order details.");
        res.redirect("/my-orders");
    }
};
