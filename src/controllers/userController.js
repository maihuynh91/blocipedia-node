const userQueries = require("../db/queries.users.js");
const passport = require("passport");


module.exports = {

  signUp(req, res, next){
    res.render("users/sign_up");
  },

   create(req, res, next){
      let newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation
      };

      userQueries.createUser(newUser, (err, user) => {
        if(err){
          req.flash("notice", "This email is already registered.");
          res.redirect("/users/sign_up");
        } else {
          passport.authenticate("local")(req, res, () => {
            req.flash("notice", "You have successfully signed up to Blocipedia App!");
            res.redirect("/");
          })
        }
      });
    }
  


}
