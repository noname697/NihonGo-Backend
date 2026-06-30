const { z } = require("zod");

const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("ID must be a positive integer."),
  }),
});

const createDeckSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Deck title is required.")
      .max(100, "Deck title must have at most 100 characters."),

    description: z
      .string()
      .trim()
      .max(500, "Description must have at most 500 characters.")
      .optional()
      .nullable(),

    is_public: z.boolean().optional(),
  }),
});

const updateDeckSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Deck ID must be a positive integer."),
  }),

  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Deck title is required.")
      .max(100, "Deck title must have at most 100 characters.")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description must have at most 500 characters.")
      .optional()
      .nullable(),

    is_public: z.boolean().optional(),
  }),
});

const createCardSchema = z.object({
  params: z.object({
    deckId: z.coerce
      .number()
      .int()
      .positive("Deck ID must be a positive integer."),
  }),

  body: z.object({
    front_text: z
      .string()
      .trim()
      .min(1, "Front text is required.")
      .max(1000, "Front text must have at most 1000 characters."),

    back_text: z
      .string()
      .trim()
      .min(1, "Back text is required.")
      .max(1000, "Back text must have at most 1000 characters."),

    example_sentence: z
      .string()
      .trim()
      .max(1000, "Example sentence must have at most 1000 characters.")
      .optional()
      .nullable(),

    notes: z
      .string()
      .trim()
      .max(1000, "Notes must have at most 1000 characters.")
      .optional()
      .nullable(),
  }),
});

const updateCardSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Card ID must be a positive integer."),
  }),

  body: z.object({
    front_text: z
      .string()
      .trim()
      .min(1, "Front text is required.")
      .max(1000, "Front text must have at most 1000 characters.")
      .optional(),

    back_text: z
      .string()
      .trim()
      .min(1, "Back text is required.")
      .max(1000, "Back text must have at most 1000 characters.")
      .optional(),

    example_sentence: z
      .string()
      .trim()
      .max(1000, "Example sentence must have at most 1000 characters.")
      .optional()
      .nullable(),

    notes: z
      .string()
      .trim()
      .max(1000, "Notes must have at most 1000 characters.")
      .optional()
      .nullable(),

    position: z.coerce.number().int().positive().optional(),
  }),
});

const dueCardsSchema = z.object({
  query: z.object({
    deck_id: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

const reviewCardSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Card ID must be a positive integer."),
  }),

  body: z.object({
    is_correct: z.boolean({
      message: "is_correct must be a boolean value.",
    }),
  }),
});

module.exports = {
  idParamSchema,
  createDeckSchema,
  updateDeckSchema,
  createCardSchema,
  updateCardSchema,
  dueCardsSchema,
  reviewCardSchema,
};
