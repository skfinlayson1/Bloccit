const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../db/models").User;
const authHelper = require("../auth/helpers");

module.exports = {

    init(app) {
        app.use(passport.initialize());
        app.use(passport.session());

        const userEmail = {usernameField: "email"};

        passport.use(new LocalStrategy(userEmail, (email, password, done) => {
            User.findOne({
                where: {email}
            })
            .then((user) => {
                if(!user || !authHelper.comparePass(password, user.password)) {
                    return done(null, false, {message: "Invalid email or password"});
                }

                return done(null, user);
            })
        }));

        passport.serializeUser((user, callback) => {
            callback(null, user.id);
        });

        passport.deserializeUser((id, callback) => {
            User.findById(id) //have to use findById, findByPk not available until version 5 
            .then((user) => {
                callback(null, user);
            })
            .catch((err) => { //corrected parentheses
                callback(err, user);
            })
        });
    }

}