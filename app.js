const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user-routes');
const eventRoutes = require('./routes/event-routes');

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => console.log(err));