import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";

const router = Router();

// SIGNUP LOGIN  - PASSPORT

router.post('/signup', passport.authenticate("signup", {
  successRedirect: '/products',
  failureRedirect: "/signup",
  failureMessage: "Registration failed. Please verify your information and try again."
}));

router.post('/login', passport.authenticate("login", {
  failureRedirect: "/login",
  failureMessage: "Failed to log in. Please verify your information and try again."
}), (req, res) => {
  const { first_name, last_name, email, role, isGithub } = req.user;
  const token = generateToken({ first_name, last_name, email, role, isGithub });
  res.cookie('token', token, { maxAge: 60000, httpOnly: true }).redirect('/products');
});

// SIGNUP - LOGIN - PASSPORT - GITHUB
router.get('/auth/github', passport.authenticate('github', { scope: ["user: email"] }));

router.get('/callback', passport.authenticate("github"), (req, res) => {
  const { first_name, last_name, email, role, isGithub } = req.user;
  const token = generateToken({ first_name, last_name, email, role, isGithub });
  res.cookie('token', token, { maxAge: 60000, httpOnly: true }).redirect('/products');
});

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// CURRENT USER
router.get("/current", jwtValidation, passport.authenticate('jwt', { session: false }), (req, res) => {
  if (!req.cookies.token) {
    return res.status(404).json({ message: "No user currently logged in" })
  }

  const { first_name, last_name, email, role, isGithub } = req.user;

  res.status(200).json({ first_name, last_name, email, role, isGithub });
});

export default router;


