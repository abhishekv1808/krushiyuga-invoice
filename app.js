const express = require('express');
const path = require('path');
const session = require('express-session');
const rootDir = require('./utils/mainUtils');
const mongoose = require('mongoose');

// Import routes
const adminRouter = require('./routes/adminRouter');
const userRouter = require('./routes/userRouter');

const mongoDBURL = 'mongodb+srv://abhishekv1808:' + encodeURIComponent('Grow@$@2025') + '@aribnb.xvmlcnz.mongodb.net/krushiyuga-invoice?retryWrites=true&w=majority&appName=aribnb';

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'krushiyuga-invoice-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
app.use('/admin', adminRouter);
app.use('/user', userRouter);

// Root route - redirect to admin dashboard
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        path: req.url
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Application error:', error);
    res.status(500).render('500', {
        title: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error : {}
    });
});

const port = process.env.PORT || 3006;

// Database connection and server start
mongoose.connect(mongoDBURL).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        console.log(`Admin Dashboard: http://localhost:${port}/admin`);
        console.log(`User Portal: http://localhost:${port}/user`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
