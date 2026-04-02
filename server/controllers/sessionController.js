//stores core logic of app here
const Session = require("../models/Session");
const stringSimilarity = require("string-similarity");
const Passage = require("../models/Passage"); // create a collection with reference passages

// SAVE DATA in MONGODB
const saveSession = async (req, res) => {
  try {
    console.log("🔥 BODY:", req.body);

    const { sessionId, events, text } = req.body;
//receive data from frontend here
//creates session below
    const newSession = new Session({
      sessionId,
      events,
      text
    });

    await newSession.save(); //saves to mongodb


    res.status(200).json({ message: "Saved successfully" });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// TO GET ALL SESSIONS
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

//  REAL-TIME COPY / PLAGIARISM CHECK
const checkPlagiarism = async (req, res) => {
  try {
    const { typedText, passageId } = req.body;

    const passage = await Passage.findById(passageId);//get reference text
    if (!passage) return res.status(404).json({ error: "Passage not found" });

    // Compare typed text with reference passage
    //string similarity library used
    const similarity = stringSimilarity.compareTwoStrings(typedText, passage.text); // 0-1
    const isCopied = similarity > 0.95; // threshold value for copy/paste detection

    res.json({ similarity, isCopied });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ EXPORT ALL
module.exports = { saveSession, getSessions, checkPlagiarism };