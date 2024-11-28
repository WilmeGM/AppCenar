//controller/errorController.js

function get404(req, res, next) {
    res.status(404).render("error/404", { pageTitle: "404 - Not found" });
}

module.exports = {
    get404
};
