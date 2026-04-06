const express = require("express");
const userController = require("./user.controller");

const router = express.Router();

// This route creates a new user.
router.post("/", userController.createUser);

// This route returns all users.
router.get("/", userController.getUsers);

module.exports = router;
