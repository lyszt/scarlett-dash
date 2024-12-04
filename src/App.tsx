import './App.css';

export default function App (){
    return (
            <section className="
             w-screen h-screen flex justify-center items-center m-o max-w-full">
                <div className="border-solid border-gray-200 border bg-white flex flex-col w-2/6 h-3/4 items-center justify-center content-stretch bg-gray-100 rounded-3xl">
                    <form className="w-1/2 flex items-start gap-6 flex-col bg-transparent">
                        <label for="password" className="bg-transparent text-left text-gray-500">Password:</label>
                        <input type="text" name="password" className='p-3' placeholder="Insert your password."></input>
                        <input type="submit" name="submit" value="Sign-in" className=" p-3 hover:no-underline hover:bg-red-400 bg-gray-300 bg-gradient-to-r p-3/"></input>
                    </form>
                </div>
            </section>
    );
};
