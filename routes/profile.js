const express = require("express");
const db = require("../db.js");
const { requireUserLoggedIn } = require("../middlewares.js");
const {
    checkProfileIfEmpty,
    checkProfileIfCorrect,
} = require("../checkProfile.js");
const router = express.Router();

router.get("/profile", requireUserLoggedIn, (request, response) => {
    response.render("profile");
});

router.post("/profile", requireUserLoggedIn, (request, response) => {
    let { age, city, url } = checkProfileIfEmpty(request.body);
    checkProfileIfCorrect(url, age, response, "profile", request.body);
    if (city || url || age) {
        //console.log(age, city, homepage);
        db.addUserProfiles(age, city, url, request.session.userId)
            .then(() => {
                response.redirect("/petition");
            })
            .catch((err) => {
                const profile = request.body;
                console.log(err);
                response.render("profile", {
                    error: true,
                    profile,
                });
            });
    } else {
        console.log("Not set Profile");
        response.redirect("/petition");
    }
});
module.exports = router;
