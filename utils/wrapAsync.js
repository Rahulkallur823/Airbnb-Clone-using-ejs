// wrapAsync.js

// const { func } = require("joi");

module.exports = (fn) => {
    return(req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
