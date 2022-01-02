const express = require("express");
const router = express.Router();

router.get("/error", (request, response) => {
    response.render("serverError", {
        helpers: {
            title() {
                return "Petition-error";
            },
        },
    });
});

router.post("/error", (request, response) => {
    if ("goBack" in request.body) {
        response.redirect("/login");
    } else {
        const link = request.body;
        for (const key in link) {
            response.redirect(key);
        }
    }
});

module.exports = router;
