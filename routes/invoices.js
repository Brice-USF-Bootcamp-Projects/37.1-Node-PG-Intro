// routes/invoices.js

const express = require("express");
const ExpressError = require('../expressError')
const router = express.Router();
const db = require('../db')

// Return info on invoices: like {invoices: [{id, comp_code}, ...]}
router.get("/", async (req, res, next) => {
  try {
    const results = await db.query('SELECT * FROM invoices');
    return res.json({ invoices: results.rows })
  } catch (e) {
    return next (e)
  }
});

module.exports = router;
