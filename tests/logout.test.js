const supertest = require("supertest");

// jest automagically loads the mocked version for us.
// __mocks__/cookie-session.js
const cookieSession = require("cookie-session");

const app = require("../server.js");

test("for logout should redirect to /register", () => {
    cookieSession.mockSessionOnce({
        userId: 123,
        signatureId: 234,
    });
    return supertest(app)
        .get("/petition/logout")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/register");
        });
});
