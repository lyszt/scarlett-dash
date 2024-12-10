import './App.css';
import React, { FormEvent, useState, useEffect } from 'react';

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
                    <input type="submit" name="submit" value="Sign-in" className="p-3 hover:no-underline hover:bg-blue-400 bg-gray-300 bg-gradient-to-r p-3/" />
                    {errorMessage && <p className="bg-transparent text-red-600">{errorMessage}</p>}
                </form>
            </div>
        </section>
    );
};

export function Dash() {
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

    const [link, setLink] = useState('');

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

    interface MessageData {
        content: string;
        author: string;
        guildId: string;
    }

    const [messages, setMessages] = useState<MessageData[]>([]);

    useEffect(() => {
        // Fetch messages from the backend
        fetch('http://localhost:3000/messages')
            .then((response) => response.json())
            .then((data) => setMessages(data.messages))
            .catch((error) => console.error('Error fetching messages:', error));
    }, []);

    return (
        <main>
            <span className="w-screen p-10 flex flex-col gap-5 m-0 text-3xl bg-white tracking-widest">
                🇧🇷 {getLocaleHour(-3)} 🇺🇸 {getLocaleHour(-5)} 🇫🇷 {getLocaleHour(+1)} 🇨🇳 {getLocaleHour(+8)} 🇩🇪 {getLocaleHour(+1)}
            </span>

            <section id="landing" className="w-screen h-screen flex justify-start items-start bg-gray-50">
                <div className="bg-white w-screen h-3/4 flex flex-col justify-flex-start items-start">
                    <span className="w-1/4 h-1/6 text-center text-3xl bg-blue-400 text-white content-center">
                        Welcome to the <b className="bg-transparent text-black-500 font-bold">Scarlett Gateway</b>, Kaldwin.
                        <br /> Today is {getPrettyDate('en-US')}.
                    </span>
                </div>

                <div id="discord-current" className="overflow-x-scroll h-3/5 w-1/2 bg-white">
                    <div>
                        <h3>Listening: Grão-Ducado Czéliano</h3>
                        <ul className="bg-transparent">
                            {messages.length > 0 ? (
                                messages.map((message, index) => (
                                    <li id="dmessage" key={index} className="p-4 text-3xl  m-5 w-1/2 grid justify-start text-left">
                                       <b className="bg-transparent">{message.author}:</b> {message.content})
                                    </li>
                                ))
                            ) : (
                                <li>No messages yet.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </section>

            <section id="outils-1"
                     className="w-full h-screen bg-white flex justify-center items-start m-0 max-w-full align-start content-start flex-wrap p-0">
                <form onSubmit={changeLink} className="flex align-left flex-col w-screen bg-white">
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
                    <iframe id="browser" className="w-screen h-4/5 m-0 p-0" src="https://www.wired.com/" />
                    <iframe
                        className="w-1/3 h-4/5"
                        src="https://calendar.google.com/calendar/embed?src=kalliddel%40gmail.com&ctz=America%2FSao_Paulo"
                        width="800" height="600"
                    />
                </div>
            </section>
        </main>
    );
}
