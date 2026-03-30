const mongoose = require("mongoose");

const passageSchema = new mongoose.Schema({
  text: String
});

module.exports = mongoose.model("Passage", passageSchema);