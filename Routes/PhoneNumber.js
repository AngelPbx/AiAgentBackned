const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
require('dotenv').config();

const client = new Retell({ apiKey: process.env.RETELL_API_KEY });

// Route to create phone number
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
    } = req;

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
      error: error?.response || 'Something went wrong'
    });
  }
});

// Get all phone numbers
router.get("/all", async (req, res) => {
  try {
    const phoneNumbersResponse = await client.phoneNumber.list();
    res.status(200).json({
      status: true,
      data: phoneNumbersResponse
    });
  } catch (error) {
    console.error('Retell API error:', error?.response?.data || error.message);
    res.status(500).json({
      status: false,
      error: error?.response || 'Something went wrong'
    });
  }
});

// Get a specific phone number by ID
router.get("/get/:id", async (req, res) => {
  try {
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
      error: error?.response || 'Something went wrong'
    });
  }
});

// Delete a specific phone number by ID
router.delete("/delete/:id", async (req, res) => {
  try {
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
      error: error?.response?.data || 'Something went wrong'
    });
  }
});

// Update a specific phone number by ID
router.put("/update/:id", async (req, res) => {
  try {
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
      error: error?.response?.data || 'Something went wrong'
    });
  }
});

module.exports = router;
