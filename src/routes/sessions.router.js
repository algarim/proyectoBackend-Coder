import { Router } from "express";
import { usersManager } from "../dao/managers/UsersManager.js";
import { hashData, compareData } from "../utils.js";
import passport from "passport";

const router = Router();

// router.post("/signup", async (req, res) => {
//   const { first_name, last_name, email, password } = req.body;
//   if (!first_name || !last_name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const hashedPassword  = await hashData(password);
//     const createdUser = await usersManager.createUser({...req.body, password: hashedPassword});
//     res.status(200).json({ message: "User created", user: createdUser });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const user = await usersManager.getUserByEmail(email);
//     if (!user) {
//       return res.status(404).json({ message: "User not found with email " + email });
//     }
//     const isPasswordValid = await compareData(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Password is not valid" });
//     }
//     const sessionInfo =
//       (email === "adminCoder@coder.com")
//         ? { email, first_name: user.first_name, role: "admin" }
//         : { email, first_name: user.first_name, role: "user" };
//     req.session.user = sessionInfo;
//     res.redirect("/products");
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// SIGNUP LOGIN  - PASSPORT

router.post('/signup', passport.authenticate("signup", { successRedirect: '/products', failureRedirect: "/signup", failureMessage: "Registration failed. Please verify your information and try again." }));

router.post('/login', passport.authenticate("login", {
  // successRedirect: '/products',
  failureRedirect: "/login",
  failureMessage: "Failed to login. Please verify your information and try again."
}), (req, res) => {
  let role =  (req.user.email === "adminCoder@coder.com")
  ? "admin"
  : "user";
  req.session.role = role;
  res.redirect('/products')
});

// SIGNUP - LOGIN - PASSPORT - GITHUB
router.get('/auth/github', passport.authenticate('github', { scope: ["user: email"] }));

router.get('/callback', passport.authenticate("github"), (req, res) => {
  let role =  (req.user.email === "adminCoder@coder.com")
  ? "admin"
  : "user";
  req.session.role = role;
  res.redirect('/products')});

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
export default router;
