const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
require('dotenv').config();

const client = new Retell({ apiKey: process.env.RETELL_API_KEY });

// Route to create phone call
router.post("/create-phone-call", async (req, res) => {
  try {
    const phoneNumberResponse = await client.call.createPhoneCall(req.body);
    res.status(200).json({
      status: true,
      data: phoneNumberResponse
    });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      error: error || 'Something went wrong'
    });
  }
});

// Route to create web call
router.post("/create-web-call", async (req, res) => {
  try {
    const phoneNumberResponse = await client.call.createWebCall(req.body);
    res.status(200).json({
      status: true,
      data: phoneNumberResponse
    });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      error: error || 'Something went wrong'
    });
  }
});

// Get all call lists
router.get("/all", async (req, res) => {
  try {
    const response = await client.call.list();
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error("List calls failed:", err.message);
    res.status(500).json({
      status: false,
      message: "Failed to list calls",
      error: err.message,
    });
  }
});

// Get call by ID
router.get("/get/:id", async (req, res) => {
  const callId = req.params.id;
  try {
    const response = await client.call.retrieve(callId);
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error(`Get call ${callId} failed:`, err.message);
    res.status(500).json({
      status: false,
      message: "Failed to get call",
      error: err.message,
    });
  }
});

// Update call by ID
router.put("/update/:id", async (req, res) => {
  const callId = req.params.id;
  try {
    const response = await client.call.update(callId, req.body);
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error(`Update call ${callId} failed:`, err.message);
    res.status(500).json({
      status: false,
      message: "Failed to update call",
      error: err.message,
    });
  }
});

// Delete call by ID
router.delete("/delete/:id", async (req, res) => {
  const callId = req.params.id;
  try {
    await client.call.delete(callId);
    res.json({
      status: true,
      message: "Call deleted successfully",
    });
  } catch (err) {
    console.error(`Delete call ${callId} failed:`, err.message);
    res.status(500).json({
      status: false,
      message: "Failed to delete call",
      error: err.message,
    });
  }
});

module.exports = router;