import express from 'express';
import path from 'path';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import {Client, Events, GatewayIntentBits, ActivityType} from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';


dotenv.config();

// Globals
const VITE_YOUTUBE_API_KEY = process.env.VITE_YOUTUBE_API_KEY;
const VITE_DISCORD_TOKEN = process.env.VITE_DISCORD_TOKEN;
const VITE_GEMINI_TOKEN = process.env.VITE_GEMINI_TOKEN;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(`Using token ${VITE_DISCORD_TOKEN} for Discord access`);
// Discord Integration
const client = new Client({intents: [GatewayIntentBits.Guilds]})
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    client.user.setActivity('Gran-Kemp-Morei Array: Sonic destabilization at 900GHz [BiPolar EEG sonics - FINIS MUSICAE]', { type: ActivityType.Watching, url: "https://youtu.be/D7sM4voPS_I"});});
client.login(VITE_DISCORD_TOKEN);

async function fetchMessages() {
    try {
        // Takes message from the Grand Duchy of Czelia
        const channel = await client.channels.fetch('704066892972949507');
        const fetchedMessages = await channel.messages.fetch({ limit: 10 });
        return fetchedMessages.reverse().map((msg) => ({
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

// Gemini
app.post('/geminiMessage', async (req, res) => {
    const genAI = new GoogleGenerativeAI(VITE_GEMINI_TOKEN);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const prompt = req.body.message;
    const result = await model.generateContent(prompt);
    res.status(200).send(result.response.text());
})
// Discord
app.get('/messages', async (req, res) => {
    const messages = await fetchMessages();
    res.json({ messages });
});
app.post('/sendMessage', async (req, res) => {
    const message = req.body.message;
    try {
        const channel = await client.channels.fetch('704066892972949507');
        if(message.startsWith('!')) {
            if(message.includes("purge")){
                const fetchedMessages = await channel.messages.fetch({ limit: 10 });
                for(const entry of fetchedMessages.values()) {
                    if (entry.author.id === client.user.id) {
                        await entry.delete();
                    }
                }
            }
        } else {
            await channel.send(message);
        }
        res.status(201).send('Message sent: OK');
        const messages = await fetchMessages();
        res.json({ messages });
    }
    catch (error) {
        console.log(error);
    }

})

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


// OUTILS AND FUN

app.post('/get-quote', async (req, res) => {
    const { key, lang = 'en' } = req.body;

    const params = new URLSearchParams();
    params.append('method', 'getQuote');
    params.append('format', 'json');
    params.append('lang', lang);
    if (key) {
        params.append('key', key);
    }

    try {
        const response = await fetch('http://api.forismatic.com/api/1.0/', {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
});
