const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

//load user model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //matches user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "email is not registered" });
          }
          //check password
          bycrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "password is not correct" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
