// routes/invoices.js

const express = require("express");
const router = express.Router();

// Example route
router.get("/", (req, res, next) => {
  res.send("Invoices route");
});

module.exports = router;
