const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Retell = require('retell-sdk');
const { validateApiKey } = require('../MiddleWare/TokenValidator');

// === Multer File Upload Config ===
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });



router.use(validateApiKey); // Apply API key validation middleware to all routes

// === Create Knowledge Base ===
router.post("/store", upload.single('file'), async (req, res) => {
  try {
    const { name, texts, urls } = req.body;
    const client = req.retellClient;

    const knowledgeBaseResponse = await client.knowledgeBase.create({
      knowledge_base_name: name || "Default KB",
      knowledge_base_texts: texts ? JSON.parse(texts) : [],
      knowledge_base_urls: urls ? JSON.parse(urls) : [],
      knowledge_base_files: req.file
        ? [fs.createReadStream(path.resolve(req.file.path))]
        : [],
    });

    res.json({
      status: true,
      knowledge_base_id: knowledgeBaseResponse.knowledge_base_id,
    });
  } catch (error) {
    console.error("Error creating knowledge base:", error);
    res.status(500).json({
      status: false,
      message: "Failed to create knowledge base",
      error: error.message,
    });
  }
});

// === List All Knowledge Bases ===
router.get("/all", async (req, res) => {
  try {
    const client = req.retellClient;
    const knowledgeBaseResponses = await client.knowledgeBase.list();

    res.json({
      status: true,
      knowledgeBaseResponses,
    });
  } catch (error) {
    console.error("Error getting knowledge bases:", error);
    res.status(500).json({
      status: false,
      message: "Failed to get knowledge bases",
      error: error.message,
    });
  }
});

// === Retrieve Knowledge Base by ID ===
router.get("/get/:id", async (req, res) => {
  try {
    const client = req.retellClient;
    const { id } = req.params;
    const knowledgeBaseResponse = await client.knowledgeBase.retrieve(id);

    res.json({
      status: true,
      knowledgeBaseResponse,
    });
  } catch (error) {
    console.error("Error getting knowledge base:", error);
    res.status(500).json({
      status: false,
      message: "Failed to get knowledge base",
      error: error.message,
    });
  }
});

// === Delete Knowledge Base by ID ===
router.delete("/delete/:id", async (req, res) => {
  try {
    const client = req.retellClient;
    const { id } = req.params;
    await client.knowledgeBase.delete(id);

    res.json({
      status: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting knowledge base:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete knowledge base",
      error: error.message,
    });
  }
});

module.exports = router;
