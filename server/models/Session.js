const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: String,

  events: [
    {
      type: { //key press
        type: String
      },
      timestamp: Number,//when typed
      duration: Number//gap between keys
    }
  ],

  text: String

}, { timestamps: true });


module.exports = mongoose.model("Session", sessionSchema);