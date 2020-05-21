const express = require('express');
const app = express();

app.use(express.json());

const session = require('express-session');
app.use(session({
    secret: require('./config/mysqlCredentials.js').sessionSecret,
    resave: false,
    saveUninitialized: true
}));

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8 // limit each IP to 100 requests per windowMs
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


const fs = require('fs');
const navbar = fs.readFileSync("public/navbar.html", "utf8");
const footer = fs.readFileSync("public/footer.html", "utf8");
const index = fs.readFileSync("public/index.html", "utf8");
const signup = fs.readFileSync("public/signup/signup.html", "utf8");

app.get("/", (req, res) => {
    return res.send(navbar + index + footer)
});

app.get("/signup", (req, res) => {
    return res.send(navbar + signup + footer)
});


/* Start server */

const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", PORT);
})