const express = require('express');
const cors = require('cors');
const connectDB = require('./database/mongo');
const route = require('./routes');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

route(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
