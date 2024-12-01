import './App.css';

export default function App (){
    return (
            <section className="
             w-screen h-screen flex justify-center items-center">
                <div className="shadow-xl flex flex-col w-1/2 h-1/2 items-center justify-center content-stretch bg-gray-100">
                    <form className="flex items-start gap-6 flex-col rounded-b bg-transparent">
                        <input className="p-2" autoComplete="off" type="text" id="password" name="password" placeholder="Insert password."/>
                        <input type="submit" name="submit" className="hover:bg-blue-400 submit bg-primary p-2" value="Login"/>
                    </form>
                </div>
            </section>
    );
};
