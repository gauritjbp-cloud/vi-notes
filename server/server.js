const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const sessionRoutes = require("./routes/sessionRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", sessionRoutes);
app.use("/api", authRoutes);

app.get("/", (req, res) => res.send("API running..."));

mongoose.connect("mongodb://127.0.0.1:27017/vi-notes")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on http://localhost:5000"));