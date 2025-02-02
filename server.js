const express = require('express');
const connectDB = require('./utils/connectDB');
const app = express();
const PORT = '5100'
// Middleware to parse JSON
app.use(express.json());

const User = require('./controller/user.controller')

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, Node.js Server!');
});
// Start the server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});