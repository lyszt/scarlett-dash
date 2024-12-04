import './App.css';
import '/app.js';

export default function App (){
    return (
            <section className="
             w-screen h-screen flex justify-center items-center m-o max-w-full">
                <div className="border-solid border-gray-200 border bg-white flex flex-col w-2/6 h-3/4 items-center justify-center content-stretch bg-gray-100 rounded-3xl">
                    <form className="w-1/2 flex items-center gap-6 flex-col bg-transparent">
                        <img className="bg-transparent w-5/6 saturate-0 invert" src="/src/assets/crimsonanimation.gif"></img>
                        <label for="password" className="bg-transparent text-left m-0 text-gray-500 m-10 ml-7">Password:</label>
                        <input type="password" name="password" className='p-3' placeholder="Insert your password." required></input>
                        <input type="submit" name="submit" onClick={authentication()} value="Sign-in" className=" p-3 hover:no-underline hover:bg-blue-400 bg-gray-300 bg-gradient-to-r p-3/"></input>
                    </form>
                </div>
            </section>
    );
};
