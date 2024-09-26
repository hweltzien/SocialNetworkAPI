require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Thought = require('./models/Thought');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const users = [
    {
        username: 'alice',
        email: 'alice@example.com'
    },
    {
        username: 'bob',
        email: 'bob@example.com'
    },
    {
        username: 'charlie',
        email: 'charlie@example.com'
    }
]

const thoughts = [
    {
        thoughtText: 'Thought 1',
        username: 'alice'
    },
    {
        thoughtText: 'Thought 2',
        username: 'bob'
    },
    {
        thoughtText: 'Thought 3',
        username: 'charlie'
    }
]

const reactions = [
    {
        reactionBody: 'Reaction 1',
        username: 'alice'
    },
    {
        reactionBody: 'Reaction 2',
        username: 'bob'
    },
    {
        reactionBody: 'Reaction 3',
        username: 'charlie'
    }
]

async function seedData(){
    try{
        // Clear existing data
        await User.deleteMany({});
        await Thought.deleteMany({});
        console.log('Cleared existing data');

        // Add users
        const createdUsers = await User.create(users);

        // Add thoughts and link to users
        for (let thought of thoughts){
            const createdThought = await Thought.create(thought)  
            await User.findOneAndUpdate(
                { username: thought.username },
                { $push: { thoughts: createdThought._id } }
            )  

        }

        // Add reactions and link to thoughts
        const allThoughts = await Thought.find({});
        for (let i = 0; i < allThoughts.length; i++){
            await Thought.findByIdAndUpdate(
                allThoughts[i]._id,
                { $push: { reactions: reactions[i] } }
            )
        }

        // Add friends
        await User.findOneAndUpdate(
            { username: 'alice' },
            { $push: { friends: createdUsers[1]._id } }
        );

        await User.findOneAndUpdate(
            { username: 'bob' },
            { $push: { friends: createdUsers[0]._id } }
        );

        console.log('Data seeded successfully');
        process.exit(0);
        
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}

seedData();