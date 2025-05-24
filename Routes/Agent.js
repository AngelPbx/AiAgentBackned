const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
require('dotenv').config();
const Joi = require('joi');

const agentSchema = Joi.object({
  agent_name: Joi.string().required(),
  llm_id: Joi.string().required(),
  recording_enabled: Joi.boolean().required(),
  voice_id: Joi.string().required(),
  agent_transfer_config: Joi.object({
    enabled: Joi.boolean(),
    target_phone_number: Joi.string(),
    target_sip_uri: Joi.string()
  }).optional(),
  phone_number: Joi.string().optional(),
  sip_config: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
    domain: Joi.string()
  }).optional(),
  agent_behavior_config: Joi.object({
    interjection_frequency: Joi.string().valid("low", "medium", "high"),
    speaking_rate: Joi.string().valid("slow", "medium", "fast")
  }).optional(),
  tts_config: Joi.object({
    stability: Joi.number().min(0).max(1),
    similarity_boost: Joi.number().min(0).max(1)
  }).optional(),
  agent_dtmf_config: Joi.object({
    enabled: Joi.boolean(),
    interrupt_threshold: Joi.number()
  }).optional(),

  whisper_config: Joi.object({
    enabled: Joi.boolean()
  }).optional(),

  agent_voicemail_config: Joi.object({
    enabled: Joi.boolean(),
    timeout_seconds: Joi.number()
  }).optional(),

  agent_greeting_config: Joi.object({
    greeting_text: Joi.string(),
    barge_in_enabled: Joi.boolean()
  }).optional(),

  agent_reprompt_config: Joi.object({
    first_reprompt: Joi.string(),
    second_reprompt: Joi.string(),
    no_input_timeout_seconds: Joi.number()
  }).optional()

}).unknown(true); // Allow unknown future fields

const client = new Retell({ apiKey: process.env.RETELL_API_KEY });


// Create new agent
router.post("/store", async (req, res) => {
  const { error, value } = agentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: "Validation error",
      errors: error.details.map(d => d.message),
    });
  }

  try {
    const response = await client.agent.create(value);
    res.json({
      status: true,
      agent_id: response.agent_id,
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
    const response = await client.agent.update(agent_id, value);
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
