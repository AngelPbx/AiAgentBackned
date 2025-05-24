const express=require('express')
const router=express.Router()
const KnowledgeBase = require('./KnowledgeBase')
router.get('/',(req, res) =>{
    res.send("Welcome to stack clone")
});

router.use('/knowledgebase',KnowledgeBase);

module.exports = router;