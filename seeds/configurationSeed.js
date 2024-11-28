// seeds/adminSeed.js
//@ts-nocheck

const Configuration = require("../models/admin/configuration");

const createDefaultConfiguration = () => {
    Configuration.findOne({ where: { itbis: 18.00 } })
        .then(config => {
            if (!config) {
                Configuration.create({
                    itbis: 18.00,
                }).then(() => {
                    console.log("Default config created successfully");
                }).catch(error => console.log(error));
            } else {
                console.log("Default config already exists");
            }
        }).catch(error => console.log(error));
}

module.exports = createDefaultConfiguration;