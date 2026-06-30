# NihonGo! API Documentation

Backend API for **NihonGo!**, a fullstack platform for English speakers learning Japanese.

## Base URL

```txt
http://localhost:3001
```

## Authentication

Protected routes require a JWT token in the `Authorization` header.

```txt
Authorization: Bearer YOUR_TOKEN_HERE
```

## Standard Error Response

```json
{
  "message": "Validation error.",
  "errors": [
    {
      "path": "body.email",
      "message": "Invalid email address."
    }
  ]
}
```

---

# Health Check

## GET `/`

Checks if the API is running.

### Response

```json
{
  "message": "NihonGo! API is running",
  "environment": "development"
}
```

---

# Auth Routes

Base path:

```txt
/api/auth
```

## POST `/api/auth/register`

Creates a new user account.

### Body

```json
{
  "name": "Arthur",
  "email": "arthur@example.com",
  "password": "12345678"
}
```

### Response

```json
{
  "message": "User created successfully.",
  "user": {
    "id": 1,
    "name": "Arthur",
    "email": "arthur@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

---

## POST `/api/auth/login`

Logs in an existing user.

### Body

```json
{
  "email": "arthur@example.com",
  "password": "12345678"
}
```

### Response

```json
{
  "message": "Login successful.",
  "user": {
    "id": 1,
    "name": "Arthur",
    "email": "arthur@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

---

## GET `/api/auth/me`

Returns the authenticated user.

### Protected

Requires token.

### Response

```json
{
  "user": {
    "id": 1,
    "name": "Arthur",
    "email": "arthur@example.com",
    "role": "student",
    "createdAt": "2026-06-29T00:00:00.000Z",
    "updatedAt": "2026-06-29T00:00:00.000Z"
  }
}
```

---

# Content Routes

Base path:

```txt
/api/content
```

These routes return the learning content of NihonGo!, such as JLPT modules, lessons and exercises.

---

## GET `/api/content/modules`

Lists all learning modules.

### Response

```json
{
  "modules": [
    {
      "id": 1,
      "level": "N5",
      "title": "JLPT N5",
      "description": "Basic Japanese content for beginners.",
      "position": 1
    }
  ]
}
```

---

## GET `/api/content/modules/:id`

Returns a module and its lessons.

### Response

```json
{
  "module": {
    "id": 1,
    "level": "N5",
    "title": "JLPT N5",
    "description": "Basic Japanese content for beginners.",
    "position": 1,
    "lessons": [
      {
        "id": 1,
        "title": "The particle は",
        "description": "Introduction to the Japanese topic marker.",
        "position": 1
      }
    ]
  }
}
```

---

## GET `/api/content/lessons/:id`

Returns a lesson with its explanation text.

### Response

```json
{
  "lesson": {
    "id": 1,
    "module_id": 1,
    "title": "The particle は",
    "description": "Introduction to the Japanese topic marker.",
    "explanation_text": "The particle は marks the topic of the sentence...",
    "position": 1,
    "module": {
      "id": 1,
      "level": "N5",
      "title": "JLPT N5"
    }
  }
}
```

---

## GET `/api/content/lessons/:id/exercises`

Returns the exercises from a lesson.

### Important

This route should **not** return `correct_answer`. The correct answer is only returned after the user submits an answer.

### Response

```json
{
  "lesson": {
    "id": 1,
    "title": "The particle は"
  },
  "exercises": [
    {
      "id": 1,
      "lesson_id": 1,
      "type": "complete_sentence",
      "question": "わたし___アーサーです。",
      "position": 1,
      "options": [
        {
          "id": 1,
          "text": "は",
          "position": 1
        },
        {
          "id": 2,
          "text": "を",
          "position": 2
        }
      ]
    }
  ]
}
```

---

# Progress Routes

Base path:

```txt
/api/progress
```

All progress routes are protected.

---

## POST `/api/progress/exercises/:id/answer`

Submits an answer to an exercise.

### Protected

Requires token.

### Body

```json
{
  "answer": "は"
}
```

### Response

```json
{
  "message": "Answer submitted successfully.",
  "exercise": {
    "id": 1,
    "lesson_id": 1,
    "type": "complete_sentence",
    "question": "わたし___アーサーです。"
  },
  "result": {
    "submitted_answer": "は",
    "is_correct": true,
    "correct_answer": "は",
    "explanation": "The particle は marks the topic of the sentence.",
    "attempts_count": 1
  },
  "lesson_progress": {
    "lesson_id": 1,
    "total_exercises": 3,
    "correct_exercises": 1,
    "score": 33.33,
    "is_completed": false,
    "completed_at": null,
    "last_studied_at": "2026-06-29T00:00:00.000Z"
  }
}
```

---

## GET `/api/progress/lessons/:id`

Returns the authenticated user's progress for a specific lesson.

### Protected

Requires token.

### Response

```json
{
  "lesson": {
    "id": 1,
    "title": "The particle は",
    "description": "Introduction to the Japanese topic marker."
  },
  "lesson_progress": {
    "lesson_id": 1,
    "total_exercises": 3,
    "correct_exercises": 2,
    "score": 66.67,
    "is_completed": true,
    "completed_at": "2026-06-29T00:00:00.000Z",
    "last_studied_at": "2026-06-29T00:00:00.000Z"
  },
  "exercise_progress": [
    {
      "exercise_id": 1,
      "answer": "は",
      "is_correct": true,
      "attempts_count": 1,
      "answered_at": "2026-06-29T00:00:00.000Z"
    }
  ]
}
```

---

## GET `/api/progress/modules/:id`

Returns the authenticated user's progress for a specific module.

### Protected

Requires token.

### Response

```json
{
  "module": {
    "id": 1,
    "level": "N5",
    "title": "JLPT N5",
    "description": "Basic Japanese content for beginners.",
    "lessons": []
  },
  "summary": {
    "total_lessons": 3,
    "completed_lessons": 1,
    "progress_percentage": 33.33
  }
}
```

---

## GET `/api/progress/overview`

Returns the authenticated user's progress across all modules.

### Protected

Requires token.

### Response

```json
{
  "progress": [
    {
      "id": 1,
      "level": "N5",
      "title": "JLPT N5",
      "description": "Basic Japanese content for beginners.",
      "position": 1,
      "total_lessons": 3,
      "completed_lessons": 1,
      "progress_percentage": 33.33
    }
  ]
}
```

---

# Trainer Routes

Base path:

```txt
/api/trainer
```

The trainer system is used for Hiragana, Katakana and Kanji practice.

---

## GET `/api/trainer/characters`

Lists study characters.

### Query Params

```txt
type=hiragana | katakana | kanji
jlpt_level=N5 | N4 | N3 | N2 | N1
character_group=vowels
```

### Example

```txt
GET /api/trainer/characters?type=hiragana
```

### Response

```json
{
  "characters": [
    {
      "id": 1,
      "type": "hiragana",
      "symbol": "あ",
      "romaji": "a",
      "meaning": null,
      "onyomi": null,
      "kunyomi": null,
      "jlpt_level": null,
      "stroke_count": 3,
      "character_group": "vowels",
      "position": 1
    }
  ]
}
```

---

## GET `/api/trainer/characters/random`

Returns random study characters.

### Query Params

```txt
type=hiragana | katakana | kanji
jlpt_level=N5 | N4 | N3 | N2 | N1
character_group=vowels
limit=10
```

### Example

```txt
GET /api/trainer/characters/random?type=hiragana&limit=5
```

---

## POST `/api/trainer/characters/:id/answer`

Submits an answer for a character.

### Protected

Requires token.

### Body

```json
{
  "answer": "a"
}
```

### Response

```json
{
  "message": "Answer submitted successfully.",
  "character": {
    "id": 1,
    "type": "hiragana",
    "symbol": "あ",
    "romaji": "a",
    "meaning": null,
    "onyomi": null,
    "kunyomi": null,
    "jlpt_level": null
  },
  "result": {
    "submitted_answer": "a",
    "is_correct": true,
    "correct_answers": {
      "romaji": "a",
      "meaning": null,
      "onyomi": null,
      "kunyomi": null
    }
  },
  "progress": {
    "correct_attempts": 1,
    "wrong_attempts": 0,
    "mastery_score": 100,
    "last_practiced_at": "2026-06-29T00:00:00.000Z"
  }
}
```

---

## GET `/api/trainer/progress`

Returns the authenticated user's trainer progress.

### Protected

Requires token.

### Query Params

```txt
type=hiragana | katakana | kanji
jlpt_level=N5 | N4 | N3 | N2 | N1
character_group=vowels
```

### Response

```json
{
  "progress": [
    {
      "character_id": 1,
      "correct_attempts": 1,
      "wrong_attempts": 0,
      "last_answer": "a",
      "last_result": true,
      "mastery_score": 100,
      "last_practiced_at": "2026-06-29T00:00:00.000Z"
    }
  ]
}
```

---

# Flashcard Routes

Base path:

```txt
/api/flashcards
```

All flashcard routes are protected.

---

## POST `/api/flashcards/decks`

Creates a new flashcard deck.

### Protected

Requires token.

### Body

```json
{
  "title": "N5 Vocabulary",
  "description": "Basic Japanese vocabulary for beginners.",
  "is_public": false
}
```

### Response

```json
{
  "message": "Flashcard deck created successfully.",
  "deck": {
    "id": 1,
    "user_id": 1,
    "title": "N5 Vocabulary",
    "description": "Basic Japanese vocabulary for beginners.",
    "is_public": false
  }
}
```

---

## GET `/api/flashcards/decks`

Lists the authenticated user's decks.

### Protected

Requires token.

### Response

```json
{
  "decks": [
    {
      "id": 1,
      "title": "N5 Vocabulary",
      "description": "Basic Japanese vocabulary for beginners.",
      "is_public": false,
      "cards_count": 5,
      "createdAt": "2026-06-29T00:00:00.000Z",
      "updatedAt": "2026-06-29T00:00:00.000Z"
    }
  ]
}
```

---

## GET `/api/flashcards/decks/:id`

Returns a deck with its cards.

### Protected

Requires token.

### Response

```json
{
  "deck": {
    "id": 1,
    "title": "N5 Vocabulary",
    "description": "Basic Japanese vocabulary for beginners.",
    "is_public": false,
    "cards": [
      {
        "id": 1,
        "front_text": "水",
        "back_text": "Water",
        "example_sentence": "水を飲みます。",
        "notes": "Reading: みず.",
        "position": 1
      }
    ]
  }
}
```

---

## PUT `/api/flashcards/decks/:id`

Updates a deck.

### Protected

Requires token.

### Body

```json
{
  "title": "Updated Deck Title",
  "description": "Updated description.",
  "is_public": true
}
```

### Response

```json
{
  "message": "Flashcard deck updated successfully.",
  "deck": {
    "id": 1,
    "title": "Updated Deck Title",
    "description": "Updated description.",
    "is_public": true
  }
}
```

---

## DELETE `/api/flashcards/decks/:id`

Deletes a deck and its cards.

### Protected

Requires token.

### Response

```json
{
  "message": "Flashcard deck deleted successfully."
}
```

---

## POST `/api/flashcards/decks/:deckId/cards`

Creates a new flashcard inside a deck.

### Protected

Requires token.

### Body

```json
{
  "front_text": "水",
  "back_text": "Water",
  "example_sentence": "水を飲みます。",
  "notes": "Reading: みず."
}
```

### Response

```json
{
  "message": "Flashcard created successfully.",
  "card": {
    "id": 1,
    "deck_id": 1,
    "front_text": "水",
    "back_text": "Water",
    "example_sentence": "水を飲みます。",
    "notes": "Reading: みず.",
    "position": 1
  }
}
```

---

## PUT `/api/flashcards/cards/:id`

Updates a flashcard.

### Protected

Requires token.

### Body

```json
{
  "front_text": "水",
  "back_text": "Water",
  "example_sentence": "水をください。",
  "notes": "Common reading: みず."
}
```

---

## DELETE `/api/flashcards/cards/:id`

Deletes a flashcard.

### Protected

Requires token.

### Response

```json
{
  "message": "Flashcard deleted successfully."
}
```

---

## GET `/api/flashcards/due`

Returns flashcards that are due for review.

### Protected

Requires token.

### Query Params

```txt
deck_id=1
limit=20
```

### Behavior

This route returns:

```txt
cards that were never reviewed
cards whose due_date is now or in the past
```

It should not return cards whose next review is scheduled for the future.

### Response

```json
{
  "cards": [
    {
      "id": 1,
      "deck_id": 1,
      "deck": {
        "id": 1,
        "title": "N5 Vocabulary"
      },
      "front_text": "水",
      "back_text": "Water",
      "example_sentence": "水を飲みます。",
      "notes": "Reading: みず.",
      "position": 1,
      "review": {
        "id": null,
        "correct_attempts": 0,
        "wrong_attempts": 0,
        "review_count": 0,
        "mastery_score": 0,
        "due_date": "2026-06-29T00:00:00.000Z",
        "last_reviewed_at": null,
        "status": "new"
      }
    }
  ]
}
```

---

## POST `/api/flashcards/cards/:id/review`

Reviews a flashcard.

### Protected

Requires token.

### Body

```json
{
  "is_correct": true
}
```

### Response

```json
{
  "message": "Flashcard reviewed successfully.",
  "flashcard": {
    "id": 1,
    "deck_id": 1,
    "front_text": "水",
    "back_text": "Water",
    "example_sentence": "水を飲みます。",
    "notes": "Reading: みず."
  },
  "review": {
    "is_correct": true,
    "correct_attempts": 1,
    "wrong_attempts": 0,
    "review_count": 1,
    "mastery_score": 100,
    "due_date": "2026-06-30T00:00:00.000Z",
    "last_reviewed_at": "2026-06-29T00:00:00.000Z"
  }
}
```

---

## GET `/api/flashcards/progress`

Returns flashcard review progress.

### Protected

Requires token.

### Response

```json
{
  "progress": [
    {
      "flashcard_id": 1,
      "correct_attempts": 1,
      "wrong_attempts": 0,
      "review_count": 1,
      "mastery_score": 100,
      "due_date": "2026-06-30T00:00:00.000Z",
      "last_reviewed_at": "2026-06-29T00:00:00.000Z",
      "flashcard": {
        "id": 1,
        "front_text": "水",
        "back_text": "Water",
        "deck_id": 1,
        "deck": {
          "id": 1,
          "title": "N5 Vocabulary"
        }
      }
    }
  ]
}
```

---

# Dashboard Routes

Base path:

```txt
/api/dashboard
```

All dashboard routes are protected.

---

## GET `/api/dashboard/summary`

Returns a complete dashboard summary for the authenticated user.

### Protected

Requires token.

### Response

```json
{
  "summary": {
    "modules_progress": [
      {
        "id": 1,
        "level": "N5",
        "title": "JLPT N5",
        "description": "Basic Japanese content for beginners.",
        "position": 1,
        "total_lessons": 3,
        "completed_lessons": 1,
        "progress_percentage": 33.33
      }
    ],
    "lesson_stats": {
      "total_lessons": 3,
      "started_lessons": 1,
      "completed_lessons": 1,
      "completion_percentage": 33.33,
      "average_score": 100
    },
    "exercise_stats": {
      "total_exercises": 3,
      "answered_exercises": 1,
      "correct_exercises": 1,
      "accuracy_percentage": 100,
      "completion_percentage": 33.33
    },
    "trainer_stats": {
      "total_characters": 15,
      "studied_characters": 1,
      "mastered_characters": 1,
      "study_percentage": 6.67,
      "correct_attempts": 1,
      "wrong_attempts": 0,
      "accuracy_percentage": 100,
      "average_mastery": 100
    },
    "flashcard_stats": {
      "total_decks": 3,
      "total_cards": 15,
      "reviewed_cards": 1,
      "due_cards": 14,
      "review_completion_percentage": 6.67,
      "correct_attempts": 1,
      "wrong_attempts": 0,
      "accuracy_percentage": 100,
      "average_mastery": 100
    },
    "recent_activity": {
      "recent_lessons": [],
      "recent_characters": [],
      "recent_flashcards": []
    }
  }
}
```

---

# Validation Rules

The API uses validation for request body, params and query strings.

Examples:

## Invalid email

```json
{
  "message": "Validation error.",
  "errors": [
    {
      "path": "body.email",
      "message": "Invalid email address."
    }
  ]
}
```

## Invalid ID

```json
{
  "message": "Validation error.",
  "errors": [
    {
      "path": "params.id",
      "message": "ID must be a positive integer."
    }
  ]
}
```

---

# Rate Limit

The API has global rate limiting and stricter limits for authentication routes.

Possible response:

```json
{
  "message": "Too many requests. Please try again later."
}
```

For authentication routes:

```json
{
  "message": "Too many authentication attempts. Please try again later."
}
```

---

# Main Backend Features

```txt
Authentication
JLPT learning modules
Lessons and exercises
Exercise progress
Kana/Kanji trainer
Trainer progress
Flashcard decks
Flashcard reviews
Dashboard summary
Validation
Rate limiting
CORS configuration
Centralized error handling
```
