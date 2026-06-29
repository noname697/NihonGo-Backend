const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must have at least 2 characters.")
      .max(80, "Name must have at most 80 characters."),

    email: z
      .string()
      .trim()
      .email("Invalid email address.")
      .max(120, "Email must have at most 120 characters."),

    password: z
      .string()
      .min(8, "Password must have at least 8 characters.")
      .max(100, "Password must have at most 100 characters."),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address."),
    password: z.string().min(1, "Password is required."),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
