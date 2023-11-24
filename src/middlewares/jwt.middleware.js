import jwt from "jsonwebtoken";
const SECRET_KEY_JWT = "jwtSecret";

export const jwtValidation = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const userToken = jwt.verify(token, SECRET_KEY_JWT);
    req.user = userToken;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};