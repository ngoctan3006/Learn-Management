const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learnit.ie2d7.mongodb.net/mern-learnit?retryWrites=true&w=majority`
        );

        console.log('MongoDB connected');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;
