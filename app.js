/** BizTime express application. */


const express = require("express");

const ExpressError = require("./expressError")
const companiesRoutes = require('./routes/companies');

const app = express();

app.use('/companies', companiesRoutes);

// Parse request bodies for JSON
app.use(express.json());


/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
