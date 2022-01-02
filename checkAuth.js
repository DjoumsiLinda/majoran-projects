module.exports.checkAuth = (email, response, handlebars, profile) => {
    if (!email.includes("@")) {
        response.render(handlebars, {
            profile,
            nichtgueltigEmail: true,
        });
        return false;
    }
    return true;
};
