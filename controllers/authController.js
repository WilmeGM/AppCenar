// controllers/AuthController.js
//@ts-nocheck

const crypto = require("crypto");
const transporter = require("../services/emailService");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

const Customer = require("../models/customer/customer");
const Commerce = require("../models/commerce/commerces");
const Delivery = require("../models/delivery/delivery");
const Admin = require("../models/admin/admins");
const CommerceType = require("../models/admin/commerceTypes");
const Roles = require("../enums/roles");

exports.loginAuthorize = (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
};

exports.getLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    res.render("auth/login", {
        pageTitle: "Login",
        loginActive: true
    });
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;

    if (!username || !password) {
        req.flash("errors", "all fields are required");
        return res.redirect("/login");
    }

    let model;

    if (role == Roles.CUSTOMER) model = Customer;
    if (role == Roles.DELIVERY) model = Delivery;
    if (role == Roles.COMMERCE) model = Commerce;
    if (!role) model = Admin;

    model.findOne({ where: { username: username } })
        .then(user => {
            if (!user) {
                req.flash("errors", "username is invalid ");
                return res.redirect("/login");
            }

            if (!user.isActive) {
                req.flash("errors", "username is inactive, check your email");
                return res.redirect("/login");
            }

            bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        if (!role) {
                            req.session.role = "admin";
                        } else {
                            req.session.role = role;
                        }
                        return req.session.save(error => {
                            console.log(error);

                            if (role === Roles.CUSTOMER) return res.redirect("/customer-home");
                            if (role === Roles.DELIVERY) return res.redirect("/delivery-home");
                            if (role === Roles.COMMERCE) return res.redirect("/commerce-home");
                            if (!role) return res.redirect("/admin-home");
                        });
                    }

                    req.flash("errors", "password is invalid");
                    res.redirect("/login");
                }).catch(error => {
                    console.log(err);
                    req.flash(
                        "errors",
                        "An error has occurred while login."
                    );
                    res.redirect("/login");
                })
        }).catch(error => {
            console.log(error);
            if (!role) {
                req.flash("errors", "All fields are required.");
            } else {
                req.flash("errors", "An error has occurred while login.");
            }
            res.redirect("/login");
        })
};

