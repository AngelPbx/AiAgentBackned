const express = require('express');
const router = express.Router();
const Retell = require('retell-sdk');
const Joi = require('joi');
const { validateApiKey } = require('../MiddleWare/TokenValidator');



// === Joi Schema (optional validation) ===
const agentSchema = Joi.object({}).unknown(true); // Allow unknown future fields

// === Routes ===

// Create new agent
router.post('/store', validateApiKey, async (req, res) => {
  const { error } = agentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: 'Validation error',
      errors: error.details.map(d => d.message),
    });
  }

  try {
    const response = await req.retellClient.agent.create(req.body);
    res.json({
      status: true,
      agent_id: response,
    });
  } catch (err) {
    console.error('Create agent failed:', err.message);
    res.status(500).json({
      status: false,
      message: 'Agent creation failed',
      error: err?.error?.error_message || err.message,
    });
  }
});

// List all agents
router.get('/all', validateApiKey, async (req, res) => {
  try {
    const response = await req.retellClient.agent.list();
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error('List agents failed:', err.message);
    res.status(500).json({
      status: false,
      message: 'Failed to list agents',
      error: err?.error?.error_message || err.message,
    });
  }
});

// Get agent by ID
router.get('/get/:id', validateApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await req.retellClient.agent.retrieve(id);
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error('Get agent failed:', err.message);
    res.status(500).json({
      status: false,
      message: 'Failed to get agent',
      error: err?.error?.error_message || err.message,
    });
  }
});

// Update agent by ID
router.put('/update-agent/:agent_id', validateApiKey, async (req, res) => {
  const { error } = agentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: 'Validation error',
      errors: error.details.map(d => d.message),
    });
  }

  try {
    const { agent_id } = req.params;
    const response = await req.retellClient.agent.update(agent_id, req.body);
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error('Update agent failed:', err.message);
    res.status(500).json({
      status: false,
      message: 'Failed to update agent',
      error: err?.error?.error_message || err.message,
    });
  }
});

// Delete agent by ID
router.delete('/delete/:id', validateApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await req.retellClient.agent.delete(id);
    res.json({
      status: true,
      data: response,
    });
  } catch (err) {
    console.error('Delete agent failed:', err.message);
    res.status(500).json({
      status: false,
      message: 'Failed to delete agent',
      error: err?.error?.error_message || err.message,
    });
  }
});

module.exports = router;
