const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "frontend/build")));

// routes all 404 back to react
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

module.exports = app;
