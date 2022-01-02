const supertest = require("supertest");

// jest automagically loads the mocked version for us.
// __mocks__/cookie-session.js
const cookieSession = require("cookie-session");

const app = require("../server.js");

// pour senregistrer
/*test("for registration should render register page", () => {
    return supertest(app)
        .get("/register")
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("registration");
        });
});

//pour senregistrer, /register doit rediriger vers /profile
test("for registration should redirect to /profile", () => {
    cookieSession.mockSession({
        userId: 123,
    });
    return supertest(app)
        .get("/register")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/petition");
        });
});*/

// pour les utilisateurs anonymes /login devrait rendre la page de connexion
test("for anonymous users /login should render login page", () => {
    return supertest(app)
        .get("/login")
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("Log In");
        });
});

//    Users who are logged in are redirected to the petition page when they attempt to go to either the registration page or the login page
//pour les utilisateurs connectés, /login doit rediriger vers /petition
test("for logged-in users /login/registers should redirect to /petition", () => {
    cookieSession.mockSession({
        userId: 237,
    });

    return supertest(app)
        .get("/login" || "/register")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/petition");
        });
});
