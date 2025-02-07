const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/connectDB');
const app = express();
const PORT = '9001'
// Middleware to parse JSON
app.use(express.json());

const corsOptions = {
    origin: '*',    //Allow from the the routes , Or we can mention the url here for specific routes or [] array of multiple origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const User = require('./routes/user.routes')
const Reciept = require('./routes/reciept.routes')
const bookedKeysRoutes = require("./routes/bookedKeysRoutes.js");

app.use('/api/user', User)
app.use('/api/reciept', Reciept)
app.use('/api/booked-keys', bookedKeysRoutes)

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, Node.js Server!');
});
// Start the server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
