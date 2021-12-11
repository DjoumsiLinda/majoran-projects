const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const cookieParser = require("cookie-parser");
//const { signature } = require("./public/script.js");
const db = require("./db.js");

const server = express();

// this will give us access to req.body (e.g. for handling POST requests)
server.use(
    express.urlencoded({
        extended: false,
    })
);
server.use(cookieParser());

server.engine("handlebars", engine());
server.set("view engine", "handlebars");

server.use(express.static(path.join(__dirname)));

server.get("/petition", (request, response) => {
    console.log("GET /petition", request.body);
    response.render("petition");
    //console.log(signature);
});

server.post("/petition", (request, response) => {
    console.log("POST /petition", request.body);
    response.send("petition POST");
});

server.get("/thanks", (request, response) => {
    console.log("GET /thanks");
    response.send("thanks");
});

server.get("/signers", (request, response) => {
    console.log("GET /signers");
    response.send("signers");
});
server.listen("3300", () => {
    console.log("listening on http://localhost:3300");
});
