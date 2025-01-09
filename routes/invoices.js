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

// Returns obj on given invoice.
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query ('SELECT * FROM invoices WHERE id = $1', [id])
    if (results.rows.length === 0) {
      throw new ExpressError(`Invoice with id of ${ id } does not exist`, 404)
    }
    return res.send({invoice: results.rows[0] })
  } catch (e) { 
    return next (e)
  }
})

module.exports = router;
