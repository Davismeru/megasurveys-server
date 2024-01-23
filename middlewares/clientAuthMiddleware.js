const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const clientToken = req.header("clientToken");
  if (!clientToken) {
    res.json({ error: "please login first" });
  } else {
    try {
      const validToken = jwt.verify(clientToken, "accessToken");
      req.user = validToken;
      if (validToken) {
        res.json(validToken);
        return next();
      }
    } catch (err) {
      return res.json({ error: err });
    }
  }
};

module.exports = validateToken;
