const express = require("express");
const db = require("../db.js");
const { requireUserLoggedIn, requireUserSigned } = require("../middlewares.js");
const router = express.Router();

router.get(
    "/thanks",
    requireUserLoggedIn,
    requireUserSigned,
    (request, response) => {
        Promise.all([
            db.getSignaturesCount(),
            db.getSignatureByUserId(request.session.userId),
        ])
            .then(([countResult, signatureResult]) => {
                response.render("thanks", {
                    count: countResult.rows[0].count,
                    signature: signatureResult.rows[0].signature,
                });
            })
            .catch((err) => {
                console.log(err);
                response.redirect("/error"); // Internal Server Error
            });
    }
);
module.exports = router;
