import jwt from "jsonwebtoken";
import envKeys from "../configEnv.js";

export const jwtValidation = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const userToken = jwt.verify(token, envKeys.jwt_secret);
    req.user = userToken;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};