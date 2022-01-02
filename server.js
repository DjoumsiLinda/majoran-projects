const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/auth.js");
const deleteAccountRouter = require("./routes/deleteAccount.js");
const deleteSignatureRouter = require("./routes/deleteSignature.js");
const logoutRouter = require("./routes/logout.js");
const petitionRouter = require("./routes/petition.js");
const profileRouter = require("./routes/profile.js");
const profileEditRouter = require("./routes/profileEdit.js");
const signersRouter = require("./routes/signers.js");
const thanksRouter = require("./routes/thanks.js");
const errorRouter = require("./routes/serverError.js");
let link = [];
//heroku
let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    sessionSecret = require("./secrets.json").sessionSecret;
}

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
            title() {
                return "Petition";
            },
            link() {
                return link[link.length - 2]; //serais surchager ;(
            },
        },
    })
);
server.set("view engine", "handlebars");

server.use(express.static(path.join(__dirname)));

//Middeleware
server.use((req, res, next) => {
    link.push(req.url);
    console.log("📢", req.method, req.url, req.session);

    next();
});

// prevent ClickJacking attacks
server.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");

    next();
});

server.use(authRouter);
server.use(deleteAccountRouter);
server.use(deleteSignatureRouter);
server.use(logoutRouter);
server.use(petitionRouter);
server.use(profileRouter);
server.use(profileEditRouter);
server.use(signersRouter);
server.use(thanksRouter);
server.use(errorRouter);

server.get("/", (request, response) => {
    response.redirect("/register");
});

if (require.main === module) {
    server.listen(process.env.PORT || 4900, () => {
        console.log("listening on http://localhost:4900");
    });
}
module.exports = server;

//https://dashboard.heroku.com/apps/einfuegen/settings
//https://git.heroku.com/einfuegen.git
