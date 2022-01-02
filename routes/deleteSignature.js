const express = require("express");
const db = require("../db.js");
const { requireUserLoggedIn, requireUserSigned } = require("../middlewares.js");
const router = express.Router();

router.get(
    "/petition/delete/signature",
    requireUserLoggedIn,
    requireUserSigned,
    (request, response) => {
        db.getSignatureByUserId(request.session.userId)
            .then((resultsignature) => {
                response.render("deleteSignature", {
                    image: resultsignature.rows[0].signature,
                });
            })
            .catch((err) => {
                console.log(err);
                response.redirect("/error"); // Internal Server Error
            });
    }
);

router.post(
    "/petition/delete/signature",
    requireUserLoggedIn,
    requireUserSigned,
    (request, response) => {
        if ("yes" in request.body) {
            db.deleteSignatures(request.session.signatureId)
                .then((result) => {
                    if (result.rowCount) {
                        delete request.session.signatureId;
                        response.redirect("/petition");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    response.redirect("/error"); // Internal Server Error
                });
        } else {
            response.redirect("/petition");
        }
    }
);
module.exports = router;
