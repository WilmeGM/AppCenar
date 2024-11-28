//controllers/deliveryController.js

exports.index = (req, res) => {
    res.render("delivery/index", {
        pageTitle: "Delivery Home - AppCenar"
    });
};