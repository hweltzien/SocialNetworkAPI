const router = require('express').Router();
const User = require('../../models/User');
const Thought = require('../../models/Thought');

// GET all users
router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;