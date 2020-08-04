const User = require("../models/user");
const resetPasswordMailer = require("../mailers/reset_password_mailer");
const ResetPasswordToken = require("../models/reset_password");
const resetPassword = require("../models/user");
const crypto = require("crypto");

const bcrypt = require("bcrypt");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, (err, user) => {
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

module.exports.create = async (req, res) => {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }

    let user = await User.findOne({ email: req.body.email });
    //if user does not already exist then signup(create new user)
    if (!user) {
      let hash = await bcrypt.hash(req.body.password, 10);

      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      req.flash("success", "Usr created! Login to continue.");

      return res.redirect("/users/sign-in");
    } else {
      req.flash("error", "User already exists");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("error in finding user and signing up", error);
  }
};

//sign in and create session for the user
module.exports.createSession = async function (req, res) {
  req.flash("success", "Logged in successfully");
  return res.redirect(`/users/profile/${req.user.id}`);
};

module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect(`/users/profile/${req.user.id}`);
  }
  return res.render("sign_in");
};

module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect(`/users/profile/${req.user.id}`);
  }
  return res.render("sign_up");
};

module.exports.signOut = function (req, res) {
  req.flash("success", "You have logged out!");
  req.logout();
  return res.redirect("/users/sign-in");
};

module.exports.forgotPassword = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect(`/users/profile/${req.user.id}`);
  }
  return res.render("forgot_password", { title: "Reset Password" });
};

module.exports.resetPassword = function (req, res) {
  // console.log(req.bo)
  if (req.isAuthenticated()) {
    return res.redirect(`/users/profile/${req.user.id}`);
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log("user not found");
      req.flash("error", "User does not exist!");
      return res.redirect("back");
    }
    if (!user) {
      console.log("user not found");
      req.flash("error", "User does not exist!");
      return res.redirect("back");
    } else {
      ResetPasswordToken.findOne({
        user: user.id,
      }).then(function (resetPassword) {
        if (resetPassword) {
          resetPassword.remove();
        }
        ResetPasswordToken.create(
          {
            token: crypto.randomBytes(20).toString("hex"),
            // isValid:true,
            user: user._id,
          },
          (err, token) => {
            if (err) {
              console.log("error in creating token", err);
              return res.redirect("back");
            }
            let forgotuser = { user: user, token: token.token };
            resetPasswordMailer.newPassword(forgotuser);
          }
        );
      });
      req.flash("success", "Password reset mail sent!");
      return res.redirect("back");
    }
  });
};

module.exports.setNewPassword = function (req, res) {
  ResetPasswordToken.findOne(
    {
      token: req.params.accesstoken,
    },
    (err, token) => {
      if (err) {
        console.log("error in setting password", err);
        return res.redirect("/users/sign-in");
      }
      if (token) {
        return res.render("reset_password", {
          title: "Reset Password",
          token: req.params.accesstoken,
        });
      } else {
        return res.redirect("/users/sign-in");
      }
    }
  );
};

module.exports.newPasswordSuccess = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Password and confirm password did not match!");
      return res.redirect("back");
    }
    let token = await ResetPasswordToken.findOne({
      token: req.params.accesstoken,
    });
    if (token) {
      let hash = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(token.user, { password: hash });
      req.flash("success", "Password reset successfully!");
      token.remove();
      return res.redirect("/users/sign-in");
    } else {
      req.flash("error", "Reset password link expired!");
      return res.redirect("/users/forgot-password");
    }
  } catch (error) {
    console.log("error in setting password", error);
    return res.redirect("/users/sign-in");
  }
};
