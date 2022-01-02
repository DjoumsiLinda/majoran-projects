module.exports.requireUserNotLoggedIn = (req, res, next) => {
    //si le userId  est par exp 12 va a la page petition.==> requireUserNotLoggedIn(pas besion de login)
    if (req.session.userId) {
        return res.redirect("/petition");

        // you can react to the requested url from within your middleware
        /*if (req.url === "/login") {
            return res.redirect("/thanks");
        } else {
            return res.redirect("/petition");
        }*/
    }

    next();
};

module.exports.requireUserLoggedIn = (req, res, next) => {
    //si le userId est fauy va a la page register.==> requireUserLoggedIn(va a la page regiter)
    if (!req.session.userId) {
        return res.redirect("/register");
    }

    next();
};

module.exports.requireUserSigned = (req, res, next) => {
    if (!req.session.signatureId) {
        return res.redirect("/petition");
    }

    next();
};

module.exports.requireUserNotSigned = (req, res, next) => {
    if (req.session.signatureId) {
        return res.redirect("/thanks");
    }

    next();
};
