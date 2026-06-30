const createError = require("../utils/createError");
const { User } = require("../../models");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw createError("Name, email and password are required.", 400);
  }

  if (password.length < 8) {
    throw createError("Password must have at least 8 characters.", 400);
  }

  const userAlreadyExists = await User.findOne({ where: { email } });

  if (userAlreadyExists) {
    throw createError("This email is already registered.", 409);
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password_hash,
    role: "student",
  });

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw createError("Email and password are required.", 400);
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw createError("Invalid email or password.", 401);
  }

  const passwordIsValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordIsValid) {
    throw createError("Invalid email or password.", 401);
  }

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
