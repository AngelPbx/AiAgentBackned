const express = require('express');
const { validateApiKey } = require('../MiddleWare/TokenValidator');
const router = express.Router();

router.use(validateApiKey);

// === Create a phone number ===
router.post("/store", async (req, res) => {
  try {
    const {
      inbound_agent_id,
      outbound_agent_id,
      inbound_agent_version,
      outbound_agent_version,
      area_code,
      nickname,
      inbound_webhook_url,
      number_provider
    } = req.body;

    const client = req.retellClient;

    const phoneNumberResponse = await client.phoneNumber.create({
      inbound_agent_id,
      outbound_agent_id,
      inbound_agent_version,
      outbound_agent_version,
      area_code,
      nickname,
      inbound_webhook_url,
      number_provider
    });

    res.status(200).json({
      status: true,
      data: phoneNumberResponse
    });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: 'Failed to create phone number',
      error: error.message
    });
  }
});

// === Get all phone numbers ===
router.get("/all", async (req, res) => {
  try {
    const client = req.retellClient;
    const phoneNumbersResponse = await client.phoneNumber.list();

    res.status(200).json({
      status: true,
      data: phoneNumbersResponse
    });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve phone numbers',
      error: error.message
    });
  }
});

// === Get phone number by ID ===
router.get("/get/:id", async (req, res) => {
  try {
    const client = req.retellClient;
    const { id } = req.params;

    const phoneNumberResponse = await client.phoneNumber.retrieve(id);

    res.status(200).json({
      status: true,
      data: phoneNumberResponse
    });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve phone number',
      error: error.message
    });
  }
});

// === Delete phone number by ID ===
router.delete("/delete/:id", async (req, res) => {
  try {
    const client = req.retellClient;
    const { id } = req.params;

    await client.phoneNumber.delete(id);

    res.status(200).json({
      status: true,
      message: "Phone number deleted successfully"
    });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: 'Failed to delete phone number',
      error: error.message
    });
  }
});

// === Update phone number by ID ===
router.put("/update/:id", async (req, res) => {
  try {
    const client = req.retellClient;
    const { id } = req.params;
    const {
      inbound_agent_id,
      outbound_agent_id,
      inbound_agent_version,
      outbound_agent_version,
      area_code,
      nickname,
      inbound_webhook_url,
      number_provider
    } = req.body;

    const phoneNumberResponse = await client.phoneNumber.update(id, {
      inbound_agent_id,
      outbound_agent_id,
      inbound_agent_version,
      outbound_agent_version,
      area_code,
      nickname,
      inbound_webhook_url,
      number_provider
    });

    res.status(200).json({
      status: true,
      data: phoneNumberResponse
    });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: 'Failed to update phone number',
      error: error.message
    });
  }
});

module.exports = router;
