const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db.js");
const { requireUserLoggedIn } = require("../middlewares.js");
const { checkAuth } = require("../checkAuth.js");
const {
    checkProfileIfEmpty,
    checkProfileIfCorrect,
} = require("../checkProfile.js");
const router = express.Router();

router.get("/profile/edit", requireUserLoggedIn, (request, response) => {
    db.getUsers_profile(request.session.userId)
        .then((result) => {
            const { rows: signers } = result;
            const profile = signers[0];
            if (profile) {
                response.render("profileEdit", {
                    profile,
                });
            } else {
                db.getUsersWithoutSignature(request.session.userId).then(
                    (result) => {
                        const { rows: signers } = result;
                        const profile = signers[0];
                        response.render("profileEdit", {
                            profile,
                        });
                    }
                );
            }
        })
        .catch((err) => {
            console.log("DB", err);
            response.redirect("/error"); // Internal Server Error
        });
});

router.post("/profile/edit", requireUserLoggedIn, (request, response) => {
    if ("update" in request.body) {
        const profile = request.body;
        const { first, last, email, city, password, age, url } =
            checkProfileIfEmpty(request.body);
        if (
            checkAuth(email, response, "profileEdit", request.body) &&
            checkProfileIfCorrect(url, age, response, "profileEdit", profile)
        ) {
            if (password) {
                //Password hash
                bcrypt.hash(password, 12).then((digest) => {
                    //console.log("Hash Password:", digest, request.session.userId);
                    Promise.all([
                        db.updateUsersWithPassword(
                            first,
                            last,
                            email,
                            digest,
                            request.session.userId
                        ),
                        db.updateUserProfiles(
                            age,
                            city,
                            url,
                            request.session.userId
                        ),
                    ])
                        .then(() => {
                            response.redirect("/petition");
                        })
                        .catch((err) => {
                            console.log(err);
                            response.redirect("/error"); // Internal Server Error
                        });
                });
            } else {
                //console.log("Not UPDATE PASSWORD");
                Promise.all([
                    db.updateUsersWithoutPassword(
                        first,
                        last,
                        email,
                        request.session.userId
                    ),
                    db.updateUserProfiles(
                        age,
                        city,
                        url,
                        request.session.userId
                    ),
                ])
                    .then(() => {
                        response.redirect("/petition");
                    })
                    .catch((err) => {
                        console.log(err);
                        response.redirect("/error"); // Internal Server Error
                    });
            }
        }
    } else {
        response.redirect("/thanks");
    }
});
module.exports = router;
