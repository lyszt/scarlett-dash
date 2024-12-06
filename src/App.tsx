import './App.css';
import React, {FormEvent, useState} from "react";

export function Login (){
    
    // Request
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleLogin = async (e: React.FormEvent) => {           
        const logo = document.querySelector("#logo");
        e.preventDefault();
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            credentials: 'include',
            body: JSON.stringify({password})
        });
        if(response.ok){
            logo?.classList.remove('saturate-0');
            logo?.classList.add('saturate-100')
            const transition = document.querySelector('#transition');
            transition?.classList.remove('w-0');
            transition?.classList.remove('h-0');
            transition?.classList.add('w-screen');
            transition?.classList.add('h-screen');
            setInterval(() => {
                window.location.href = '/dashboard';  
            }, 1000);
           
        } else {
            const message = await response.text();
            setErrorMessage(message);
            logo?.classList.remove('saturate-0');
            logo?.classList.add('saturate-100');
            logo?.classList.add('hue-rotate-180')
        }
    };

    return (
            <section className="
             w-screen h-screen flex justify-center items-center m-o max-w-full">
                <div id="transition" className='transition-all delay-500 duration-600 rounded-full absolute bg-gray-100 w-0 h-0 z-10 m-0 top-0'></div>
                <div className="border-solid border-gray-200 border bg-white flex flex-col w-2/6 h-3/4 items-center justify-center content-stretch rounded-3xl">
                    <form onSubmit={handleLogin} action="/login" className="w-1/2 flex items-center gap-6 flex-col bg-transparent">
                        <img id="logo" className="transition-all duration-500 bg-transparent w-5/6 saturate-0" src="/src/assets/crimsonanimation.gif" alt="Graph surrounded by multiple circles. Lyszt's logo."></img>
                        <label htmlFor="password" className="bg-transparent text-left text-gray-500 m-10 ml-7">Password:</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" className='p-3' placeholder="Insert your password." required></input>
                    <input type="submit" name="submit" value="Sign-in" className=" p-3 hover:no-underline hover:bg-blue-400 bg-gray-300 bg-gradient-to-r p-3/"></input>
                        {errorMessage && <p className="bg-transparent text-red-600">{errorMessage}</p>}
                    </form>
                </div>
            </section>
    );
};
import { useEffect } from 'react';

export function Dash() {
    // User authentication
    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
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
    const changeLink = async (e: React.FormEvent) => {
        console.log(link);
        if(!link.startsWith('http://')&&!link.startsWith('https://')){  
            link = 'http://' + link;
        }
        if(link.includes('youtube')){
            link = link.replace('watch?v=', 'embed/');
        }
        e.preventDefault();
        const browser = document.querySelector('#browser');;
        browser?.setAttribute('src', link);
    }

    return (
        <section className="w-full h-screen flex justify-center items-start m-0 max-w-full align-start content-start flex-wrap p-0">
            <form onSubmit={changeLink} className="flex align-left flex-col w-screen">
                    <input type="text" onChange={(e) => setLink(e.target.value)} name="search" placeholder="Insert a website for visitation." className="p-3 bg-white"></input>
                    <input type="submit" value="Go" className="p-3 bg-gray-200 w-1/6 m-5 hover:bg-blue-400"></input>
                </form>
            <div className='w-full h-screen align-start items-start flex content-start flex-row'>  
                <iframe id="browser" className="w-screen h-4/5 m-0 p-0" src="https://www.wired.com/"></iframe>         
                <iframe className="w-1/3 h-4/5" src="https://calendar.google.com/calendar/embed?src=kalliddel%40gmail.com&ctz=America%2FSao_Paulo" width="800" height="600"></iframe>  
            </div>
        </section>
    );
}
