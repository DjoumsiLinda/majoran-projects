const express = require("express");
const db = require("../db.js");
const {
    requireUserLoggedIn,
    requireUserNotSigned,
} = require("../middlewares.js");
const router = express.Router();

router.get(
    "/petition",
    requireUserLoggedIn,
    requireUserNotSigned,
    (request, response) => {
        //verifier si lutilisateur a deja signe
        db.getSignatureByUserId(request.session.userId)
            .then((resultsignature) => {
                if (resultsignature.rows[0] === undefined) {
                    //console.log("++++++", resultsignature.rows[0]);
                    response.render("petition");
                } else {
                    response.redirect("/thanks");
                }
            })
            .catch((err) => {
                console.log(err);
                response.redirect("/error"); // Internal Server Error
            });
    }
);

router.post("/petition", requireUserLoggedIn, (request, response) => {
    const { signature } = request.body;
    db.addSignatures(signature, request.session.userId)
        .then((result) => {
            request.session.signatureId = result.rows[0].id;
            response.redirect("/thanks");
        })
        .catch((err) => {
            console.log(err);
            response.render("login", {
                error: true,
            });
        });
});
module.exports = router;
