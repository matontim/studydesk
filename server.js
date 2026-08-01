const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.get('/test', function(req, res) {
    res.json({ message: 'Server is running!' });
});

app.listen(3000, function() {
    console.log('StudyDesk server running on http://localhost:3000');
});