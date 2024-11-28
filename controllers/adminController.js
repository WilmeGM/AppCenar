//controllers/adminController.js
//@ts-nocheck

const Customer = require("../models/customer/customer");
const Delivery = require("../models/delivery/delivery");
const Commerce = require("../models/commerce/commerces");
const Admin = require("../models/admin/admins");
const Configuration = require("../models/admin/configuration");
const CommerceType = require('../models/admin/commerceTypes');
const bcrypt = require("bcryptjs/dist/bcrypt");
const sequelize = require('../contexts/appContexts');

exports.index = (req, res) => {
    const inactiveCommerces = Commerce.count({ where: { isActive: false } });
    const activeCommerces = Commerce.count({ where: { isActive: true } });
    const inactiveCustomers = Customer.count({ where: { isActive: false } });
    const activeCustomers = Customer.count({ where: { isActive: true } });
    const inactiveDeliveries = Delivery.count({ where: { isActive: false } });
    const activeDeliveries = Delivery.count({ where: { isActive: true } });

    Promise.all([
        inactiveCommerces,
        activeCommerces,
        inactiveCustomers,
        activeCustomers,
        inactiveDeliveries,
        activeDeliveries
    ]).then(results => {
        res.render("admin/index", {
            pageTitle: "Admin Home - AppCenar",
            inactiveCommerces: results[0],
            activeCommerces: results[1],
            inactiveCustomers: results[2],
            activeCustomers: results[3],
            inactiveDeliveries: results[4],
            activeDeliveries: results[5]
        });
    }).catch(error => {
        console.error("Error loading data for admin dashboard:", error);
        req.flash("errors", "An error occurred while loading the dashboard.");
        res.redirect("/");
    });
};


exports.customerList = (req, res) => {
    Customer.findAll()
        .then(result => {
            const customers = result.map(result => result.dataValues);

            res.render("admin/customer-list", {
                pageTitle: "Customer List",
                customers: customers,
                ordersCount: 0,
                thereAreCustomers: customers.length > 0
            });
        }).catch(error => {
            console.log(error);
        })
};

exports.activateCustomer = (req, res) => {
    const customerId = req.body.customerId;

    Customer.update({ isActive: true }, { where: { id: customerId } })
        .then(result => {
            return res.redirect("/customer-list");
        }).catch(error => {
            console.log(error);
        });
};

exports.inactivateCustomer = (req, res) => {
    const customerId = req.body.customerId;

    Customer.update({ isActive: false }, { where: { id: customerId } })
        .then(result => {
            return res.redirect("/customer-list");
        }).catch(error => {
            console.log(error);
        });
}

exports.deliveryList = (req, res) => {
    Delivery.findAll()
        .then(result => {
            const deliveries = result.map(result => result.dataValues);

            res.render("admin/delivery-list", {
                pageTitle: "Delivery List",
                deliveries: deliveries,
                ordersDeliveredCount: 0,
                thereAreDeliveries: deliveries.length > 0
            });
        }).catch(error => {
            console.log(error);
        })
};

exports.activateDelivery = (req, res) => {
    const deliveryId = req.body.deliveryId;

    Delivery.update({ isActive: true }, { where: { id: deliveryId } })
        .then(result => {
            return res.redirect("/delivery-list");
        }).catch(error => {
            console.log(error);
        });
};

exports.inactivateDelivery = (req, res) => {
    const deliveryId = req.body.deliveryId;

    Delivery.update({ isActive: false }, { where: { id: deliveryId } })
        .then(result => {
            return res.redirect("/delivery-list");
        }).catch(error => {
            console.log(error);
        });
}

exports.commerceList = (req, res) => {
    Commerce.findAll()
        .then(result => {
            const commerces = result.map(result => result.dataValues);
            res.render("admin/commerce-list", {
                pageTitle: "Commerce List",
                commerces: commerces,
                ordersCount: 0,
                thereAreCommerces: commerces.length > 0
            });
        }).catch(error => {
            console.log(error);
        })
};

exports.activateCommerce = (req, res) => {
    const commerceId = req.body.commerceId;

    Commerce.update({ isActive: true }, { where: { id: commerceId } })
        .then(result => {
            return res.redirect("/commerce-list");
        }).catch(error => {
            console.log(error);
        });
};

exports.inactivateCommerce = (req, res) => {
    const commerceId = req.body.commerceId;

    Commerce.update({ isActive: false }, { where: { id: commerceId } })
        .then(result => {
            return res.redirect("/commerce-list");
        }).catch(error => {
            console.log(error);
        });
};

