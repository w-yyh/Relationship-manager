const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || 'your_super_secret_key_change_in_production';

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../dist')));

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User created successfully' });
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        if (await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
            res.json({ token, user: { id: user.id, username: user.username } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Data Routes
app.get('/api/contacts', authenticateToken, (req, res) => {
    db.all('SELECT * FROM contacts WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/contacts', authenticateToken, (req, res) => {
    const { id, name, x, y, z, note, category, value_provide, value_receive, tags } = req.body;
    db.run(
        'INSERT INTO contacts (id, user_id, name, x, y, z, note, category, value_provide, value_receive, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, req.user.id, name, x, y, z, note, category, value_provide, value_receive, JSON.stringify(tags || [])],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Contact added' });
        }
    );
});

app.put('/api/contacts/:id', authenticateToken, (req, res) => {
    const { name, x, y, z, note, category, value_provide, value_receive, tags } = req.body;
    db.run(
        'UPDATE contacts SET name = ?, x = ?, y = ?, z = ?, note = ?, category = ?, value_provide = ?, value_receive = ?, tags = ? WHERE id = ? AND user_id = ?',
        [name, x, y, z, note, category, value_provide, value_receive, JSON.stringify(tags || []), req.params.id, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Contact updated' });
        }
    );
});

app.delete('/api/contacts/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM contacts WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Contact deleted' });
    });
});

app.get('/api/settings', authenticateToken, (req, res) => {
    db.get('SELECT config FROM settings WHERE user_id = ?', [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row ? JSON.parse(row.config) : null);
    });
});

app.post('/api/settings', authenticateToken, (req, res) => {
    const config = JSON.stringify(req.body);
    db.run(
        'INSERT INTO settings (user_id, config) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET config = excluded.config',
        [req.user.id, config],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Settings saved' });
        }
    );
});

// Anything that doesn't match the above, send back index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
