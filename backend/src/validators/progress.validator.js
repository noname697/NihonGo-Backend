const { z } = require("zod");

const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("ID must be a positive integer."),
  }),
});

const answerExerciseSchema = z.object({
  params: z.object({
    id: z.coerce
      .number()
      .int()
      .positive("Exercise ID must be a positive integer."),
  }),

  body: z.object({
    answer: z
      .string()
      .trim()
      .min(1, "Answer is required.")
      .max(255, "Answer must have at most 255 characters."),
  }),
});

module.exports = {
  idParamSchema,
  answerExerciseSchema,
};
