const express = require("express");
const db = require("../db.js");
const { requireUserLoggedIn } = require("../middlewares.js");
const router = express.Router();

router.get(
    "/petition/delete/account",
    requireUserLoggedIn,
    (request, response) => {
        Promise.all([
            db.getUsers_profile(request.session.userId),
            db.getSignatureByUserId(request.session.userId),
        ])
            .then(([usersResult, signatureResult]) => {
                const profile = usersResult.rows[0];
                if (signatureResult.rows[0]) {
                    response.render("deleteAccount", {
                        profile,
                        image: signatureResult.rows[0].signature,
                    });
                } else {
                    db.getUsersWithoutSignature(request.session.userId).then(
                        (result) => {
                            const { rows: signers } = result;
                            const profile = signers[0];
                            response.render("deleteAccount", {
                                profile,
                                notSigners: true,
                            });
                        }
                    );
                }
            })
            .catch((err) => {
                console.log("DB", err);
                response.redirect("/error"); // Internal Server Error
            });
    }
);

router.post(
    "/petition/delete/account",
    requireUserLoggedIn,
    (request, response) => {
        if ("yes" in request.body) {
            db.deleteUsers_profile(request.session.userId)
                .then(() => {
                    db.deleteSignatures(request.session.signatureId)
                        .then((result) => {
                            if (result.rowCount) {
                                delete request.session.signatureId;
                            }
                            db.deleteUsers(request.session.userId)
                                .then((result) => {
                                    if (result.rowCount) {
                                        delete request.session.userId;
                                        response.redirect("/register");
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    response.redirect("/error"); // Internal Server Error
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            response.redirect("/error"); // Internal Server Error
                        });
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
