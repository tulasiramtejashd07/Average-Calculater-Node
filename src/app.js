/**
 * Express Application Setup
 *
 * Configures the Express app with middleware, static file serving,
 * and API routes. Separated from server.js so tests can import
 * the app without starting the server.
 */
const express = require('express');
const path = require('path');
const AverageService = require('./services/average.service');
const createAverageRouter = require('./routes/average.routes');

/**
 * Create and configure the Express application.
 *
 * @param {AverageService} [serviceInstance] - Optional service instance (for testing).
 * @returns {{ app: express.Application, averageService: AverageService }}
 */
function createApp(serviceInstance) {
  const app = express();

  // Create service instance (use provided one or create new)
  const averageService = serviceInstance || new AverageService();

  // --- Middleware ---

  // Parse JSON request bodies
  app.use(express.json());

  // Serve the frontend from the public/ folder
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // --- API Routes ---

  // Mount the average route at /average
  app.use('/average', createAverageRouter(averageService));

  // --- Error Handling ---

  // Handle malformed JSON in request body
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({
        error: 'Invalid JSON in request body.'
      });
    }
    next(err);
  });

  return { app, averageService };
}

module.exports = createApp;
