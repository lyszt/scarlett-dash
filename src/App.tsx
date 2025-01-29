import './App.css';
import React, { FormEvent, useState, useEffect } from 'react';
import {motion} from "motion/react";

export function Login() {
    // Request
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: FormEvent) => {
        const logo = document.querySelector('#logo');
        e.preventDefault();

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            credentials: 'include',
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            logo?.classList.remove('saturate-0');
            logo?.classList.add('saturate-100');
            const transition = document.querySelector('#transition');
            transition?.classList.remove('w-0', 'h-0');
            transition?.classList.add('w-screen', 'h-screen');

            setInterval(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            const message = await response.text();
            setErrorMessage(message);
            logo?.classList.remove('saturate-0');
            logo?.classList.add('saturate-100', 'hue-rotate-180');
        }
    };

    return (
        <section className="w-screen h-screen flex justify-center items-center m-o max-w-full">
            <div id="transition" className="transition-all delay-500 duration-600 rounded-full absolute bg-gray-100 w-0 h-0 z-10 m-0 top-0"></div>
            <div className="border-solid border-gray-200 border bg-white flex flex-col w-2/6 h-3/4 items-center justify-center content-stretch rounded-3xl">
                <form onSubmit={handleLogin} action="/login" className="w-1/2 flex items-center gap-6 flex-col bg-transparent">
                    <img id="logo" className="transition-all duration-500 bg-transparent w-5/6 saturate-0" src="/src/assets/crimsonanimation.gif" alt="Graph surrounded by multiple circles. Lyszt's logo." />
                    <label htmlFor="password" className="bg-transparent text-left text-gray-500 m-10 ml-7">Password:</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        name="password"
                        className="p-3"
                        placeholder="Insert your password."
                        required
                    />
                    <input type="submit" name="submit" value="Sign-in" className="p-3 hover:no-underline bg-black  text-white hover:bg-gray-300 hover:text-black" />
                    {errorMessage && <p className="bg-transparent text-red-600">{errorMessage}</p>}
                </form>
            </div>
        </section>
    );
};

