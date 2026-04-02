//It defines the structure of reference text used to compare user typing
const mongoose = require("mongoose");

const passageSchema = new mongoose.Schema({
  text: String//each passage stores some text
});

module.exports = mongoose.model("Passage", passageSchema);
//creates collection in mongodb