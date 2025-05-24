const express=require('express')
const router=express.Router()
const KnowledgeBase = require('./KnowledgeBase')
const Voice = require('./Voice')
const LLM = require('./LLM')
const Agent = require('./Agent')
router.get('/',(req, res) =>{
    res.send("Welcome to stack clone")
});

router.use('/knowledgebase',KnowledgeBase);
router.use('/voice',Voice);
router.use('/llm',LLM);
router.use('/agent',Agent);
module.exports = router;