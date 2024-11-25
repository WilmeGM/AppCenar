exports.index = (req, res) => {
    res.render("admin/index", {
        pageTitle: "Admin Home - AppCenar"
    });
};