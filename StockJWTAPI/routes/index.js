const express = require("express");
const mysql = require("mysql");
var router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey = "secret key";

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token = null;

  //Retrieve token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
  } else {
    res.status(403).json({
      error: true,
      message: "Authorization header not found",
    });

    return;
  }

  //Verify JWT and check expiration date
  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.exp > Date.now()) {
      res.status(403).json({
        error: true,
        message: "Token has expired",
      });
      return;
    }

    //Permit user to advance to route
    next();
  } catch (e) {
    res.status(403).json({
      error: true,
      message: "Token is not valid",
    });
  }
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "The World Database API" });
});

router.get("/api", function (req, res, next) {
  res.render("index", { title: "lots of routes available" });
});

router.get("/stocks/symbols", (req, res, next) => {
  let industry;
  if (Object.keys(req.query).length > 0) {
    industry = req.query.industry;
    if (!industry) {
      res.status(400).json({
        error: true,
        message: "Invalid query parameter: only 'industry' is permitted",
      });
    }
  }

  req.db
    .from("stocks")
    .distinct("name", "symbol", "industry")
    .where((builder) => {
      if (!!industry)
        builder.where("industry", "like", `%${decodeURIComponent(industry)}%`);
    })
    .then((rows) => {
      if (rows.length === 0) {
        res.status(404).json({
          error: true,
          message: "Industry sector not found",
        });
      } else {
        res.json(rows);
      }
    })
    .catch((err) => {
      res.status(404).json({
        error: true,
        message: "Error executing query",
      });
    });
});

router.get("/stocks/:symbols", (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    res.status(400).json({
      error: true,
      message:
        "Date parameters only available on authenticated route /stocks/authed",
    });
  }
  req.db
    .from("stocks")
    .select("*")
    .where("symbol", "=", req.params.symbols)
    .then((rows) => {
      if (rows.length === 0) {
        res.status(404).json({
          error: true,
          message: "No entries for symbol in stocks database",
        });
      } else {
        res.json(rows);
      }
    })
    .catch((err) => {
      res.status(404).json({
        error: true,
        message: "Error executing query",
      });
    });
});
router.get("/stocks/authed/:symbols", authorize, (req, res, next) => {
  let from = req.query.from;
  let to = req.query.to;
  let symbol = req.params.symbols;
  let validate = true;
  if (Object.keys(req.query).length > 0) {
    if (!from && !to) {
      validate = false;
    } else {
      if (!!from) validate = isDate(from) && validate;
      if (!!to) validate = isDate(to) && validate;
    }
    if (!validate) {
      res.status(400).json({
        error: true,
        message:
          "Parameters allowed are 'from' and 'to', example: /stocks/authed/AAL?from=2020-03-1",
      });
    }
  }

  req
    .db("stocks")
    .select()
    .where((builder) => {
      if (!!from) builder.where("timestamp", ">=", decodeURIComponent(from));
      if (!!to) builder.where("timestamp", "<=", decodeURIComponent(to));
      if (!!symbol) builder.where("symbol", "=", symbol);
    })
    .then((rows) => {
      if (rows.length === 0) {
        res.status(404).json({
          error: true,
          message:
            "No entries available for query symbol for supplied date range",
        });
      } else {
        res.json(rows);
      }
    })
    .catch((err) => {
      res.status(404).json({
        error: true,
        message: "Error executing query",
      });
    });
});

const isDate = function (date) {
  date = decodeURIComponent(date);
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

module.exports = router;
