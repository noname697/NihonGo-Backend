const { z } = require("zod");

const characterTypes = ["hiragana", "katakana", "kanji"];
const jlptLevels = ["N5", "N4", "N3", "N2", "N1"];

const listCharactersSchema = z.object({
  query: z.object({
    type: z.enum(characterTypes).optional(),
    jlpt_level: z.enum(jlptLevels).optional(),
    character_group: z.string().trim().max(80).optional(),
  }),
});

const randomCharactersSchema = z.object({
  query: z.object({
    type: z.enum(characterTypes).optional(),
    jlpt_level: z.enum(jlptLevels).optional(),
    character_group: z.string().trim().max(80).optional(),
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
});

const answerCharacterSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int()
      .positive("Character ID must be a positive integer."),
  }),

  body: z.object({
    answer: z
      .string()
      .trim()
      .min(1, "Answer is required.")
      .max(255, "Answer must be at most 255 characters."),
  }),
});

const trainerProgressSchema = z.object({
  query: z.object({
    type: z.enum(characterTypes).optional(),
    jlpt_level: z.enum(jlptLevels).optional(),
    character_group: z.string().trim().max(80).optional(),
  }),
});

module.exports = {
  listCharactersSchema,
  randomCharactersSchema,
  answerCharacterSchema,
  trainerProgressSchema,
};
