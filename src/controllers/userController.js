const userQueries = require("../db/queries.users.js");
const passport = require("passport");

const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(secretKey);
const User = require("../db/models/").User;





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

  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", {user});
      }
    });
  },

  upgradeForm(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "No user found with that ID");
        res.render("/")
      } else {
        res.render("users/upgrade", {user})
      }
    });

  },

  upgrade(req, res, next){
    // Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; //Using Express
    const email = req.body.stripeEmail;

    User.findOne({
      where: { email: email}
    })
    .then((user) => {
      if(user){
        const charge = stripe.charges.create({
          amount: 1500,
          currency: 'usd',
          description: 'Upgrade To Premium',
          source: token
        })
        .then((result) => {
          if(result){
            userQueries.changeRole(user);
            req.flash("notice", "You have been updated to Premium.");
            res.redirect("/")
          } else{
              req.flash("notice", "Upgrade unsuccessful.");
              res.redirect("users/show", {user});
          }
        });
      }   
    });

  },

  downgradeForm(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "No user found with that ID");
        res.redirect("/")
      } else {
        res.render("users/downgrade", {user})
      }
    });

  },

  downgrade(req, res, next){
    userQueries.getUser(req.params.id, (err, user) => {
      if(err || user === undefined){
        req.flash("notice", "Warning: Downgrade Failed.");
        res.redirect("users/show", {user});
      } else {
        userQueries.changeRole(user);
        req.flash("notice", "You have been downgraded to Standard Plan ");
        res.redirect("/")
      }
    });
  }
  
  


}