exports.getSettings = (req, res) => {
    Configuration.findAll()
        .then(result => {
            const itbis = result.map(result => result.dataValues);

            res.render("admin/settings", {
                pageTitle: "Settings",
                itbis: itbis,
                thereAreItbis: itbis.length > 0
            });
        }).catch(error => console.log(error));
};

exports.getEditSettings = (req, res) => {
    const itbisId = req.params.itbisId;

    Configuration.findOne({ where: { id: itbisId } })
        .then(itbisResult => {
            const itbis = itbisResult.dataValues;

            if (!itbis) {
                req.flash("errors", "An error ocurred finding the itbis register");
                return res.redirect("/settings");
            }

            res.render("admin/edit-settings", {
                pageTitle: "Edit setting",
                config: itbis
            });
        }).catch(error => console.log(error));
}

exports.postEditSettings = (req, res) => {
    const itbis = req.body.itbis;
    const itbisId = req.body.itbisId;

    if (!itbis) {
        req.flash("errors", "The itbis field is required");
        return res.redirect("/edit-settings/" + itbisId);
    }

    Configuration.update({
        itbis: itbis
    }, {
        where: { id: itbisId }
    }).then(result => {
        req.flash("success", "Settings updated successfully");
        return res.redirect("/settings");
    }).catch(error => {
        console.log(error);
    });
};

exports.adminList = (req, res) => {
    Admin.findAll()
        .then(result => {
            const admins = result.map(result => result.dataValues);

            res.render("admin/admin-list", {
                pageTitle: "Admin List",
                admins: admins,
                thereAreAdmins: admins.length > 0
            })
        }).catch(error => console.log(error));
};

exports.getSaveAdmin = (req, res) => {
    res.render("admin/save-admin", {
        pageTitle: "Save admin"
    });
};

exports.postSaveAdmin = (req, res) => {
    const name = req.body.name;
    const lastName = req.body.lastName;
    const idCard = req.body.idCard;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !lastName || !idCard || !email || !username || !password || !confirmPassword) {
        req.flash("errors", "All fields are required");
        return res.redirect("/save-admin");
    }

    if (password !== confirmPassword) {
        req.flash("errors", "Passwords must be the same");
        return res.redirect("/save-admin");
    }

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            return Admin.create({
                name: name,
                lastName: lastName,
                username: username,
                email: email,
                password: hashedPassword,
                idCard: idCard,
            }).then(result => {
                req.flash("success", "Admin created successfully");
                return res.redirect("/admin-list");
            }).catch(error => console.log(error));
        }).catch(error => console.log(error));
};

exports.activateAdmin = (req, res) => {
    const adminId = req.body.adminId;

    if (req.session.user.id == adminId) {
        req.flash("errors", "You dont activate yourself");
        return res.redirect("/admin-list");
    }

    Admin.update({ isActive: true }, { where: { id: adminId } })
        .then(result => {
            return res.redirect("/admin-list");
        }).catch(error => {
            console.log(error);
        });
};

exports.inactivateAdmin = (req, res) => {
    const adminId = req.body.adminId;

    if (req.session.user.id == adminId) {
        req.flash("errors", "You dont inactivate yourself");
        return res.redirect("/admin-list");
    }

    Admin.update({ isActive: false }, { where: { id: adminId } })
        .then(result => {
            return res.redirect("/admin-list");
        }).catch(error => {
            console.log(error);
        });
};

exports.getEditAdmin = (req, res) => {
    const adminId = req.params.adminId;

    Admin.findOne({ where: { id: adminId } })
        .then(result => {
            const admin = result.dataValues;

            if (!admin) {
                req.flash("errors", "Admin not found");
                return res.redirect("/admin-list");
            }

            res.render("admin/edit-admin", {
                pageTitle: "Edit Admin",
                admin: admin
            });
        }).catch(error => console.log(error));
};

