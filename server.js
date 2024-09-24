const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

mongoose.set('debug', true);

app.use('/api/users', require('./routes/api/user-routes'));
// app.use('/api/thoughts', require('./routes/api/thought-routes'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