export function Dash() {

    async function getQuote(key = null) {
        const quote_element = document.querySelector('#quote');

        const requestBody = { key, lang: 'en' };

        try {
            const response = await fetch('http://localhost:3000/get-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }

            const data = await response.json();

            if (data.quoteText && data.quoteAuthor) {
                quote_element.innerHTML = `" ${data.quoteText}" - ${data.quoteAuthor}. `;
            } else {
                quote_element.innerHTML = 'Sorry, no quote found.';
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            quote_element.innerHTML = 'Sorry, there was an error fetching the quote.';
        }
    }

    useEffect(() => {
        getQuote();
        }, []);



    // User authentication
    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    console.log('User authenticated.');
                } else {
                    throw new Error('User not authenticated.');
                }
            } catch (error) {
                console.log(error);
                window.location.href = '/';
            }
        };

        authenticateUser();
    }, []);

    let [link, setLink] = useState('');

    // Link changer
    const changeLink = async (e: FormEvent) => {
        e.preventDefault();

        if (!link.startsWith('http://') && !link.startsWith('https://')) {
            link = 'http://' + link;
        }

        if (link.includes('youtube')) {
            link = link.replace('watch?v=', 'embed/');
        }

        if (link.includes('--watch')) {
            const VITE_YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
            if (!VITE_YOUTUBE_API_KEY) {
                throw new Error('Youtube API key not found.');
            }

            link = link.replace('--watch', '');
            const url = `https://www.googleapis.com/youtube/v3/search?key=${VITE_YOUTUBE_API_KEY}&type=video&part=snippet&q=${link}`;

            interface YoutubeSearchResponse {
                items: { id: { videoId: string } }[];
            }

            const response = await fetch(url);
            const data: YoutubeSearchResponse = await response.json();

            link = data.items[0]?.id.videoId;

            if (data.items.length === 0) {
                console.log('No videos found.');
            }

            link = `https://www.youtube.com/embed/${link}`;
        }

        console.log(link);
        const browser = document.querySelector('#browser');
        browser?.setAttribute('src', link);
    };

    function getPrettyDate(locale: string) {
        const date = new Date();
        return date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }

    function getLocaleHour(offset: number) {
        // Take -3 as the origin point
        const d = new Date();
        const localTime = d.getTime();
        const localOffset = d.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const target = utc + (3600000 * offset);
        return new Date(target).toLocaleString();
    }

    // Send message on Discord

    const MessageContent = ({ content }) => {
        if (isGif(content)) {
            return (
                <a className="text-black font-bold" target="_blank" href={content}>
                    <img src={content} alt="GIF" />View GIF
                </a>
            )
        }
        if (isYoutube(content)) {
            return (
                <iframe
                    title="YouTube video"
                    src={`https://youtube.com/embed/${content.split("?v=")[1]}`}
                />
            )
        }
        return content
    }

    let [messageInput, setMessageInput] = useState('');
    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ message: messageInput }),
            });
                if (response.ok) {
                    console.log('Message sent.');
                    fetch('http://localhost:3000/messages')
                        .then((response) => response.json())
                        .then((data) => setMessages(data.messages))
                        .catch((error) => console.error('Error fetching messages:', error));
                 [];
            }

        } catch (error) {
            console.error(error);
        }
        setMessageInput('');

    };
    interface MessageData {
        content: string;
        author: string;
        guildId: string;
        avatar: string;
        author_id: string;
    }

    const isSelf = (message: string) => {
        return message.author_id == '1150526796584976444';
    }
    const [messages, setMessages] = useState<MessageData[]>([]);

    useEffect(() => {
        // Fetch messages from the backend
        fetch('http://localhost:3000/messages')
            .then((response) => response.json())
            .then((data) => setMessages(data.messages))
            .catch((error) => console.error('Error fetching messages:', error));
    }, []);
    // Render gifs
    const isGif = (url: string) => {
        return url.includes("tenor.com") || url.endsWith(".gif");
    };
    const isYoutube = (url: string) => {
        return url.includes("youtube.com");
    }

    // Gemini messages
    const [geminiMessage, setGeminiMessage] = useState({message: ""});
    const [responseText, setResponseText] = useState<string>('');


    const sendGeminiMessage = async (e: FormEvent) => {
        e.preventDefault();
        const messageSent = geminiMessage
        setGeminiMessage({
            ...geminiMessage,
            message: "",
        });
        try {
            const response = await fetch("http://localhost:3000/geminiMessage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageSent })
            });

            if (!response.ok) throw new Error('Request failed');

            const data = await response.text();
            setResponseText(data);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <main>
            <div className="flex flex-col">
                <div id="UTC-times"
                     className="w-full justify-center p-10 flex flex-row gap-5 m-0 text-xl bg-white tracking-widest">
                    <a href="https://news.google.com/topstories?hl=pt-BR" target="_blank" rel="noopener noreferrer"
                       aria-label="Top stories in Brazil">
                        🇧🇷 Brazil - {getLocaleHour(-3)}
                    </a>
                    <a href="https://news.google.com/topstories?hl=en-US" target="_blank" rel="noopener noreferrer"
                       aria-label="Top stories in the United States">
                        🇺🇸 USA - {getLocaleHour(-5)}
                    </a>
                    <a href="https://news.google.com/topstories?hl=fr-FR" target="_blank" rel="noopener noreferrer"
                       aria-label="Top stories in France">
                        🇫🇷 France - {getLocaleHour(+1)}
                    </a>
                    <a href="https://news.google.com/topstories?hl=es-ES" target="_blank" rel="noopener noreferrer"
                       aria-label="Top stories in Spain">
                        🇪🇸 Spain - {getLocaleHour(+1)}
                    </a>
                    <a href="https://news.google.com/topstories?hl=it-IT" target="_blank" rel="noopener noreferrer"
                       aria-label="Top stories in Italy">
                        🇮🇹 Italy - {getLocaleHour(+1)}
                    </a>
                </div>
            </div>

            <div className="flex flex-row">
                <section id="gemini" className="h-full w-3/4">
                    <div className="overflow-x-scroll w-full h-full text-black">
                        <motion.span
                            initial={{scale: .6}} animate={{scale: 1, transition: {duration: 2}}
                            }
                            id="gemini-response" key={responseText} className="bg-blue-200 mt-9 w-4/5 m-auto block p-5  shadow-gray-400 shadow mb-5 rounded-xl">✨ {responseText}</motion.span>
                    </div>
                    <form className="h-2/6 w-3/4 m-auto" onSubmit={sendGeminiMessage}>
                        <input
                            value={geminiMessage.message} className="w-full rounded-full text-lg bg-gray-200 p-10 shadow"
                            type="text"
                            placeholder="Talk with Navigator."
                        onChange={(e) =>
                        setGeminiMessage({...geminiMessage,
                            message : e.target.value,
                            })
                        }></input>
                        <input type="submit" value="Send"
                               className="w-1/2 rounded-full m-auto bg-black  text-white hover:bg-gray-300 hover:text-black p-3 mt-9"></input>
                    </form>
                </section>
                <section className="w-1/2 h-screen flex justify-start items-start bg-gray-50">
                    <div className="bg-white w-full h-3/4 flex flex-col justify-flex-start items-center gap-10nodem">
                        <span className="w-full h-1/6 text-center text-2xl bg-black text-white content-center">
                            Welcome to the <b className="bg-transparent text-black-500 font-bold">Scarlett Gateway</b>, Kaldwin.
                            <br/> Today is {getPrettyDate('en-US')}.
                        </span>
                        <div id="quote" className="h-1/6 w-3/4 p-5 content-center">
                            <span></span>
                        </div>
                    </div>

                </section>


            </div>

            <section id="outils-1"
                     className="w-full h-screen bg-white flex justify-center items-start m-0 max-w-full align-start content-start flex-wrap p-0">
                <form onSubmit={changeLink} className="flex align-left flex-col w-full bg-white">
                    <input
                        type="text"
                        onChange={(e) => setLink(e.target.value)}
                        name="search"
                        placeholder="Insert a website for visitation."
                        className="p-3 bg-white"
                    />
                    <input
                        type="submit"
                        value="Go"
                        className="p-3 bg-gray-200 w-1/6 m-5 hover:bg-blue-400"
                    />
                </form>

                <div className="w-full h-screen align-start items-start flex content-start flex-row">
                    <iframe id="browser" className="w-screen h-4/5 m-0 p-0" src="https://www.wired.com/"/>
                    <iframe
                        className="w-1/3 h-4/5"
                        src="https://calendar.google.com/calendar/embed?src=kalliddel%40gmail.com&ctz=America%2FSao_Paulo"
                        width="800" height="600"
                    />
                </div>
            </section>

            <section id="outils-2" className="w-full h-screen flex justify-start items-start bg-gray-50">
                <div id="discord-current" className="h-5/6 w-screen bg-white flex flex-col flex">
                    <div className="overflow-x-scroll w-full">
                        <ul className="bg-transparent">
                            {messages.length > 0 ? (
                                messages.map((message, index) => (
                                    <motion.li key={index} initial={{scale: .6}}
                                       animate={{scale: 1, transition: {duration: 1}}}
                                       className="bg-transparent  p-4 text-2xl m-5 w-full grid grid-flow-col justify-start text-left">
                                        <img alt="User avatar" className="w-28 rounded-full" src={message.avatar}/>
                                        <div className="flex flex-col gap-0 ml-5 items-start bg-transparent">
                                          <span
                                              id="dmessage"
                                              className={` text-black shadow shadow-gray-400 p-5 m-5 flex ${
                                                  isSelf(message.author_id) ? 'bg-blue-400' : 'bg-gray-300'
                                              }`}
                                          >
                                            <MessageContent content={message.content}/>
                                          </span>
                                        </div>
                                    </motion.li>

                                ))
                            ) : (
                                <li>No messages yet.</li>
                            )}

                        </ul>
                    </div>
                    <form className="h-2/6 w-full flex flex-row" onSubmit={sendMessage}>
                        <input onChange={(e) => setMessageInput(e.target.value)}
                               className="w-full m-8 rounded-xl text-lg bg-gray-200 p-10 shadow"
                               type="text"
                               placeholder="Write here to send a message to Discord."></input>
                        <input type="submit" value="Send"
                               className="hidden"></input>
                    </form>
                </div>
            </section>
        </main>
    );
}
