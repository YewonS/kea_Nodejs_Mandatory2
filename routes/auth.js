const route = require('express').Router();

const User = require('../models/User.js');
const Role = require('../models/Role.js');

const nodemailer = require('nodemailer');
const emailValidator = require('email-validator');
const nodemailerCred = require('../config/nodemailercred.js'); // TODO: Don't forget to create this file!

const bcrypt = require('bcrypt');
const saltRounds = 12;

route.post("/login", async (req, res) => {
    // 1. retrieve the login details and validate
    // 2. check for a user match in the database
    // 3. bcrypt compare
    // 4. sessions
    const { username, password } = req.body;

    if (username && password) {
        try {
            User.query().select('username').where({ 'username': username }).then( async userFound => {
                if (userFound.length == 0) {
                    return res.redirect("/login?error");
                } else {
                    const matchingPassword = await User.query().select('password').where({ 'username': username }).limit(1);
                    const passwordToValidate = matchingPassword[0].password;

                    bcrypt.compare(password, passwordToValidate).then((result) => {
                        if (result) {
                            // if true
                            req.session.username = username;
                            return res.redirect("/home");
                        } else {
                            return res.redirect("login?error");
                        }
                    });
                }

            });
        } catch (error) {
            return res.redirect("/login?error");
        }

    } else {
        return res.redirect("/login?error");
    }
    
});

route.post("/signup", async (req, res) => {
    
    const { username, email, password, passwordRepeat } = req.body;
    
    const isPasswordTheSame = password === passwordRepeat;
    
    if (username && email && password && isPasswordTheSame) {

        // password requirements
        if (password.length < 8) {
            return res.status(400).send({ response: "Password does not fulfill the requirements" });
        } else if (!emailValidator.validate(email)) {
            return res.status(400).send({ response: "Email is not valid" });
        } else {

            try {
                
            const userFound = await User.query().select().where({ 'username': username }).limit(1);
            if (userFound.length > 0) {
                return res.status(400).send({ response: "User already exists" });
            } else {
               
                const defaultUserRoles = await Role.query().select().where({ role: 'USER' });

                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const createdUser = await User.query().insert({
                    username,
                    email,
                    password: hashedPassword,
                    roleId: defaultUserRoles[0].id
                });

                // send email to user 
                sendEmail(email);

                req.session.username = username;
                // return res.send({ response: `User has been created with the username ${createdUser.username}` });
                return res.redirect("/login");
            }

            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the database" });
            }
        }
    } else if (password && passwordRepeat && !isPasswordTheSame) {
        return res.status(400).send({ response: "Passwords do not match. Fields: password and passwordRepeat" });
    } else {
        return res.status(404).send({ response: "Missing fields: username, password, passwordRepeat" });
    }
    
});

route.get("/logout", (req, res) => {
    req.session.destroy((error)=> {
        console.log("Error happend when logging out:", error);
    })
    // return res.send({ response: "OKOK" });
    return res.redirect('/');
});


function sendEmail(email) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: nodemailerCred.email,
          pass: nodemailerCred.password
        }
      });
      
      const mailOptions = {
        from: nodemailerCred.email,
        to: email,
        subject: 'Secret Message account registration',
        text: "Hello. \nWelcome to Secret Message. \nCongratulations. You are now registered. \nThank you for giving me your information. \nNo worries though, we'll keep them safe. :D "
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}




module.exports = route;