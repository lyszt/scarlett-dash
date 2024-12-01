const express = require('express');
const path = require('path');

const app = express();

// Static serving
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic route
app.get('/api/data', (req
                      , res) => {
    res.json({message: 'Hello world.', timestamp: Date.now()});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})