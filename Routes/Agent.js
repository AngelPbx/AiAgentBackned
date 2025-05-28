const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
require('dotenv').config();
const Joi = require('joi');

const agentSchema = Joi.object({
  

}).unknown(true); // Allow unknown future fields

const client = new Retell({ apiKey: process.env.RETELL_API_KEY });


// Create new agent
router.post("/store", async (req, res) => {
  const { error, value } = (req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: error.details.map(d => d.message),
    });
  }

  try {
    const response = await client.agent.create(req.body);
    res.json({
      status: true,
      agent_id: response,
    });
  } catch (err) {
    console.error("Create agent failed:", err.message);
    res.status(500).json({
      status: false,
      message: "Agent creation failed",
      error: err.message,
    });
  }
});

// List all agents
router.get("/all", async (req, res) => {
  try {
    const response = await client.agent.list();
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error("List agents failed:", err.message);
    res.status(500).json({
      status: false,
      message: "Failed to list agents",
      error: err.message,
    });
  }
});


// Get agent by id
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await client.agent.retrieve(id);
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error("Get agent failed:", err.message);
    res.status(500).json({
      status: false,
      message: "Failed to get agent",
      error: err.message,
    });
  }
});

// Update agent by id
router.put("/update-agent/:agent_id", async (req, res) => {
  const { error, value } = agentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: error.details.map(d => d.message),
    });
  }

  try {
    const { agent_id } = req.params;
    const response = await client.agent.update(agent_id, req.body);
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error("Update agent failed:", err.message);
    res.status(500).json({
      status: false,
      message: "Failed to update agent",
      error: err.message,
    });
  }
});

// Delete agent by id
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await client.agent.delete(id);
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error("Delete agent failed:", err.message);
    res.status(500).json({
      status: false,
      message: "Failed to delete agent",
      error: err.message,
    });
  }
});

module.exports = router;
