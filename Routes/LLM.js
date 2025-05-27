const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
const Joi = require('joi');
require('dotenv').config();

const client = new Retell({ apiKey: process.env.RETELL_API_KEY });

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
}).unknown(true); //     This line allows extra keys


// Route to create LLM
router.post("/store", async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      error: error.details.map(d => d.message),
    });
  }
  try {
    const llmResponse = await client.llm.create(value);
    return res.json({
      status: true,
      llm_id: llmResponse.llm_id,
    });
  } catch (err) {
    console.error("Retell API error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to create LLM",
      error: err.message,
    });
  }
});

// Route to get all LLMs
router.get("/all", async (req, res) => {
  try {
    const llmResponse = await client.llm.list();
    return res.json({
      status: true,
      llmResponse,
    });
  } catch (err) {
    console.error("Retell API error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to get LLMs",
      error: err.message,
    });
  }
});

// Rote to get llm by id
router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const llmResponse = await client.llm.retrieve(id);
    return res.json({
      status: true,
      llmResponse,
    });
  } catch (err) {
    console.error("Retell API error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to get LLM",
      error: err.message,
    });
  }
});

// Detele llm by id
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const llmResponse = await client.llm.delete(id);
    return res.json({
      status: true,
      data:"Deleted successfully",
    });
  } catch (err) {
    console.error("Retell API error:", err.message);
    return res.status(500).json({
      status: false,
      message: "Failed to delete LLM",
      error: err.message,
    });
  }
});

// Edit existing llm by id
router.put("/update-llm/:llm_id", async (req, res) => {
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
    const updateResponse = await client.llm.update(llm_id, value);

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
      error: err.message,
    });
  }
});




module.exports = router;
