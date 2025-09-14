const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) return res.json({ err: "Invalid token" });

  //extract the token from request headers authorization
  const token = authorizationHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized!" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Token is must required!" });
  }
};

const generateToken = (userData) => {
  try {
    const token = jwt.sign(userData, process.env.JWT_SECRETKEY);
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = { jwtAuthMiddleware, generateToken };
