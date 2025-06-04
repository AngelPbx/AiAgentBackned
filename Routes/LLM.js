const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
const Joi = require('joi');
const { validateApiKey } = require('../MiddleWare/TokenValidator');
require('dotenv').config();

// === Allowed select values (based on Retell docs) ===
const ALLOWED_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "claude-3.7-sonnet",
  "claude-3.5-haiku",
  "deepseek-v3",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite"
];

// Joi schema for validation
const schema = Joi.object({
  llm_name: Joi.string(),
  model: Joi.string().valid(...ALLOWED_MODELS),
  temperature: Joi.number().min(0).max(1),
  max_tokens: Joi.number().min(1),
  prompt_template: Joi.string(),
  override_system_prompt: Joi.string(),
  knowledge_base_id: Joi.string(),
  voice_id: Joi.string(),
  tool_ids: Joi.array().items(Joi.string()),
  tool_config: Joi.object()
}).unknown(true);

// === Middleware: Validate Bearer Token and attach Retell client ===
// const validateApiKey = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       status: false,
//       message: "Missing or invalid Authorization header"
//     });
//   }

//   const apiKey = authHeader.split(" ")[1];
//   if (!apiKey) {
//     return res.status(401).json({
//       status: false,
//       message: "API key not provided"
//     });
//   }

//   try {
//     req.retellClient = new Retell({ apiKey });
//     next();
//   } catch (err) {
//     return res.status(500).json({
//       status: false,
//       message: "Failed to initialize Retell client",
//       error: err.message
//     });
//   }
// };

// === Routes ===

// Create LLM
router.post("/store", validateApiKey, async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      error: error.details.map(d => d.message),
    });
  }

  try {
    const llmResponse = await req.retellClient.llm.create(value);
    return res.json({
      status: true,
      llm_id: llmResponse.llm_id,
    });
  } catch (err) {
    console.error("Retell API error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to create LLM",
      error: err?.error?.error_message || err.message,
    });
  }
});

// Get all LLMs
router.get("/all", validateApiKey, async (req, res) => {
  try {
    const llmResponse = await req.retellClient.llm.list();
    return res.json({
      status: true,
      llmResponse,
    });
  } catch (err) {
    console.error("Retell API error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to get LLMs",
      error: err?.error?.error_message || err.message,
    });
  }
});

// Get LLM by ID
router.get("/get/:id", validateApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const llmResponse = await req.retellClient.llm.retrieve(id);
    return res.json({
      status: true,
      data: llmResponse,
    });
  } catch (err) {
    console.error("Retell API error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to get LLM",
      error: err?.error?.error_message || err.message,
    });
  }
});

// Delete LLM by ID
router.delete("/delete/:id", validateApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    await req.retellClient.llm.delete(id);
    return res.json({
      status: true,
      data: "Deleted successfully",
    });
  } catch (err) {
    console.error("Retell API error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to delete LLM",
      error: err?.error?.error_message || err.message,
    });
  }
});

// Update LLM by ID
router.put("/update-llm/:llm_id", validateApiKey, async (req, res) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      error: error.details.map(d => d.message),
    });
  }

  const llm_id = req.params.llm_id;

  try {
    const updateResponse = await req.retellClient.llm.update(llm_id, value);
    return res.json({
      status: true,
      message: "LLM updated successfully",
      data: updateResponse,
    });
  } catch (err) {
    console.error("Retell update error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to update LLM",
      error: err?.error?.error_message || err.message,
    });
  }
});

module.exports = router;
