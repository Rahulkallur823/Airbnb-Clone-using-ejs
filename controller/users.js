const passport = require('passport');
const ExpressError = require('../utils/ExpressError.js');
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// module.exports.signup = async (req, res) => {
//     try {
//         let { username, email, password } = req.body;
//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);
//         console.log(registeredUser);
//         await req.login(registeredUser); // Added await
//         req.flash("success", "Welcome to the wonderlust");
//         res.redirect("/listings");
//     } catch (e) {
//         console.log(e);
//         req.flash("error", e.message);
//         res.redirect("/signup");
//     }
// };
module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => { // Adding callback function
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to the wonderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // Corrected res.locals to req.session
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => { // Added next parameter
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    });
};
