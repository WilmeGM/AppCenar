//controllers/commerceController.js
const Roles = require("../enums/roles");

exports.index = (req, res) => {
    if(!req.session)

    if (req.session.role !== Roles.COMMERCE) {
        return res.status(403).render("error/403", {
            pageTitle: "Access Denied - AppCenar"
        });
    }
    res.render("commerce/index", {
        pageTitle: "Commerce Home - AppCenar"
    });
};
