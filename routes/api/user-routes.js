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

// GET a single user by its _id and populated thought and friend data
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if(!user){
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
}
);

// POST a new user
router.post('/', async (req, res) => {
    try{
        const user = await User.create(req.body);
        res.json(user);
    }
    catch(err){
        res.status(400).json(err);
    }
});


// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!user){
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
    }
    catch(err){
        res.status(400).json(err);
    }
}
);

// DELETE to remove user by its _id
router.delete('/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        // Remove user's associated thoughts
        await Thought.deleteMany({ username: user.username });
        res.json({ message: 'User and associated thoughts deleted!' });
    }
    catch(err){
        res.status(500).json(err);
    }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        );
        if(!user){
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { friends: req.params.friendId } },
            { new: true }
        );
        if(!user){
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;