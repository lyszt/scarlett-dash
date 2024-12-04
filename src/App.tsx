import './App.css';

export default function App (){
    return (
            <section className="
             w-screen h-screen flex justify-center items-center">
                <div className="shadow-xl flex flex-col w-1/2 h-1/2 items-center justify-center content-stretch bg-gray-100">
                    <div className="flex items-start gap-6 flex-col rounded-b bg-transparent">
                        <a href='/auth' role="button" className="p-3 hover:no-underline hover:bg-blue-400 bg-gray-300 bg-gradient-to-r p-3/">
                        Sign in
                        </a>
                    </div>
                </div>
            </section>
    );
};
