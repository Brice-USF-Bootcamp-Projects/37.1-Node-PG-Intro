// routes/companies.js

const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");


router.get('/', async (req, res, next) => {
    try {
      const results = await db.query(`SELECT * FROM companies`);
      return res.json({ companies: results.rows })
    } catch (e) {
      return next(e);
    }
  })

module.exports = router


router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query ('SELECT * FROM companies WHERE id =$1', [id])
    if (results.rows.length === 0) {
      throw new ExpressError(`Company with id of ${id} does not exist.`, 404)
    }
    return res.send({ company: results.rows[0] })
  } catch (e) {
    return next (e)
  }
})


