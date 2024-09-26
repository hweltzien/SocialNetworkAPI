const router = require('express').Router();
const User = require('../../models/User');
const Thought = require('../../models/Thought');

// GET to get all thoughts
router.get('/', async (req, res) => {
    try{
        const thoughts = await Thought.find();
        res.json(thoughts);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// GET to get a single thought by its _id
router.get('/:id', async (req, res) => {
    try{
        const thought = await Thought.findById(req.params.id);
        if(!thought){
            return res.status(404).json({ message: 'No thought found with this id!' });
            
        }
        res.json(thought);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// POST to create a new thought
router.post('/', async (req, res) => {
    try{
        const thought = await Thought.create(req.body);
        const user = await User.findByIdAndUpdate(
            req.body.userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );
        if(!user){
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(thought);
    }
    catch(err){
        res.status(400).json(err);
    }
});

// PUT to update a thought by its _id
router.put('/:id', async (req, res) => {
    try{
        const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!thought){
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    }
    catch(err){
        res.status(400).json(err);
    }
}
);

// DELETE to remove a thought by its _id
router.delete('/:id', async (req, res) => {
    try{
        const thought = await Thought.findByIdAndDelete(req.params.id);
        if(!thought){
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        await User.findByIdAndUpdate(
            thought.userId,
            { $pull: { thoughts: req.params.id } }
        );
        res.json({ message: 'Thought deleted!' });
    }
    catch(err){
        res.status(500).json(err);
    }
}
);

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
    try{
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: req.body } },
            { new: true, runValidators: true }
        );
        if(!thought){
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    }
    catch(err){
        res.status(500).json(err);
    }
}
);

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try{
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        ); 
        if(!thought){
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    }
    catch(err){
        res.status(500).json(err);
    }
}
);

module.exports = router;