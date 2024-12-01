import './App.css';

export default function App (){
    return (
            <section className="
             w-screen h-screen grid justify-center">
                <div className="grid grid-flow-col gap-6 w-6/12 h-1/2 items-center justify-center">
                    <form className="flex items-start gap-6 flex-col">
                        <input className="" type="text" id="password" name="password" placeholder="Insert password."/>
                        <input type="submit" name="submit" className="submit" value="Login"/>
                    </form>
                </div>
            </section>
    );
};
