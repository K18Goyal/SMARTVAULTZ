const express = require("express");
const router = express.Router();
const { askFaq } = require("../controllers/faqController");

router.post("/chat", askFaq);

module.exports = router;
