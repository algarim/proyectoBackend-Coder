import { Router } from "express";
import { usersManager } from "../dao/managers/UsersManager.js";
const router = Router();

router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const createdUser = await usersManager.createUser(req.body);
    res.status(200).json({ message: "User created", user: createdUser });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await usersManager.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found with email " + email });
    }
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is not valid" });
    }
    const sessionInfo =
      (email === "adminCoder@coder.com")
        ? { email, first_name: user.first_name, role: "admin" }
        : { email, first_name: user.first_name, role: "user" };
    req.session.user = sessionInfo;
    res.redirect("/products");
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
export default router;
