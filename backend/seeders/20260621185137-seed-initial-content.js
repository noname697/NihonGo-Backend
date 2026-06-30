"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("modules", [
      {
        id: 1,
        level: "N5",
        title: "JLPT N5",
        description: "Basic content to start studying Japanese.",
        position: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        level: "N4",
        title: "JLPT N4",
        description: "Continuing with the fundamentals of Japanese.",
        position: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        level: "N3",
        title: "JLPT N3",
        description:
          "Intermediate content covering grammar, reading, and vocabulary.",
        position: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        level: "N2",
        title: "JLPT N2",
        description:
          "Advanced content for more natural reading and comprehension.",
        position: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        level: "N1",
        title: "JLPT N1",
        description: "Advanced and complex Japanese language content.",
        position: 5,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("lessons", [
      {
        id: 1,
        module_id: 1,
        title: "Particle は",
        description: "Introduction to topic markers in Japanese.",
        explanation_text:
          "The particle は (wa) is used to indicate the topic of a sentence. Although it is written with the hiragana は, in this usage it is pronounced as 'wa'. Example: わたしはアーサーです means 'I am Arthur'.",
        position: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        module_id: 1,
        title: "です",
        description: "A polite way of stating something.",
        explanation_text:
          "です is a polite form used at the end of noun phrases or with adjectives of the type な. It can function as 'is', 'am', 'are', or 'is being', depending on the context. Example: これは本です means 'This is a book'.",
        position: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        module_id: 1,
        title: "これ・それ・あれ",
        description: "Basic demonstrative pronouns.",
        explanation_text:
          "これ means 'this', used for something close to the speaker. それ means 'that', used for something close to the listener. あれ means 'that ... over there', used for something distant from both.",
        position: 3,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("exercises", [
      {
        id: 1,
        lesson_id: 1,
        type: "complete_sentence",
        question: "わたし＿アーサーです。",
        correct_answer: "は",
        explanation:
          "The particle は marks the topic of the sentence. Here, わたし is the topic.",
        position: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        lesson_id: 2,
        type: "complete_sentence",
        question: "これは本＿＿。",
        correct_answer: "です",
        explanation: "です is used to end a sentence politely.",
        position: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        lesson_id: 3,
        type: "multiple_choice",
        question: "What word means 'this' in Japanese?",
        correct_answer: "これ",
        explanation: "これ is used for something close to the speaker.",
        position: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("exercise_options", [
      {
        exercise_id: 1,
        text: "は",
        is_correct: true,
        position: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        exercise_id: 1,
        text: "を",
        is_correct: false,
        position: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        exercise_id: 1,
        text: "に",
        is_correct: false,
        position: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        exercise_id: 2,
        text: "です",
        is_correct: true,
        position: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        exercise_id: 2,
        text: "ます",
        is_correct: false,
        position: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        exercise_id: 2,
        text: "は",
        is_correct: false,
        position: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        exercise_id: 3,
        text: "これ",
        is_correct: true,
        position: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        exercise_id: 3,
        text: "それ",
        is_correct: false,
        position: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        exercise_id: 3,
        text: "あれ",
        is_correct: false,
        position: 3,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("exercise_options", null, {});
    await queryInterface.bulkDelete("exercises", null, {});
    await queryInterface.bulkDelete("lessons", null, {});
    await queryInterface.bulkDelete("modules", null, {});
  },
};
