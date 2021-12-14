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
                response.redirect("/petition");
            })
            .catch((err) => {
                console.log(err);
                response.render("registration", {
                    error: true,
                });
            });
    });
});
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
            response.redirect("/thanks");
        })
        .catch((err) => {
            console.log(err);
            response.render("login", {
                error: true,
            });
        });
});

server.get("/thanks", (request, response) => {
    if (!request.session.userId) {
        console.log("GET /thanks --- kein cookies");
        return response.redirect("/register");
    }
    db.getSignaturesCount()
        .then((result) => {
            db.getSignaturesWithId(request.session.userId)
                .then((resultsignature) => {
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

server.get("/signers", (request, response) => {
    //console.log("GET /signers");
    if (!request.session.userId) {
        console.log("GET /signers  --- kein cookies");
        return response.redirect("/register");
    }
    console.log("Get Elements in DB");
    db.getUsers()
        .then((result) => {
            const { rows: signers } = result;
            response.render("signers", { signers, count: result.rows.length });
        })
        .catch((err) => {
            console.log(err);
            response.sendStatus(500); // Internal Server Error
        });
});

server.listen("4000", () => {
    console.log("listening on http://localhost:4000");
});
