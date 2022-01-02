/*
to install
$ npm init -y
$ npm install express
$ npm install express-handlebars
*/

const path = require("path");
const express = require("express");
const app = express();

app.use(
    express.urlencoded({
        extended: false,
    })
);

// The order of the middleware is important!
// They run in the same order as they are defined.

// we can even create our own middlewares.
// they are just functions with a specified set of arguments
app.use((req, res, next) => {
    // we need to call next at the end of our middleware.
    // to tell express that it can go on with the next one (middleware / route handler)
    console.log(req.url);
    next();
});

const { engine } = require("express-handlebars");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

const projects = require("./projects.json");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/projects")));

app.get("/", (request, response) => {
    response.redirect("/projects");
});
app.get("/projects", (request, response) => {
    response.render("projects", {
        projects,
        title: "Portfolio",
        subtitle: "Welcome to My Portfolio !!",
        year: new Date().getFullYear(),
    });
});
app.get("/projects/:name", (request, response) => {
    const list = [];
    const project = request.params.name;
    let index;
    for (var o = 0; o < projects.length; o++) {
        list.push(projects[o].directory);
        if (projects[o].directory === project) {
            index = o;
        }
    }
    const selectedProject = list.find((item) => item === project);
    //if project from params doesn't match any project in project list
    if (!selectedProject) {
        console.log("fehler");
        return response.sendStatus(404);
    }

    return response.render("description", {
        list,
        title: projects[index].title,
        img: projects[index].screenshot,
        decription: projects[index].description,
        link: projects[index].directory,
    });
});

if (require.main === module) {
    app.listen(process.env.PORT || 3700, () => {
        console.log("Server is gestartet 😀");
    };
}