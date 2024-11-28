// seeds/adminSeed.js
//@ts-nocheck

const bcrypt = require("bcryptjs");
const Admin = require("../models/admin/admins");

const createAdmin = () => {
    Admin.findOne({ where: { username: "admin" } })
        .then((existingAdmin) => {
            if (!existingAdmin) {
                bcrypt
                    .hash("admin123", 12)
                    .then((hashedPassword) => {
                        Admin.create({
                            name: "Wilme",
                            lastName: "Gonzalez",
                            username: "admin",
                            email: "wilgm211@gmail.com",
                            password: hashedPassword,
                            idCard: "40229919531"
                        }).then(() => {
                            console.log("Admin user created successfully!");
                        }).catch((err) => {
                            console.error("Error creating admin user:", err);
                        });
                    }).catch((err) => {
                        console.error("Error hashing password:", err);
                    });
            } else {
                console.log("Admin user already exists.");
            }
        }).catch((err) => {
            console.error("Error finding admin user:", err);
        });
};

module.exports = createAdmin;
