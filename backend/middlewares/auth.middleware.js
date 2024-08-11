const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.auth;

  if (!token) {
    console.log("token not available or invalid");
    return res.status(404).send("please login again");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res
        .status(404)
        .json({ message: "wrong login token please login again", err: err });
    } else {
      req.user = data;
      next();
    }
  });
};

module.exports = auth;
