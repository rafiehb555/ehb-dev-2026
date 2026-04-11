const express = require("express");
const userRoutes = require("./modules/user/user.routes");
const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

// This middleware lets Express read JSON data from incoming requests.
app.use(express.json());

// A simple health route helps confirm the server is running.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EHB backend is running.",
  });
});

// All user-related API endpoints will start with /api/users.
app.use("/api/users", userRoutes);

// This should be the last middleware so it can catch errors from above.
app.use(errorHandler);

module.exports = app;
