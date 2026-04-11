const User = require("./user.model");

// Services hold business logic.
// This keeps controllers small and makes logic easier to reuse later.
const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

module.exports = {
  createUser,
  getAllUsers,
};
