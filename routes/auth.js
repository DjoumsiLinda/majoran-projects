const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db.js");
const { requireUserNotLoggedIn } = require("../middlewares.js");
const { checkAuth } = require("../checkAuth.js");
const router = express.Router();

router.get("/register", requireUserNotLoggedIn, (request, response) => {
    response.render("registration");
});

router.post("/register", requireUserNotLoggedIn, (request, response) => {
    const { first, last, email, password } = request.body;
    //Password hash
    if (checkAuth(email, response, "registration", request.body)) {
        bcrypt.hash(password, 12).then((digest) => {
            db.addUsers(first, last, email, digest)
                .then((result) => {
                    request.session.userId = result.rows[0].id;
                    response.redirect("/profile");
                })
                .catch((err) => {
                    console.log(err);
                    response.render("registration", {
                        error: true,
                    });
                });
        });
    }
});

router.get("/login", requireUserNotLoggedIn, (request, response) => {
    response.render("login");
});

router.post("/login", requireUserNotLoggedIn, (request, response) => {
    console.log(request.body);
    const { email, password } = request.body;
    if (!email || !password) {
        return response.render("login", {
            error: true,
        });
    }
    if (checkAuth(email, response, "login", request.body)) {
        db.getPasswords(email)
            .then((results) => {
                let hashFromDb;
                if (results.rows[0] === undefined) {
                    return response.render("login", {
                        error: true,
                    });
                } else {
                    hashFromDb = results.rows[0].password;
                }
                bcrypt.compare(password, hashFromDb).then((match) => {
                    if (match) {
                        request.session.userId = results.rows[0].id;
                        db.getSignatureIdByUserId(request.session.userId)
                            .then((result) => {
                                if (result.rows[0]) {
                                    request.session.signatureId =
                                        result.rows[0].id;
                                }
                                response.redirect("/petition");
                            })
                            .catch((err) => {
                                console.log(err);
                                response.redirect("/error"); // Internal Server Error
                            });
                    } else {
                        response.render("login", {
                            error: true,
                        });
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                response.redirect("/error"); // Internal Server Error
            });
    }
});
module.exports = router;