exports.postEditAdmin = (req, res) => {
    const adminId = req.body.adminId;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const idCard = req.body.idCard;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !lastName || !idCard || !email || !username) {
        req.flash("errors", "All fields except password are required");
        return res.redirect(`/edit-admin/${adminId}`);
    }

    if ((password || confirmPassword) && password !== confirmPassword) {
        req.flash("errors", "Passwords must match");
        return res.redirect(`/edit-admin/${adminId}`);
    }

    Admin.findOne({ where: { id: adminId } })
        .then(admin => {
            if (!admin) {
                req.flash("errors", "Admin not found");
                return res.redirect("/admin-list");
            }

            if (password) {
                bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        return admin.update({
                            name,
                            lastName,
                            idCard,
                            email,
                            username,
                            password: hashedPassword
                        });
                    })
                    .then(() => {
                        req.flash("success", "Admin updated successfully");
                        res.redirect("/admin-list");
                    })
                    .catch(error => {
                        console.log(error);
                        req.flash("errors", "An error occurred while updating the admin");
                        res.redirect(`/edit-admin/${adminId}`);
                    });
            } else {
                admin.update({
                    name,
                    lastName,
                    idCard,
                    email,
                    username
                })
                    .then(() => {
                        req.flash("success", "Admin updated successfully");
                        res.redirect("/admin-list");
                    })
                    .catch(error => {
                        console.log(error);
                        req.flash("errors", "An error occurred while updating the admin");
                        res.redirect(`/edit-admin/${adminId}`);
                    });
            }
        })
        .catch(error => {
            console.log(error);
            req.flash("errors", "An error occurred while fetching the admin");
            res.redirect("/admin-list");
        });
};

exports.commerceTypeList = (req, res) => {
    CommerceType.findAll({
        attributes: {
            include: [
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM commerces AS commerce
                        WHERE commerce.commerceTypeId = commerceTypes.id
                    )`),
                    'commercesCount'
                ]
            ]
        }
    }).then(result => {
        const commerceTypes = result.map(commerceType => commerceType.dataValues);

        res.render("admin/commerce-types-list", {
            pageTitle: "Commerce Types",
            commerceTypes: commerceTypes,
            thereAreCommerceTypes: commerceTypes.length > 0
        });
    }).catch(error => {
        console.log(error);
        req.flash("errors", "An error occurred while fetching commerce types");
        res.redirect("/admin");
    });
};

exports.getSaveCommerceType = (req, res) => {
    res.render("admin/save-commerce-type", {
        pageTitle: "Save Commerce Type"
    });
};

exports.postSaveCommerceType = (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const icon = req.file;

    if (!name || !description || !icon) {
        req.flash("errors", "All fields are required");
        return res.redirect("/save-commerce-type");
    }

    CommerceType.create({
        name: name,
        description: description,
        icon: "/" + icon.path
    }).then(result => {
        req.flash("success", "Commerce type created successfully");
        res.redirect("/commerce-types-list");
    }).catch(error => {
        console.log(error);
        req.flash("errors", "An error occurred while saving the commerce type");
        res.redirect("/save-commerces-type");
    });
};

exports.getEditCommerceType = (req, res) => {
    const commerceTypeId = req.params.commerceTypeId;

    CommerceType.findOne({ where: { id: commerceTypeId } })
        .then(result => {
            const commerceType = result.dataValues;

            if (!commerceType) {
                req.flash("errors", "That commerce type do not exists");
                res.redirect("/commerce-types-list");
            }

            res.render("admin/edit-commerce-type", {
                pageTitle: "Edit a commerce type",
                commerceType: commerceType
            });
        }).catch(error => {
            console.log(error);
            req.flash("errors", "An error ocurred. Try again.");
            res.redirect("/commerce-types-list");
        });
};

exports.postEditCommerceType = (req, res) => {
    const commerceTypeId = req.body.commerceTypeId;
    const name = req.body.name;
    const description = req.body.description;
    const icon = req.file;

    if (!name || !description) {
        req.flash("errors", "Name and description are required");
        return res.redirect(`/edit-commerce-type/${commerceTypeId}`);
    }

    CommerceType.findOne({ where: { id: commerceTypeId } })
        .then(commerceType => {
            if (!commerceType) {
                req.flash("errors", "Commerce type not found");
                return res.redirect("/commerce-types-list");
            }

            const updatedIcon = icon ? "/" + icon.path : commerceType.icon;

            return commerceType.update({
                name: name,
                description: description,
                icon: updatedIcon
            });
        })
        .then(() => {
            req.flash("success", "Commerce type updated successfully");
            res.redirect("/commerce-types-list");
        })
        .catch(error => {
            console.log(error);
            req.flash("errors", "An error occurred while updating the commerce type");
            res.redirect(`/edit-commerce-type/${commerceTypeId}`);
        });
};

exports.deleteCommerceType = (req, res) => {
    const commerceTypeId = req.body.commerceTypeId;

    CommerceType.destroy({ where: { id: commerceTypeId } })
        .then(result => {
            req.flash("success", "Commerce type removed successfully");
            return res.redirect("/commerce-types-list");
        }).catch(error => {
            req.flash("errors", "An error occurred while removing the commerce type");
            console.log(error);
        })
};