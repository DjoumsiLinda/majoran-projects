const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const cookieSession = require("cookie-session");
const { sessionSecret } = require("./secrets.json");
const bcrypt = require("bcryptjs");
const db = require("./db.js");

const server = express();

server.use(
    express.urlencoded({
        extended: false,
    })
);

server.use(
    cookieSession({
        // as long as nobody know our session secret,
        // no one can tamper (change) their cookies.
        secret: sessionSecret,
        //nach 30 days wird der cookies automatisch gelöscht unf der user muss nochmal sich authentifizieren
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: true, // prevents Cross Site Request Forgery (CSRF) attacks
    })
);

server.engine(
    "handlebars",
    engine({
        helpers: {
            year() {
                return new Date().getFullYear();
            },
        },
    })
);
server.set("view engine", "handlebars");

server.use(express.static(path.join(__dirname)));

//Middeleware
server.use((req, res, next) => {
    console.log("📢", req.method, req.url, req.session);

    next();
});

// prevent ClickJacking attacks
server.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");

    next();
});

server.get("/", (request, response) => {
    response.redirect("/register");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ register
server.get("/register", (request, response) => {
    response.render("registration");
});

server.post("/register", (request, response) => {
    const { first, last, email, password } = request.body;
    //Password hash
    bcrypt.hash(password, 12).then((digest) => {
        //console.log("Hash Password:", digest);
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
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ login
server.get("/login", (request, response) => {
    response.render("login");
});

server.post("/login", (request, response) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return response.render("login", {
            error: true,
        });
    }
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
                //console.log(match);
                if (match) {
                    request.session.userId = results.rows[0].id;
                    response.redirect("/petition");
                } else {
                    response.render("login", {
                        error: true,
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err);
            response.sendStatus(500); // Internal Server Error
        });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ profile
server.get("/profile", (request, response) => {
    if (!request.session.userId) {
        return response.redirect("/register");
    }
    response.render("profile");
});

server.post("/profile", (request, response) => {
    // console.log(request.body);
    if (!request.session.userId) {
        response.redirect("/register");
    }
    let { age, city, homepage } = request.body;
    checkProfile(homepage, age, response, "profile");
    if (city || homepage) {
        //console.log(age, city, homepage);
        db.addUserProfiles(age, city, homepage, request.session.userId)
            .then((result) => {
                console.log("Insert Profile succefull");
                response.redirect("/petition");
            })
            .catch((err) => {
                console.log(err);
                response.render("profile", {
                    error: true,
                });
            });
    } else {
        console.log("Not set Profile");
        response.redirect("/petition");
    }
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ profile/edit
server.get("/profile/edit", (request, response) => {
    if (!request.session.userId) {
        return response.redirect("/register");
    }
    db.getUsers_profile(request.session.userId)
        .then((result) => {
            const { rows: signers } = result;
            //console.log("Signers:", signers);
            const profile = signers[0];
            //console.log("Signers:", first, last, age, city);
            response.render("profile_edit", {
                profile,
            });
        })
        .catch((err) => {
            console.log("DB", err);
            response.sendStatus(500); // Internal Server Error
        });
});

server.post("/profile/edit", (request, response) => {
    console.log("Update+++++++++++++++ ", request.session.userId);
    console.log("Update+++++++++++++++ ", request.body);
    const { homepage, age } = request.body;
    db.getUsers_profile(request.session.userId)
        .then((result) => {
            const { rows: signers } = result;
            console.log("Signers:", signers, signers[0].first);
            checkProfile(
                homepage,
                age,
                response,
                "profile_edit",
                signers[0].first
            );
        })
        .catch((err) => {
            console.log("DB", err);
            response.sendStatus(500); // Internal Server Error
        });
    //checkPassword(password);
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ petition
server.get("/petition", (request, response) => {
    if (!request.session.userId) {
        response.redirect("/register");
    } else {
        //verifier si lutilisateur a deja signe
        db.getSignaturesWithId(request.session.userId)
            .then((resultsignature) => {
                console.log(typeof resultsignature.rows[0]);
                if (resultsignature.rows[0] === undefined) {
                    response.render("petition");
                } else {
                    response.redirect("/thanks");
                }
            })
            .catch((err) => {
                console.log(err);
                response.sendStatus(500); // Internal Server Error
            });
    }
});

server.post("/petition", (request, response) => {
    console.log("Insert in DB ", request.session.userId);
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

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ thanks
server.get("/thanks", (request, response) => {
    if (!request.session.userId) {
        console.log("GET /thanks --- kein cookies");
        return response.redirect("/register");
    }
    db.getSignaturesCount()
        .then((result) => {
            db.getSignaturesWithId(request.session.userId)
                .then((resultsignature) => {
                    //console.log(request.session.signatureId, resultsignature);
                    response.render("thanks", {
                        count: result.rows[0].count,
                        image: resultsignature.rows[0].signature,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    response.sendStatus(500); // Internal Server Error
                });
        })
        .catch((err) => {
            console.log(err);
            response.sendStatus(500); // Internal Server Error
        });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ signers
server.get("/signers", (request, response) => {
    //console.log("GET /signers");
    if (!request.session.userId && !request.session.signatureId) {
        console.log("GET /signers  --- kein cookies");
        return response.redirect("/register");
    }
    console.log("Get Elements in DB");
    db.getUsers()
        .then((result) => {
            const { rows: signers } = result;
            console.log("Signers:", signers);
            response.render("signers", { signers, count: result.rows.length });
        })
        .catch((err) => {
            console.log(err);
            response.sendStatus(500); // Internal Server Error
        });
});

server.get("/signers/:name", (request, response) => {
    if (!request.session.userId && !request.session.signatureId) {
        console.log("GET /signers  --- kein cookies");
        return response.redirect("/register");
    }
    //console.log("Get Elements in DB nach city:", request.params.name);
    db.getUsersNachCity(request.params.name)
        .then((result) => {
            const { rows: signers } = result;
            //console.log("Signers:", signers);
            response.render("signersCity", {
                signers,
                count: result.rows.length,
                city: request.params.name,
            });
        })
        .catch((err) => {
            console.log(err);
            response.sendStatus(500); // Internal Server Error
        });
});

server.listen("4000", () => {
    console.log("listening on http://localhost:4000");
});

function checkProfile(homepage, age, response, handlebars, signers) {
    console.log(age, homepage, signers);
    if (
        isNaN(age) &&
        !homepage.toLowerCase().startsWith("https://") &&
        !homepage.toLowerCase().startsWith("http://")
    ) {
        response.render(handlebars, {
            signers,
            nichtgueltigNaN: true,
            nichtgueltigHomepage: true,
        });
    } else {
        if (age === "") {
            age = null;
        } else {
            age = Number(age);
            if (isNaN(age)) {
                response.render(handlebars, { signers, nichtgueltigNaN: true });
            } else {
                if (
                    !homepage.toLowerCase().startsWith("http://") &&
                    !homepage.toLowerCase().startsWith("https://")
                ) {
                    response.render(handlebars, {
                        signers,
                        nichtgueltigHomepage: true,
                    });
                } else {
                    return;
                }
            }
        }
    }
}
