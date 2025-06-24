const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
const { validateApiKey } = require('../MiddleWare/TokenValidator');



router.use(validateApiKey); // Apply to all routes

// === Create phone call ===
router.post("/create-phone-call", async (req, res) => {
  try {
    const response = await req.retellClient.call.createPhoneCall(req.body);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({ status: false, error: error?.response?.data || error.message });
  }
});

// === Create web call ===
router.post("/create-web-call", async (req, res) => {
  try {
    const response = await req.retellClient.call.createWebCall(req.body);
    res.status(200).json({ status: true, data: response });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({ status: false, error: error?.response?.data || error.message });
  }
});

// === Get all calls ===
router.get("/all", async (req, res) => {
  try {
    const response = await req.retellClient.call.list();
    res.json({ status: true, data: response });
  } catch (err) {
    console.error("List calls failed:", err);
    res.status(500).json({
      status: false,
      message: "Failed to list calls",
      error: err?.error?.error_message || err.message,
    });
  }
});

// === Get call by ID ===
router.get("/get/:id", async (req, res) => {
  try {
    const response = await req.retellClient.call.retrieve(req.params.id);
    res.json({ status: true, data: response });
  } catch (err) {
    console.error(`Get call ${req.params.id} failed:`, err.message);
    res.status(500).json({
      status: false,
      message: "Failed to get call",
      error: err?.error?.error_message || err.message,
    });
  }
});

// === Update call by ID ===
router.put("/update/:id", async (req, res) => {
  try {
    const response = await req.retellClient.call.update(req.params.id, req.body);
    res.json({ status: true, data: response });
  } catch (err) {
    console.error(`Update call ${req.params.id} failed:`, err.message);
    res.status(500).json({
      status: false,
      message: "Failed to update call",
      error: err?.error?.error_message || err.message,
    });
  }
});

// === Delete call by ID ===
router.delete("/delete/:id", async (req, res) => {
  try {
    await req.retellClient.call.delete(req.params.id);
    res.json({ status: true, message: "Call deleted successfully" });
  } catch (err) {
    console.error(`Delete call ${req.params.id} failed:`, err.message);
    res.status(500).json({
      status: false,
      message: "Failed to delete call",
      error: err?.error?.error_message || err.message,
    });
  }
});

module.exports = router;
