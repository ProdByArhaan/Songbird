// server.js
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from './server/config/passport-setup.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import history from 'connect-history-api-fallback';
import { ensureAuth, trackActivity } from './server/middleware/auth.js';

// Load environment variables first
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GENIUS_ACCESS_TOKEN',
    'SESSION_SECRET',
    'MONGODB_URI'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

// Enhanced MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB successfully');
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Environment check
const isDevelopment = process.env.NODE_ENV !== 'production';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// CORS configuration
app.use(cors({
    origin: isDevelopment ? 'http://localhost:5173' : false,
    credentials: true
}));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: !isDevelopment,
        sameSite: isDevelopment ? 'lax' : 'none'
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: req.user
        });
    } else {
        res.json({
            isAuthenticated: false
        });
    }
});

app.get('/api/auth/google',
    passport.authenticate('google', {
        scope: ['email'],
        prompt: 'select_account'
    })
);

app.get('/api/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: isDevelopment ? 'http://localhost:5173/login' : '/login',
        session: true
    }),
    (req, res) => {
        res.redirect(isDevelopment ? 'http://localhost:5173' : '/');
    }
);

app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Error during logout' });
        }
        req.session.destroy();
        res.json({ message: 'Logged out successfully' });
    });
});

// Recent activity endpoint
app.get('/api/recent-activity', ensureAuth, async (req, res) => {
    res.json(req.session.recentActivity || []);
});

// Protected API routes with activity tracking
app.get('/api/search', ensureAuth, trackActivity, async (req, res) => {
    try {
        const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(req.query.q)}`, {
            headers: { 'Authorization': `Bearer ${process.env.GENIUS_ACCESS_TOKEN}` }
        });

        const data = await response.json();

        if (req.query.remember === 'true') {
            res.cookie('lastSearch', req.query.q, {
                maxAge: 60 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                secure: !isDevelopment,
                sameSite: isDevelopment ? 'lax' : 'none',
                path: '/'
            });
        } else {
            res.clearCookie('lastSearch');
        }

        res.json(data);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'Error searching songs',
            message: error.message
        });
    }
});

app.get('/api/song/:id', ensureAuth, trackActivity, async (req, res) => {
    try {
        const response = await fetch(`https://api.genius.com/songs/${req.params.id}`, {
            headers: { 'Authorization': `Bearer ${process.env.GENIUS_ACCESS_TOKEN}` }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Song fetch error:', error);
        res.status(500).json({
            error: 'Error fetching song details',
            message: error.message
        });
    }
});

// Handle static files and routing based on environment
if (!isDevelopment) {
    // Production static file serving
    app.use(history());
    app.use(express.static(path.join(__dirname, 'client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/dist/index.html'));
    });
} else {
    // Development mode - API only
    app.get('/', (req, res) => {
        res.json({ message: 'API is running' });
    });
}

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: isDevelopment ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});