/**
 * Server Entry Point
 *
 * Starts the Express server on the configured port.
 * Separated from app.js so that tests can import the app
 * without starting the HTTP server.
 */
const createApp = require('./app');

/** Port the server listens on (default: 3000) */
const PORT = process.env.PORT || 3000;

const { app } = createApp();

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
  console.log(`📊 Open http://localhost:${PORT} in your browser to use the calculator.`);
});
