import express, {response} from 'express';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.post('/login', (req, res) => {
    const password = process.env.PASSWORD;
    const pass_input = req.body.password;
    if(pass_input) {
        if (pass_input === password) {
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Invalid password.');
        }
    } else {
            res.status(400).send('Password is required.');
        }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


addEventListener("DOMContentLoaded", () => {
    console.log("Loaded.")
})
