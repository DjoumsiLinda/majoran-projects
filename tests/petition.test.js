const supertest = require("supertest");

// jest automagically loads the mocked version for us.
// __mocks__/cookie-session.js
const cookieSession = require("cookie-session");
const db = require("../db.js");
jest.mock("../db.js");

const app = require("../server.js");

test("Users who are logged out are redirected to the registration page when they attempt to go to the petition page", () => {
    return supertest(app)
        .get("/petition")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/register");
        });
});

test("Users who are logged in and have signed the petition are redirected to the thank you page when they attempt to go to the petition page or submit a signature", () => {
    cookieSession.mockSession({
        userId: 123,
        signatureId: 123,
    });
    return supertest(app)
        .get("/petition")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/thanks");
        });
});

test("Test Post", () => {
    cookieSession.mockSession({
        userId: 123,
    });
    db.addSignatures.mockResolvedValueOnce({
        userId: 123,
        signature: "123",
    });

    return supertest(app)
        .post("/petition")
        .send({ signature: "123" })
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/thanks");
        });
});
