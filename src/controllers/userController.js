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
    },

  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  // signIn(req, res, next){
  //   passport.authenticate("local")(req, res, function () {
  //     if(!req.user){
  //       req.flash("notice", "Sign in failed. Please try again.")
  //       res.redirect("/users/sign_in");
  //     } else {
  //       req.flash("notice", "You've successfully signed in!");
  //       res.redirect("/");
  //     }
  //   })
  // },



  signIn(req, res, next){
    passport.authenticate("local", function(err, user, info){
      if(err){
        next(err);
      }
      if(!user){
        req.flash("notice", "Error: The email or password you entered is incorrect.")
        res.redirect("/users/sign_in");
      }
      req.logIn(user,function(err){
        if(err){
          next(err);
        }
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      });
    })(req, res, next);
   },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  }

  
  


}
