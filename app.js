import express from 'express';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',  // Allow frontend to make requests
    methods: ['GET', 'POST'],        // Allow GET and POST methods
    credentials: true,               // Allow cookies if needed
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.post('/login', (req, res) => {
    const password = process.env.PASSWORD;
    const pass_input = req.body.password;

    if (pass_input) {
        if (pass_input === password) {
            res.redirect('/dashboard');
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

app.get('/dashboard', (req, res) => {
    res.send('Welcome to the dashboard!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
