# Running Average Calculator — REST API

## Project Overview

A simple REST API that exposes a single `POST /average` endpoint. Submit any number and the API returns the **running average**, **count**, and **sum** of all numbers submitted since the server started.

A clean, responsive webpage is included so users can enter numbers, submit them, and view live statistics — all powered by the backend API.

---

## Features

- **Single API endpoint** — `POST /average`
- **Input validation** — Rejects invalid, missing, or non-numeric input with clear error messages
- **In-memory storage** — No database required; data resets on server restart
- **Live statistics** — Running average, count, and sum update after each submission
- **Number history** — Full list of submitted numbers displayed on the page
- **Responsive UI** — Works on desktop and mobile
- **Automated tests** — Jest + Supertest test suite
- **Conventional Commits** — Enforced via Husky + Commitlint

---

## Technology Stack

| Layer      | Technology             |
|------------|------------------------|
| Backend    | Node.js, Express.js    |
| Frontend   | HTML5, CSS3, Vanilla JS|
| Testing    | Jest, Supertest        |
| Git Hooks  | Husky, Commitlint      |

---

## Project Structure

```text
Average-Calculater-Api/
│
├── public/                  # Frontend files (served by Express)
│   ├── index.html           # Webpage markup
│   ├── style.css            # Styles
│   └── script.js            # Frontend logic (Fetch API)
│
├── src/                     # Backend source code
│   ├── app.js               # Express app configuration
│   ├── server.js            # Server entry point
│   ├── routes/
│   │   └── average.routes.js  # Route handler for POST /average
│   └── services/
│       └── average.service.js # Business logic (number storage & calculation)
│
├── tests/
│   └── average.test.js      # Automated test suite
│
├── .husky/                  # Git hooks
│   ├── pre-commit           # Runs tests before each commit
│   └── commit-msg           # Validates commit message format
│
├── .gitignore
├── .commitlintrc.json       # Commitlint configuration
├── package.json
├── package-lock.json
└── README.md
```

---

## Prerequisites

- **Node.js** (version 16 or higher) — [Download Node.js](https://nodejs.org/)
- **Git** — [Download Git](https://git-scm.com/)

Verify installation:

```bash
node --version
git --version
```

---

## Installation

```bash
git clone YOUR_REPOSITORY_URL
cd ayurtech-average-api
npm install
```

This installs all dependencies and sets up the Husky Git hooks automatically (via the `prepare` script).

---

## How to Start the Server

### Development / Default

```bash
npm run dev
```

### Production

```bash
npm start
```

The server starts at: **http://localhost:3000**

---

## How to Access the Webpage

Open your browser and visit:

```
http://localhost:3000
```

The webpage and API run on the same origin — no CORS configuration needed.

---

## API Documentation

### Endpoint

```
POST /average
Content-Type: application/json
```

### Request Body

```json
{
  "number": 10
}
```

### Successful Response (HTTP 200)

```json
{
  "average": 10,
  "count": 1,
  "sum": 10
}
```

### Example: Multiple Requests

| Request # | Number Sent | Response                                       |
|-----------|-------------|------------------------------------------------|
| 1         | 10          | `{ "average": 10, "count": 1, "sum": 10 }`    |
| 2         | 20          | `{ "average": 15, "count": 2, "sum": 30 }`    |
| 3         | 30          | `{ "average": 20, "count": 3, "sum": 60 }`    |

### Error Responses (HTTP 400)

**Missing number:**

```json
{ "error": "The \"number\" field is required." }
```

**String input:**

```json
{ "error": "The \"number\" field must be a valid finite number." }
```

**Invalid JSON:**

```json
{ "error": "Invalid JSON in request body." }
```

### Testing with cURL

```bash
curl -X POST http://localhost:3000/average \
  -H "Content-Type: application/json" \
  -d '{"number": 10}'
```

---

## Running Tests

```bash
npm test
```

For watch mode (re-runs tests on file changes):

```bash
npm run test:watch
```

Tests do **not** require a running server — Supertest creates a temporary server instance for each test.

---

## Git Hooks

### Pre-commit Hook

Runs the full test suite before every commit. If any test fails, the commit is blocked.

### Commit Message Hook

Validates that commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) format.

**Valid examples:**

```
feat: add running average API
test: add API validation tests
docs: update README instructions
fix: handle invalid request body
style: improve calculator webpage
```

**Invalid examples (will be rejected):**

```
updated code
my changes
final submission
```

### Verifying Hooks Are Installed

After running `npm install`, check that the `.husky/` directory contains `pre-commit` and `commit-msg` files. You can also run:

```bash
npx husky
```

If hooks are not installed, run:

```bash
npm run prepare
```

---

## Data Storage

- Numbers are stored **in-memory** in a JavaScript array.
- **No database** is used.
- All data is **lost when the server restarts**.
- This is intentional and by design for this assignment.

---

## Limitations

- Data does not persist across server restarts.
- No authentication or rate limiting.
- Designed for single-user, local demonstration purposes.
- Not intended for production deployment.

---

## Publishing to GitHub

```bash
# Initialize Git repository (if not already done)
git init

# Stage all files
git add .

# Make your first commit
git commit -m "feat: add running average calculator API with frontend and tests"

# Create a GitHub repository, then add it as remote
git remote add origin https://github.com/YOUR_USERNAME/Average-Calculater-Node.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Demonstrating to the Evaluator

1. Clone the repository and run `npm install`.
2. Start the server with `npm run dev`.
3. Open `http://localhost:3000` in a browser.
4. Submit a few numbers and observe the running average update.
5. Run `npm test` to show all automated tests passing.
6. Make a test commit to demonstrate Conventional Commit enforcement.
7. Walk through the project structure and explain the separation of concerns.

---


