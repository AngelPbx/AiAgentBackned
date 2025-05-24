const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
require('dotenv').config();

// Retell client setup
const client = new Retell({
  apiKey: process.env.RETELL_API_KEY,
});

// Get all available voices
router.get("/all", async (req, res) => {
  try {
     const voiceResponses = await client.voice.list();
    res.json({
      status: true,
      data:voiceResponses,
    });
  } catch (error) {
    console.error("Error getting Voices:", error);
    res.status(500).json({
      status: false,
      message: "Failed to get Voices",
      error: error.message,
    });
  }
});

// Get voice by id
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const voiceResponse = await client.voice.retrieve(id);
    res.json({
      status: true,
      data:voiceResponse,
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