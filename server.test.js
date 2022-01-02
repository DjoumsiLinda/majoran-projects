const supertest = require("supertest");

const app = require("./server.js");

test("root route / should redirect to the /register", () => {
    return supertest(app)
        .get("/")
        .then((response) => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/register");
        });
});
