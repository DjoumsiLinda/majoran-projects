const express = require("express");
const { requireUserLoggedIn } = require("../middlewares.js");
const router = express.Router();

router.get("/petition/logout", requireUserLoggedIn, (request, response) => {
    delete request.session.signatureId;
    delete request.session.userId;
    response.redirect("/register");
});
module.exports = router;
