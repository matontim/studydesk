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

const fs = require('fs');

app.post('/register', function(req, res) {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json'));

    const exists = users.find(function(u) { return u.username === username; });
    if (exists) {
        return res.json({ success: false, message: 'Username already taken' });
    }

    users.push({ username, password });
    fs.writeFileSync('users.json', JSON.stringify(users));
    res.json({ success: true, message: 'Account created!' });
});

app.post('/login', function(req, res) {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json'));

    const user = users.find(function(u) {
        return u.username === username && u.password === password;
    });

    if (user) {
        res.json({ success: true, message: 'Welcome, ' + username + '!' });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

app.get('/assignments/:username', function(reg, res) {
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(function(u) { return u.username === req.params.username; });
    if (user) {
        res.json({ success: true, assignments: user.assignments || [] });
    } else {
        res.json({ success: false, assignments: [] });
    }
});

app.post('/assignments/:username', function(req, res) {
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(function(u) { return u.username === req.params.username; });
    if (user) {
        user.assignments = req.body.assignments;
        fs.writeFileSync('users.json', JSON.stringify(users));
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});