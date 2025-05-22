// server.js
require('dotenv').config();
const path    = require('path');
const express = require('express');
const session = require('express-session');
const http    = require('http');

const authRoutes = require('./routes/auth.routes');

const app    = express();
const server = http.createServer(app);

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// --- Authentication Middleware ---
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  return res.redirect('/login');
};

// --- Routes ---
// API Routes
app.use('/api', authRoutes);

// Page Routes
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

// --- Static Files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Server Start ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
