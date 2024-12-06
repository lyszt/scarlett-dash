import express from 'express';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Functions
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.status(401).send('Unauthorized: You must log in first.');
}
// App 
app.use(cors({
    origin: 'http://localhost:5173',  // Allow frontend to make requests
    methods: ['GET', 'POST'],        // Allow GET and POST methods
    credentials: true,               // Allow cookies if needed
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true if HTTPS
        httpOnly: true, 
        maxAge: 600000
    },
}));

app.post('/login', (req, res) => {
    const password = process.env.PASSWORD;
    const pass_input = req.body.password;

    if (pass_input) {
        if (pass_input === password) {
            req.session.isAuthenticated = true;
            res.status(200).send('Logged in.');
        } else {
            res.status(401).send('Invalid password.');
        }
    } else {
        res.status(400).send('Password is required.');
    }
});

app.get('/', (req, res) => {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    res.sendFile(path.join(__dirname, 'index.html'));
    if(!process.env.SESSION_SECRET){
        res.send('Password not located.')
    }
});

app.get('/auth', isAuthenticated, (req, res) => {
    res.status(200).send();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
