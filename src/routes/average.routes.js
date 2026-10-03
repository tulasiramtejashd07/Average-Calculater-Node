/**
 * Average Routes - API route handlers for the Running Average Calculator.
 *
 * Handles POST /average requests. Validates input and delegates
 * business logic to AverageService.
 */
const express = require('express');

/**
 * Create the average router with the given service instance.
 *
 * @param {import('../services/average.service')} averageService - The service instance to use.
 * @returns {express.Router} Configured Express router.
 */
function createAverageRouter(averageService) {
  const router = express.Router();

  /**
   * POST /average
   *
   * Accepts a JSON body with a "number" field.
   * Returns the updated running average, count, and sum.
   *
   * @name PostAverage
   * @route {POST} /average
   */
  router.post('/', (req, res) => {
    const { number } = req.body;

    // Validate: number field must be present
    if (number === undefined || number === null) {
      return res.status(400).json({
        error: 'The "number" field is required.'
      });
    }

    // Validate: must be a finite number (not a string, NaN, or Infinity)
    if (typeof number !== 'number' || !Number.isFinite(number)) {
      return res.status(400).json({
        error: 'The "number" field must be a valid finite number.'
      });
    }

    // Add the number and get updated statistics
    const stats = averageService.addNumber(number);

    return res.status(200).json(stats);
  });

  return router;
}

module.exports = createAverageRouter;
