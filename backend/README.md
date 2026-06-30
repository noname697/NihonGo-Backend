# NihonGo! Backend

A REST API for **NihonGo!**, a fullstack platform that helps English speakers learn Japanese through JLPT modules, lessons, exercises, kana/kanji practice, flashcards, and progress tracking.

> This repository contains only the backend API. The frontend will be built separately with Vite, React and Tailwind CSS.

---

## Preview

The backend is designed to power the NihonGo! web app, including authentication, dashboard data, learning content, flashcards and practice tools.

```txt
NihonGo!
English → Japanese learning platform
```

> Screenshot/GIF coming soon after the frontend is created.

---

## Try It

Local API URL:

```txt
http://localhost:3001
```

Health check:

```txt
GET http://localhost:3001
```

Full API documentation:

[Read the API Docs](./docs/API.md)

---

## Features

- User authentication with JWT.
- JLPT learning modules from N5 to N1.
- Lessons with explanation text and exercises.
- Exercise answer checking and lesson progress tracking.
- Kana/Kanji trainer for hiragana, katakana and kanji practice.
- Flashcard decks, flashcards and review scheduling.
- Dashboard summary route for frontend home data.
- Centralized validation with Zod.
- Centralized error handling.
- CORS configuration, Helmet security headers and rate limiting.
- PostgreSQL database with Sequelize migrations and seeders.

---

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Sequelize
- Sequelize CLI
- JWT
- bcrypt
- Zod
- Morgan
- Helmet
- CORS
- express-rate-limit
- dotenv

---

## Requirements

Before running the project locally, make sure you have:

- Node.js 18+ recommended
- PostgreSQL installed and running
- npm installed

---

## How to Run Locally

Clone the repository and enter the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development

PORT=3001

FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nihongo_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=10
```

Create the database:

```bash
npx sequelize-cli db:create
```

Run migrations:

```bash
npx sequelize-cli db:migrate
```

Run seeders:

```bash
npx sequelize-cli db:seed:all
```

Start the development server:

```bash
npm run dev
```

The API should be running at:

```txt
http://localhost:3001
```

---

## Available Scripts

```bash
npm run dev
```

Starts the API in development mode with Nodemon.

```bash
npm start
```

Starts the API with Node.

```bash
npm run db:migrate
```

Runs pending Sequelize migrations.

```bash
npm run db:migrate:undo
```

Reverts the last migration.

```bash
npm run db:seed
```

Runs all seeders.

```bash
npm run db:seed:undo
```

Reverts all seeders.

---

## Main API Routes

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Content

```txt
GET /api/content/modules
GET /api/content/modules/:id
GET /api/content/lessons/:id
GET /api/content/lessons/:id/exercises
```

### Progress

```txt
POST /api/progress/exercises/:id/answer
GET  /api/progress/lessons/:id
GET  /api/progress/modules/:id
GET  /api/progress/overview
```

### Trainer

```txt
GET  /api/trainer/characters
GET  /api/trainer/characters/random
POST /api/trainer/characters/:id/answer
GET  /api/trainer/progress
```

### Flashcards

```txt
POST   /api/flashcards/decks
GET    /api/flashcards/decks
GET    /api/flashcards/decks/:id
PUT    /api/flashcards/decks/:id
DELETE /api/flashcards/decks/:id

POST   /api/flashcards/decks/:deckId/cards
PUT    /api/flashcards/cards/:id
DELETE /api/flashcards/cards/:id

GET    /api/flashcards/due
POST   /api/flashcards/cards/:id/review
GET    /api/flashcards/progress
```

### Dashboard

```txt
GET /api/dashboard/summary
```

For full route details, request/response examples and validation rules, see:

[docs/API.md](./docs/API.md)

---

## How It Works

The backend follows a layered structure:

```txt
routes → controllers → services → models
```

Routes define the endpoints, controllers handle request and response logic, services contain business rules, and Sequelize models represent the database tables.

The database schema is managed with Sequelize migrations instead of relying on automatic sync. This makes the database structure easier to version, share and maintain as the project grows.

The learning system is separated into modules, lessons, exercises and progress records. This allows the frontend to show module progress, lesson completion, exercise accuracy and dashboard summaries without mixing educational content with user-specific progress.

The flashcard system stores decks and cards separately from review progress. This makes it possible to reuse the same card data while tracking each user's performance, review count, mastery score and next due date.

The trainer system uses a single `study_characters` table for hiragana, katakana and kanji. This keeps the practice logic reusable and avoids creating three separate systems for similar behavior.

---

## Project Structure

```txt
backend/
  config/
  docs/
    API.md
  migrations/
  models/
  seeders/
  src/
    config/
    controllers/
    middlewares/
    routes/
    services/
    utils/
    validators/
    app.js
    server.js
  .env.example
  .sequelizerc
  package.json
  README.md
```

---

## Environment Variables

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Current environment, usually `development` or `production`. |
| `PORT` | Port where the API runs. |
| `FRONTEND_URL` | Allowed frontend origin for CORS. |
| `DB_HOST` | PostgreSQL host. |
| `DB_PORT` | PostgreSQL port. |
| `DB_NAME` | PostgreSQL database name. |
| `DB_USER` | PostgreSQL database user. |
| `DB_PASSWORD` | PostgreSQL database password. |
| `JWT_SECRET` | Secret used to sign JWT tokens. |
| `JWT_EXPIRES_IN` | JWT expiration time. |
| `RATE_LIMIT_WINDOW_MS` | Rate limit time window in milliseconds. |
| `RATE_LIMIT_MAX` | Maximum requests per rate limit window. |
| `AUTH_RATE_LIMIT_MAX` | Maximum auth requests per rate limit window. |

---

## Seeded Data

The backend includes seeders for initial testing data, such as:

- JLPT modules.
- Beginner lessons and exercises.
- Hiragana, katakana and basic kanji characters.
- Flashcard decks for vocabulary, kanji and beginner phrases.

This makes it easier to test the API before the frontend is ready.

---

## Notes for Testing

After running migrations and seeders, you can:

1. Register or login with a user.
2. Copy the returned JWT token.
3. Use the token in protected routes:

```txt
Authorization: Bearer YOUR_TOKEN_HERE
```

You can test routes using tools like:

- Postman
- Insomnia
- Thunder Client
- curl

---

## Future Improvements

- Add refresh tokens with HTTP-only cookies.
- Add admin routes for managing lessons and exercises.
- Add public/shared flashcard decks.
- Add stronger spaced repetition logic.
- Add unit and integration tests.
- Add OpenAPI/Swagger documentation.
- Add deployment configuration.

---

## Credits

Built as part of the NihonGo! fullstack learning project.

Main technologies and libraries used:

- Express
- Sequelize
- PostgreSQL
- Zod
- JWT
- bcrypt
- Helmet
- Morgan
- CORS
- express-rate-limit

---

## AI Usage Disclosure

AI assistance was used to help plan the backend architecture, organize the README structure and improve documentation clarity.
