exports.index = (req, res) => {
    res.render("home", {
        pageTitle: "Home - AppCenar"
    });
};