// controllers/AuthController.js
//@ts-nocheck

const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const Customer = require("../models/customer/customer");
const Commerce = require("../models/commerce/commerces");
const Delivery = require("../models/delivery/delivery");

exports.GetLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    res.render("auth/login", {
        pageTitle: "Login",
        loginActive: true
    });
};

exports.PostLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
};

exports.Logout = (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
};

exports.GetSignup = (req, res, next) => {
    res.render("auth/signup", {
        pageTitle: "Signup"
    });
};

exports.PostSignup = (req, res, next) => {
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

    if (role == "customer") {
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
                }).then(() => {
                    res.redirect("/login");
                }).catch((err) => {
                    console.log(err);
                    req.flash("errors", "An error occurred. Please try again.");
                    res.redirect("/signup");
                });
            });
        }).catch((err) => {
            console.log(err);
            req.flash("errors", "An error occurred. Please try again.");
            res.redirect("/signup");
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

            bcrypt.hash(password, 12).then(hashedPassword => {
                return Delivery.create({
                    username: username,
                    password: hashedPassword,
                    email: email,
                    phone: phone,
                    name: name,
                    lastName: lastName,
                    profilePicture: "/" + image.path
                }).then(() => {
                    res.redirect("/login");
                }).catch((err) => {
                    console.log(err);
                    req.flash("errors", "An error occurred. Please try again.");
                    res.redirect("/signup");
                });
            });
        }).catch((err) => {
            console.log(err);
            req.flash("errors", "An error occurred. Please try again.");
            res.redirect("/signup");
        });
    }
};

exports.GetSignupCommerce = (req, res, next) => {
    res.render("auth/signup-commerce", {
        pageTitle: "Signup Commerce",
    });
};

exports.PostSignupCommerce = (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const logo = req.file;
    const openingTime = req.body.openingTime;
    const closingTime = req.body.closingTime;
    const commerceType = req.body.type;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!name || !logo || !phone || !email || !openingTime || !closingTime || !password || !confirmPassword || !commerceType) {
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
                { name: name },
                { email: email }
            ]
        }
    }).then((existingCommerce) => {
        if (existingCommerce) {
            req.flash("errors", "A commerce with this email or name already exists.");
            return res.redirect("/signup-commerce");
        }

        bcrypt.hash(password, 12).then(hashedPassword => {
            return Commerce.create({
                name: name,
                phone: phone,
                email: email,
                logo: logo,
                openingTime: opening_time,
                closingTime: closing_time,
                password: hashedPassword,
            }).then(() => {
                res.redirect("/login");
            }).catch((error) => {
                console.log(error);
                req.flash("errors", "An error occurred. Please try again.");
                res.redirect("/signup-commerce");
            });
        }).catch(error => {
            console.log(error);
        });

    }).catch((error) => {
        console.log(error);
        req.flash("errors", "An error occurred. Please try again.");
        res.redirect("/signup-commerce");
    });
};
