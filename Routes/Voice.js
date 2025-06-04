const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
const { validateApiKey } = require('../MiddleWare/TokenValidator');



router.use(validateApiKey);

// === Get all voices ===
router.get("/all", async (req, res) => {
  try {
    const client = req.retellClient;
    const voiceResponses = await client.voice.list();

    res.status(200).json({
      status: true,
      data: voiceResponses,
    });
  } catch (error) {
    console.error("Error getting voices:", error);
    res.status(500).json({
      status: false,
      message: "Failed to get voices",
      error: error.message,
    });
  }
});

// === Get voice by ID ===
router.get("/get/:id", async (req, res) => {
  try {
    const client = req.retellClient;
    const { id } = req.params;

    const voiceResponse = await client.voice.retrieve(id);

    res.status(200).json({
      status: true,
      data: voiceResponse,
    });
  } catch (error) {
    console.error("Error getting voice:", error);
    res.status(500).json({
      status: false,
      message: "Failed to get voice",
      error: error.message,
    });
  }
});

module.exports = router;
