const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));


/* public files */

const fs = require('fs');
const navbar = fs.readFileSync("public/navbar.html", "utf8");
const footer = fs.readFileSync("public/footer.html", "utf8");
const index = fs.readFileSync("public/main.html", "utf8");
const signup = fs.readFileSync("public/signup/signup.html", "utf8");
const login = fs.readFileSync("public/login/login.html", "utf8");
const home = fs.readFileSync("public/home/home.html", "utf8");



const session = require('express-session');
app.use(session({
    secret: require('./config/configSession.json').sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
        sameSite: true,
        secure: false
    }
}));


const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // limit each IP to 100 requests per windowMs
});
app.use("/login", limiter);
app.use("/signup", limiter);


/* Setup Objection + Knex */

const { Model } = require('objection');
const Knex = require('knex');
const knexFile = require('./knexfile.js');

const knex = Knex(knexFile.development);

Model.knex(knex);


/* Add routes */

const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');

app.use(authRoute);
app.use(usersRoute);

const goToLoginPage = (req, res, next) => {
    if(!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

const goToHomePage = (req, res, next) => {
    if (req.session.username) {
        res.redirect('/home');
    } else {
        next();
    }
}


app.get("/", (req, res) => {
    console.log("session: ", req.sessionID);
    console.log("user:", req.session.username);

    return res.send(navbar + index + footer);
    
});

app.get("/signup", goToHomePage, (req, res) => {
    return res.send(navbar + signup + footer);
});

app.get("/login", goToHomePage, (req, res) => {
    console.log("session: ", req.sessionID);
    console.log("user:", req.session.username);

    return res.send(navbar + login + footer);
});

app.get("/home", goToLoginPage, (req, res) => {
    return res.send(navbar + home + footer);
})


/* Start server */

const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", PORT);
})