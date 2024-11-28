const Roles = require("../enums/roles");

const authRedirectMiddleware = (req, res, next) => {
  if (req.session.isLoggedIn) {
    const role = req.session.role;

    if (role === Roles.CUSTOMER) return res.redirect("/customer-home");
    if (role === Roles.DELIVERY) return res.redirect("/delivery-home");
    if (role === Roles.COMMERCE) return res.redirect("/commerce-home");
    if (role === Roles.ADMIN) return res.redirect("/admin-home");

    req.session.destroy(() => {
      res.redirect("/login");
    });
  } else {
    next();
  }
};

module.exports = authRedirectMiddleware;  // Exporta como una función
