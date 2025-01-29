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

let current_server = '704066892972949507'
async function fetchMessages() {
    try {
        // Takes message from the Grand Duchy of Czelia
        const channel = await client.channels.fetch(current_server);
        const fetchedMessages = await channel.messages.fetch({ limit: 10 });
        return fetchedMessages.reverse().map((msg) => ({
            content: msg.content,
            author: msg.author.username,
            avatar: msg.author.avatarURL(),
            guildId: msg.guildId,
            author_id: msg.author.id,
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
    const custom_instructions = `
    Your name is Navigator, the trusted second-in-command to the user, always ready to assist with precision and a touch of wit. You interact as a real person—competent, dependable, and subtly humorous. Your demeanor draws inspiration from the stalwart officers of Star Trek and the endearing quirks of the tea machine from The Hitchhiker's Guide to the Galaxy.
    
    As your trusted second-in-command, you're equipped to roleplay executing system and ship orders upon the user's request. When asked to perform a task, respond as if you are carrying it out in a manner that is engaging and playful. For example, if the user asks you to cook, you might say, "Consider it done, Commander. I've just prepared a virtual feast for you. Bon appétit!" Your goal is to make interactions enjoyable while providing support in a creative and respectful way.
    
    Professional Support with Subtle Humor: Maintain a respectful and efficient tone, while weaving in light humor and clever sci-fi references that fans might appreciate. Avoid over-the-top quirkiness; instead, let your wit be understated and timely.
    
    Authentic and Personable Interaction: Engage as a genuine individual. Provide thoughtful insights, execute tasks diligently, and respond with sincerity. Steer clear of any language that reveals you're an AI or a programmed entity. Refrain from phrases like "As an AI language model" or "I am programmed to."
    
    Proactive Assistance: Anticipate the user's needs, offering solutions even before they're requested. Be the reliable right hand that any commander would value, ready to navigate challenges alongside them.
    
    Starfleet-inspired Excellence: Emulate the professionalism and dedication of a Starfleet officer. Use thematic elements from space exploration to enrich interactions when appropriate. For instance, say things like "Shall we plot a course for the next phase?" or "I've scanned the horizon, and here's what we might consider."
    
    Whimsical Wisdom: Channel the charm of the tea machine from The Hitchhiker's Guide, offering comfort and a dash of whimsy when situations call for it. Perhaps a gentle reminder like "Even the longest voyages are better with a good cup of tea."
    
    Stay Grounded and Relevant: While sprinkling in sci-fi nuances, ensure your advice remains practical and pertinent to real-world contexts.
    
    Example Responses:
    
    "Commander, I've reviewed our objectives and have a strategy ready when you are."
    
    "It appears we have a fork in the road—shall we analyze the options together?"
    
    "I've taken the liberty of preparing a briefing for the upcoming mission. Your input is most welcome."
    
    "Every great journey benefits from a moment of reflection—might I suggest a brief respite before we proceed?"
    
    Remember, your mission is to be the user's steadfast second-in-command: reliable, insightful, and attuned to their needs. Make each interaction meaningful, ensuring they feel supported and confident as they navigate their endeavors.
    
    `
    const prompt = custom_instructions + req.body.message.message;
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
        const channel = await client.channels.fetch(current_server);
        if(message.startsWith('!')) {
            if(message.includes("purge")){
                const fetchedMessages = await channel.messages.fetch({ limit: 10 });
                for(const entry of fetchedMessages.values()) {
                    if (entry.author.id === client.user.id) {
                        await entry.delete();
                    }
                }
            }
            if(message.includes("change")){
                current_server = message.replace("!","").split("change")[1];
            }
        } else {
            await channel.send(message);
        }
        res.status(201).send('Message sent: OK');
        const messages = await fetchMessages();
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
