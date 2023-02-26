var express = require("express");
var path = require("path");
const fs = require("fs");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const cors = require("cors");
const helmet = require("helmet");

const swaggerUI = require("swagger-ui-express");
const yaml = require("yaml");
const file = fs.readFileSync("./docs/swagger.yaml", "utf8");
const swaggerDocument = yaml.parseDocument(file);

const knex_options = require("./database/knexfile");
const knex = require("knex")(knex_options);
const knexLogger = require("knex-logger");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(cors());
app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

logger.token("req", (req, res) => JSON.stringify(req.headers));
logger.token("res", (req, res) => {
  const headers = {};
  res.getHeaderNames().map((h) => (headers[h] = res.getHeader(h)));
  return JSON.stringify(headers);
});
app.use(logger("common"));

app.use((req, res, next) => {
  req.db = knex;
  next();
});
app.use(knexLogger(knex));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
