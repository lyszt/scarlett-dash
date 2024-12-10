import express from 'express';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import {Client, Events, GatewayIntentBits} from 'discord.js';


dotenv.config();

// Globals
const VITE_YOUTUBE_API_KEY = process.env.VITE_YOUTUBE_API_KEY;
const VITE_DISCORD_TOKEN = process.env.VITE_DISCORD_TOKEN;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Discord Integration
const client = new Client({intents: [GatewayIntentBits.Guilds]})
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.login(VITE_DISCORD_TOKEN);

async function fetchMessages() {
    try {
        // Takes message from the Grand Duchy of Czelia
        console.log(`Fetching messages...`);
        const channel = await client.channels.fetch('704066892972949507');
        const fetchedMessages = await channel.messages.fetch({ limit: 10 });
        return fetchedMessages.map((msg) => ({
            content: msg.content,
            author: msg.author.username,
            avatar: msg.author.avatarURL(),
            guildId: msg.guildId,
        }));
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}


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

app.get('/messages', async (req, res) => {
    const messages = await fetchMessages();
    res.json({ messages });
});

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