exports.logout = (req, res, next) => {
    req.session.destroy((error) => {
        console.log(error)
        res.redirect("/");
    });
};

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        pageTitle: "Signup"
    });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const email = req.body.email;
    const image = req.file;
    const username = req.body.username;
    const role = req.body.role;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !lastName || !phone || !email || !username || !role || !password || !confirmPassword) {
        req.flash("errors", "All fields are required.");
        return res.redirect("/signup");
    }

    if (password !== confirmPassword) {
        req.flash("errors", "Passwords must be the same.");
        return res.redirect("/signup");
    }

    if (role == Roles.CUSTOMER) {
        Customer.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        }).then((existingUser) => {
            if (existingUser) {
                req.flash("errors", "Username or email already exists.");
                return res.redirect("/signup");
            }

            bcrypt.hash(password, 12).then((hashedPassword) => {
                return Customer.create({
                    username: username,
                    password: hashedPassword,
                    email: email,
                    phone: phone,
                    name: name,
                    lastName: lastName,
                    profilePicture: "/" + image.path
                }).then(result => {
                    const user = result;

                    crypto.randomBytes(32, (error, buffer) => {
                        if (error) {
                            console.log(error);
                            return null;
                        }

                        const token = buffer.toString("hex");

                        user.resetToken = token;
                        user.resetTokenExpiration = Date.now() + 3600000;

                        return user.save().then(() => {

                            transporter.sendMail({
                                from: "wilme03gonzalez@gmail.com",
                                to: user.email,
                                subject: `Activate your account - YourApp`,
                                html: `<h3>Welcome to Our App!</h3>
                          <p>To activate your account, click on the link below:</p>
                          <p><a href="http://localhost:5000/activate/${token}">Activate Account</a></p>`
                            });

                            res.redirect("/login");
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                    req.flash("errors", "An error occurred creating the user. Please try again.");
                    return res.redirect("/signup");
                });
            });
        }).catch((err) => {
            console.log(err);
            req.flash("errors", "An error occurred. Please try again.");
            return res.redirect("/signup");
        });
    } else {
        Delivery.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        }).then((existingUser) => {
            if (existingUser) {
                req.flash("errors", "Username or email already exists.");
                return res.redirect("/signup");
            }

            bcrypt.hash(password, 12).then((hashedPassword) => {
                return Delivery.create({
                    username: username,
                    password: hashedPassword,
                    email: email,
                    phone: phone,
                    name: name,
                    lastName: lastName,
                    profilePicture: "/" + image.path
                }).then((result) => {
                    const user = result;

                    crypto.randomBytes(32, (error, buffer) => {
                        if (error) {
                            console.log(error);
                            return null;
                        }

                        const token = buffer.toString("hex");

                        user.resetToken = token;
                        user.resetTokenExpiration = Date.now() + 3600000;

                        return user.save().then(() => {
                            transporter.sendMail({
                                from: "wilme03gonzalez@gmail.com",
                                to: user.email,
                                subject: `Activate your account - YourApp`,
                                html: `<h3>Welcome to Our App!</h3>
                          <p>To activate your account, click on the link below:</p>
                          <p><a href="http://localhost:5000/activate/${token}">Activate Account</a></p>`
                            });

                            res.redirect("/login");
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                    req.flash("errors", "An error occurred creating the user. Please try again.");
                    return res.redirect("/signup");
                });
            });
        }).catch((err) => {
            console.log(err);
            req.flash("errors", "An error occurred. Please try again.");
            return res.redirect("/signup");
        });
    }
};

exports.getSignupCommerce = (req, res, next) => {
    CommerceType.findAll().then(result => {
        const commerceTypes = result.map(result => result.dataValues);

        res.render("auth/signup-commerce", {
            pageTitle: "Signup Commerce",
            commerceTypes: commerceTypes
        });
    }).catch(error => {
        console.log(error);
    });
};

exports.postSignupCommerce = (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const logo = req.file;
    const openingTime = req.body.openingTime;
    const closingTime = req.body.closingTime;
    const commerceTypeId = req.body.typeId;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !logo || !phone || !email || !openingTime || !closingTime || !password || !confirmPassword || !commerceTypeId) {
        req.flash("errors", "All fields are required.");
        return res.redirect("/signup");
    }

    if (password !== confirmPassword) {
        req.flash("errors", "Passwords must be the same.");
        return res.redirect("/signup");
    }

    Commerce.findOne({
        where: {
            [Sequelize.Op.or]: [
                { username: name },
                { email: email }
            ]
        }
    }).then((existingCommerce) => {
        if (existingCommerce) {
            req.flash("errors", "A commerce with this email or name already exists.");
            return res.redirect("/signup-commerce");
        }

        bcrypt.hash(password, 12)
            .then(hashedPassword => {
                return Commerce.create({
                    username: name,
                    phone: phone,
                    email: email,
                    logo: "/" + logo.path,
                    openingTime: openingTime,
                    closingTime: closingTime,
                    password: hashedPassword,
                    commerceTypeId: commerceTypeId
                }).then(result => {
                    const commerce = result;

                    crypto.randomBytes(32, (error, buffer) => {
                        if (error) {
                            console.log(error);
                            return null;
                        }

                        const token = buffer.toString("hex");

                        commerce.resetToken = token;
                        commerce.resetTokenExpiration = Date.now() + 3600000;

                        return commerce.save().then(() => {
                            transporter.sendMail({
                                from: "wilme03gonzalez@gmail.com",
                                to: commerce.email,
                                subject: `Activate your account - YourApp`,
                                html: `<h3>Welcome to Our App!</h3>
                          <p>To activate your account, click on the link below:</p>
                          <p><a href="http://localhost:5000/activate/${token}">Activate Account</a></p>`
                            });

                            return res.redirect("/login");
                        });
                    });
                }).catch((error) => {
                    console.log(error);
                    req.flash("errors", "An error occurred creating the commerce. Please try again.");
                    return res.redirect("/signup-commerce");
                });
            }).catch(error => {
                console.log(error);
            });

    }).catch((error) => {
        console.log(error);
        req.flash("errors", "An error occurred. Please try again.");
        return res.redirect("/signup-commerce");
    });
};

exports.getActivateAccount = (req, res, next) => {
    const token = req.params.token;

    Customer.findOne({ where: { resetToken: token, resetTokenExpiration: { [Sequelize.Op.gte]: Date.now() } } })
        .then((customer) => {
            if (customer) {
                customer.isActive = true;
                customer.resetToken = null;
                customer.resetTokenExpiration = null;
                return customer.save().then(() => {
                    req.flash("success", "Your account has been activated. You can now log in.");
                    return res.redirect("/login");
                });
            }

            return Delivery.findOne({ where: { resetToken: token, resetTokenExpiration: { [Sequelize.Op.gte]: Date.now() } } });
        })
        .then((delivery) => {
            if (delivery) {
                delivery.isActive = true;
                delivery.resetToken = null;
                delivery.resetTokenExpiration = null;
                return delivery.save().then(() => {
                    req.flash("success", "Your account has been activated. You can now log in.");
                    return res.redirect("/login");
                });
            }

            return Commerce.findOne({ where: { resetToken: token, resetTokenExpiration: { [Sequelize.Op.gte]: Date.now() } } });
        })
        .then((commerce) => {
            if (commerce) {
                commerce.isActive = true;
                commerce.resetToken = null;
                commerce.resetTokenExpiration = null;
                return commerce.save().then(() => {
                    req.flash("success", "Your account has been activated. You can now log in.");
                    return res.redirect("/login");
                });
            }

            req.flash("errors", "Invalid or expired token.");
            return res.redirect("/login");
        })
        .catch((err) => {
            console.log(err);
            req.flash("errors", "An error occurred. Please try again.");
            return res.redirect("/login");
        });
};

exports.getReset = (req, res, next) => {
    res.render("auth/reset", {
        pageTitle: "Reset passwoord",
    });
};

exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            req.flash("errors", "An error occurred. Please try again.");
            return res.redirect("/reset");
        }

        const token = buffer.toString("hex");

        Customer.findOne({ where: { email: email } })
            .then((customer) => {
                if (customer) {
                    customer.resetToken = token;
                    customer.resetTokenExpiration = Date.now() + 3600000;
                    return customer.save();
                }
                return Delivery.findOne({ where: { email: email } });
            })
            .then((delivery) => {
                if (delivery) {
                    delivery.resetToken = token;
                    delivery.resetTokenExpiration = Date.now() + 3600000;
                    return delivery.save();
                }
                return Commerce.findOne({ where: { email: email } });
            })
            .then((commerce) => {
                if (commerce) {
                    commerce.resetToken = token;
                    commerce.resetTokenExpiration = Date.now() + 3600000;
                    return commerce.save();
                }

                req.flash("errors", "Dont exist an account with that email.");
                return res.redirect("/reset-password");
            })
            .then((result) => {
                if (result) {
                    transporter.sendMail({
                        from: "wilme03gonzalez@gmail.com",
                        to: email,
                        subject: `Reset your password`,
                        html: `<h3>Reset password request</h3>
                               <p>Click on this <a href="http://localhost:5000/new-password/${token}">link</a> for resetting your password.</p>`,
                    }, (error, info) => {
                        if (err) {
                            console.log(err);
                            req.flash("errors", "An error occurred for sending the email. Please try again.");
                            return res.redirect("/reset-password");
                        }
                    });
                    req.flash("success", "Check your email to continue with the reset password.");
                    return res.redirect("/login");
                }
            })
            .catch((err) => {
                console.log(err);
                req.flash("errors", "An error occurred. Please try again.");
                return res.redirect("/reset-password");
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    let responseSent = false;

    Customer.findOne({ where: { resetToken: token, resetTokenExpiration: { [Sequelize.Op.gte]: Date.now() } } })
        .then((customer) => {
            if (customer && !responseSent) {
                responseSent = true;
                return res.render("auth/new-password", {
                    pageTitle: "New Password",
                    userId: customer.id,
                    passwordToken: token,
                    role: Roles.CUSTOMER,
                });
            }
            return Delivery.findOne({ where: { resetToken: token, resetTokenExpiration: { [Sequelize.Op.gte]: Date.now() } } });
        })
        .then((delivery) => {
            if (delivery && !responseSent) {
                responseSent = true;
                return res.render("auth/new-password", {
                    pageTitle: "New Password",
                    userId: delivery.id,
                    passwordToken: token,
                    role: Roles.DELIVERY,
                });
            }
            return Commerce.findOne({ where: { resetToken: token, resetTokenExpiration: { [Sequelize.Op.gte]: Date.now() } } });
        })
        .then((commerce) => {
            if (commerce && !responseSent) {
                responseSent = true;
                return res.render("auth/new-password", {
                    pageTitle: "New Password",
                    userId: commerce.id,
                    passwordToken: token,
                    role: Roles.DELIVERY,
                });
            }

            if (!responseSent) {
                req.flash("errors", "The token is invalid or it has expired or the user is invalid.");
                return res.redirect("/reset");
            }
        })
        .catch((err) => {
            console.log(err);
            if (!responseSent) {
                req.flash("errors", "An error occurred. Please try again.");
                return res.redirect("/reset");
            }
        });
};


exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    const role = req.body.role;

    if (newPassword !== confirmPassword) {
        req.flash("errors", "Passwords must be the same.");
        return res.redirect("/new-password/" + passwordToken);
    }

    let userModel;

    if (role === Roles.CUSTOMER) userModel = Customer;
    if (role === Roles.DELIVERY) userModel = Delivery;
    if (role === Roles.COMMERCE) userModel = Commerce;

    userModel
        .findOne({
            where: {
                resetToken: passwordToken,
                id: userId,
                resetTokenExpiration: { [Sequelize.Op.gte]: Date.now() },
            },
        })
        .then((user) => {
            if (!user) {
                req.flash("errors", "The token is invalid or it has expired or the user is invalid.");
                return res.redirect("/reset");
            }

            return bcrypt
                .hash(newPassword, 12)
                .then((hashedPassword) => {
                    user.password = hashedPassword;
                    user.resetToken = null;
                    user.resetTokenExpiration = null;
                    return user.save();
                })
                .then(() => {
                    req.flash("success", "Password updated successfully.");
                    return res.redirect("/login");
                });
        })
        .catch((err) => {
            console.log(err);
            req.flash("errors", "An error occurred. Please try again.");
            return res.redirect("/reset-password");
        });
};
