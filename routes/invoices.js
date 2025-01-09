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


/** Adds an invoice. Needs to be passed in JSON body of: {comp_code, amt}
Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}} **/
router.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt, paid, add_date, paid_date } = req.body;

    // Validate required fields
    if (!comp_code || amt === undefined || paid === undefined) {
      throw new ExpressError("comp_code, amt, and paid are required", 400);
    }

    // Check if comp_code exists in companies table
    const companyCheck = await db.query(
      "SELECT code FROM companies WHERE code = $1",
      [comp_code]
    );

    if (companyCheck.rows.length === 0) {
      throw new ExpressError(`Company with code '${comp_code}' does not exist.`, 400);
    }

    // Validate dates
    const validAddDate = add_date ? new Date(add_date) : null;
    const validPaidDate = paid_date ? new Date(paid_date) : null;

    if (add_date && isNaN(validAddDate)) {
      throw new ExpressError("Invalid add_date format. Must be a valid date.", 400);
    }
    if (paid_date && isNaN(validPaidDate)) {
      throw new ExpressError("Invalid paid_date format. Must be a valid date.", 400);
    }

    // Insert invoice
    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [comp_code, amt, paid, validAddDate, validPaidDate]
    );

    res.status(201).json({ invoice: result.rows[0] });
  } catch (e) {
    return next(e);
  }
});


module.exports = router;