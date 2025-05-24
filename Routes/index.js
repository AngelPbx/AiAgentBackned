const express=require('express')
const router=express.Router()
const KnowledgeBase = require('./KnowledgeBase')
const Voice = require('./Voice')
router.get('/',(req, res) =>{
    res.send("Welcome to stack clone")
});

router.use('/knowledgebase',KnowledgeBase);
router.use('/voice',Voice);
module.exports = router;