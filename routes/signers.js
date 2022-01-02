const express = require("express");
const db = require("../db.js");
const { requireUserLoggedIn, requireUserSigned } = require("../middlewares.js");
const router = express.Router();

router.get(
    "/signers",
    requireUserLoggedIn,
    requireUserSigned,
    (request, response) => {
        db.getUsers()
            .then((result) => {
                const { rows: signers } = result;
                response.render("signers", {
                    signers,
                    count: result.rows.length,
                });
            })
            .catch((err) => {
                console.log(err);
                response.redirect("/error"); // Internal Server Error
            });
    }
);

router.get("/signers/:name", requireUserLoggedIn, (request, response) => {
    db.getUsersNachCity(request.params.name)
        .then((result) => {
            const { rows: signers } = result;
            response.render("signersCity", {
                signers,
                count: result.rows.length,
                city: request.params.name,
            });
        })
        .catch((err) => {
            console.log(err);
            response.redirect("/error"); // Internal Server Error
        });
});
module.exports = router;
