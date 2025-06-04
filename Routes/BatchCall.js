const express = require("express");
const router = express.Router();
const Retell = require("retell-sdk");
require("dotenv").config();

const client = new Retell({ apiKey: process.env.RETELL_API_KEY });

// Route to create phone number
router.post("/store", async (req, res) => {
  try {
    const { from_number, tasks, name, trigger_timestamp } = req.body;

    const phoneNumberResponse = await client.batchCall.createBatchCall({
      from_number,
      tasks,
      name,
      trigger_timestamp,
    });

    res.status(200).json({
      status: true,
      data: phoneNumberResponse,
    });
  } catch (error) {
    console.error("Retell API error:", error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      error: error || "Something went wrong",
    });
  }
});

module.exports = router;
