const express = require("express");
const router = express.Router();
const Retell = require("retell-sdk");
require("dotenv").config();
const Retell = require("retell-sdk");
const { validateApiKey } = require("../MiddleWare/TokenValidator");

// === Route to create batch call ===
router.post("/store", validateApiKey, async (req, res) => {
  try {
    const { from_number, tasks, name, trigger_timestamp } = req.body;

    const phoneNumberResponse =
      await req.retellClient.batchCall.createBatchCall({
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
      message: "Failed to create batch call",
      error: error?.response?.data || error.message,
    });
  }
});

module.exports = router;
