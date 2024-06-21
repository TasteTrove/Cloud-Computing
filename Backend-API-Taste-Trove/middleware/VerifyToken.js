var jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("No token found");
    return res.sendStatus(401); // Unauthorized if no token
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.sendStatus(403); // Forbidden if token invalid
    }
    console.log("Token verified successfully:", decoded);
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.nama = decoded.nama;
    next();
  });
};

module.exports = {
  verifyToken,
};
