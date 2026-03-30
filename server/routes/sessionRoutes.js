const express = require("express");
const router = express.Router();
const { saveSession, getSessions } = require("../controllers/sessionController");

router.post("/session", saveSession);
router.get("/sessions", getSessions);
//maps api to controller

module.exports = router;