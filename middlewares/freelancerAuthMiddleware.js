const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const freelancerToken = req.header("freelancerToken");
  if (!freelancerToken) {
    res.json({ error: "please login first" });
  } else {
    try {
      const validToken = jwt.verify(freelancerToken, "accessToken");
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
