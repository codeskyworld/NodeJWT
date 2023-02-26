var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/register", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      err: true,
      message: "Request body incomplete - email and password needed",
    });
    return;
  }

  const queryUsers = req.db
    .from("users")
    .select("*")
    .where("email", "=", email);
  queryUsers
    .then((users) => {
      if (users.length > 0) {
        res.status(409).json({
          err: true,
          message: "User already exists!",
        });
        return;
      }

      //Insert user into DB
      const saltRounds = 10;
      const hashpassword = bcrypt.hashSync(password, saltRounds);
      return req.db.from("users").insert({ email, password: hashpassword });
    })
    .then(() => {
      res.status(201).json({ message: "User created" });
    });
});

router.post("/login", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  //Verify body
  if (!email || !password) {
    res.status(400).json({
      err: true,
      message: "Request body invalid - email and password are required",
    });
    return;
  }
  const queryUsers = req.db
    .from("users")
    .select("*")
    .where("email", "=", email);
  queryUsers
    .then((users) => {
      if (users.length === 0) {
        res.status(401).json({
          err: true,
          message: "Incorrect email or password",
        });
        return;
      }

      //Compare password hashes
      const user = users[0];
      return bcrypt.compare(password, user.password);
    })
    .then((match) => {
      if (!match) {
        res.status(401).json({
          err: true,
          message: "Incorrect email or password",
        });
        return;
      }

      //Create and return JWT token
      const secretKey = "secret key";
      const expires_in = 60 * 60 * 24; //1 Day
      const exp = Math.floor(Date.now() / 1000) + expires_in;
      const token = jwt.sign({ email, exp }, secretKey);
      res.json({ token_type: "Bearer", token, expires_in });
    });
});

module.exports = router;
