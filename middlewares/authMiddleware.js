// middlewares/authMiddleware.js

const Roles = require("../enums/roles");

module.exports.isAuthenticated = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).render("error/401", {
      pageTitle: "Unauthorized - AppCenar",
    });
  }
  next();
};

module.exports.hasRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.session.isLoggedIn || req.session.role !== requiredRole) {
      return res.status(403).render("error/403", {
        pageTitle: "Forbidden - AppCenar",
      });
    }
    next();
  };
};
