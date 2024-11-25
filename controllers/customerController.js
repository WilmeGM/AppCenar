exports.index = (req, res) => {
    res.render("customer/index", {
        pageTitle: "Customer Home - AppCenar"
    });
};