require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// The port is read from environment variables with a safe fallback.
const PORT = process.env.PORT || 5000;

// This function starts the whole backend application.
// We connect the database first so the API is ready to work correctly.
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

startServer();
