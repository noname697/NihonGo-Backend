"use strict";

const bcrypt = require("bcrypt");

const getOrCreateSeedUser = async (queryInterface) => {
  const [existingUsers] = await queryInterface.sequelize.query(`
      SELECT id FROM users
      ORDER BY id ASC
      LIMIT 1;  
    `);

  if (existingUsers.length > 0) {
    return existingUsers[0].id;
  }

  const now = new Date();
  const passwordHash = await bcrypt.hash("super_secret", 10);

  await queryInterface.bulkInsert("users", [
    {
      name: "NihonGo Demo User",
      email: "demo@nihongo.local",
      password_hash: passwordHash,
      role: "student",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  const [createdUsers] = await queryInterface.sequelize.query(`
      SELECT id FROM users
      WHERE email = 'demo@nihongo.local'
      LIMIT 1;            
    `);

  return createdUsers[0].id;
};

const createDeck = async (queryInterface, deck) => {
  const [rows] = await queryInterface.sequelize.query(
    `
    INSERT INTO flashcard_decks
      (user_id, title, description, is_public, "createdAt", "updatedAt")
    VALUES
      (:user_id, :title, :description, :is_public, :createdAt, :updatedAt)
    RETURNING id; 
  `,
    {
      replacements: deck,
    },
  );

  return rows[0].id;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const userId = await getOrCreateSeedUser(queryInterface);

    const vocabularyDeckId = await createDeck(queryInterface, {
      user_id: userId,
      title: "N5 Vocabulary Starter",
      description: "Basic Japanese vocabulary for English speakers.",
      is_public: false,
      createdAt: now,
      updatedAt: now,
    });

    const kanjiDeckId = await createDeck(queryInterface, {
      user_id: userId,
      title: "N5 Basic Kanji",
      description:
        "Essential beginner kanji with meanings and example sentences.",
      is_public: false,
      createdAt: now,
      updatedAt: now,
    });

    const phrasesDeckId = await createDeck(queryInterface, {
      user_id: userId,
      title: "Beginner Japanese Phrases",
      description: "Short and useful Japanese phrases for early learners.",
      is_public: false,
      createdAt: now,
      updatedAt: now,
    });

    await queryInterface.bulkInsert(
      "flashcards",
      [
        {
          deck_id: vocabularyDeckId,
          front_text: "こんにちは",
          back_text: "Hello / Good afternoon",
          example_sentence: "こんにちは、元気ですか。",
          notes: "Used as a common daytime greeting.",
          position: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: vocabularyDeckId,
          front_text: "ありがとう",
          back_text: "Thank you",
          example_sentence: "ありがとう、先生。",
          notes: "A casual way to say thank you.",
          position: 2,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: vocabularyDeckId,
          front_text: "学生",
          back_text: "Student",
          example_sentence: "私は学生です。",
          notes: "Reading: がくせい.",
          position: 3,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: vocabularyDeckId,
          front_text: "先生",
          back_text: "Teacher",
          example_sentence: "田中さんは先生です。",
          notes: "Reading: せんせい.",
          position: 4,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: vocabularyDeckId,
          front_text: "水",
          back_text: "Water",
          example_sentence: "水を飲みます。",
          notes: "Reading: みず。",
          position: 5,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: kanjiDeckId,
          front_text: "日",
          back_text: "Sun / Day / Japan",
          example_sentence: "今日は日曜日です。",
          notes: "Common readings: にち, じつ, ひ, か.",
          position: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: kanjiDeckId,
          front_text: "人",
          back_text: "Person",
          example_sentence: "あの人は先生です。",
          notes: "Common readings: じん, にん, ひと.",
          position: 2,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: kanjiDeckId,
          front_text: "水",
          back_text: "Water",
          example_sentence: "水をください。",
          notes: "Common readings: すい, みず.",
          position: 3,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: kanjiDeckId,
          front_text: "火",
          back_text: "Fire",
          example_sentence: "火は危ないです。",
          notes: "Common readings: か, ひ.",
          position: 4,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: kanjiDeckId,
          front_text: "木",
          back_text: "Tree / Wood",
          example_sentence: "大きい木があります。",
          notes: "Common readings: もく, ぼく, き.",
          position: 5,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: phrasesDeckId,
          front_text: "私はアーサーです",
          back_text: "I am Arthur",
          example_sentence: null,
          notes: "Pattern: 私は + name  + です.",
          position: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: phrasesDeckId,
          front_text: "これは本です。",
          back_text: "This is a book.",
          example_sentence: null,
          notes: "これ means 'this'.",
          position: 2,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: phrasesDeckId,
          front_text: "水を飲みます。",
          back_text: "I drink water.",
          example_sentence: null,
          notes: "を marks the object of the action.",
          position: 3,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: phrasesDeckId,
          front_text: "日本語を勉強します。",
          back_text: "I study Japanese.",
          example_sentence: null,
          notes: "勉強します means 'to study'",
          position: 4,
          createdAt: now,
          updatedAt: now,
        },
        {
          deck_id: phrasesDeckId,
          front_text: "これは何ですか。",
          back_text: "What is this?",
          example_sentence: null,
          notes: "何 means 'what'. The particle か marks a question.",
          position: 5,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DELETE FROM flashcards
      WHERE deck_id IN (
        SELECT id FROM flashcard_decks
        WHERE title IN (
          'N5 Vocabulary Starter',
          'N5 Basic Kanji',
          'Beginner Japanese Phrases'
        )
      );  
    `);
    await queryInterface.sequelize.query(`
      DELETE FROM flashcard_decks
      WHERE title IN (
          'N5 Vocabulary Starter',
          'N5 Basic Kanji',
          'Beginner Japanese Phrases'
      );
    `);
  },
};
