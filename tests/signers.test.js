const supertest = require("supertest");

// jest automagically loads the mocked version for us.
// __mocks__/cookie-session.js
const cookieSession = require("cookie-session");

const app = require("../server.js");

test(" Users who are logged in and have not signed the petition are redirected to the petition page when they attempt to go the signers page", () => {
    cookieSession.mockSession({
        userId: 123,
        signatureId: 234,
    });
    return supertest(app)
        .get("/signers")
        .then((response) => {
            expect(response.statusCode).toBe(200);
        });
});

test(" Users who are logged in and have not signed the petition are redirected to the petition page when they attempt to go the signers page", () => {
    cookieSession.mockSession({
        userId: 123,
    });
    return supertest(app)
        .get("/signers")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/petition");
        });
});
