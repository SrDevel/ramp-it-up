import { Meteors } from "../components/ui/Meteors.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

const About = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900">
                <div className="relative">
                    {/* Efectos de fondo */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent blur-3xl"/>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent blur-3xl"/>

                    {/* Contenido principal */}
                    <div className="container mx-auto px-4 py-16 relative">
                        <div className="max-w-4xl mx-auto">
                            {/* Carta principal con el estilo del ejemplo */}
                            <div className="w-full relative">
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-[0.80] rounded-full blur-3xl" />
                                <div className="relative shadow-xl bg-gray-900/90 border border-gray-800 px-8 py-12 h-full overflow-hidden rounded-2xl">
                                    {/* Ícono decorativo */}
                                    <div className="h-10 w-10 rounded-full border flex items-center justify-center mb-6 border-gray-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-4 w-4 text-gray-300"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                                            />
                                        </svg>
                                    </div>

                                    {/* Contenido */}
                                    <h1 className="font-bold text-3xl text-white mb-6 relative z-50">
                                        Acerca de Nosotros
                                    </h1>

                                    <div className="space-y-6 relative z-50">
                                        <p className="text-lg text-gray-300">
                                            Somos un grupo de estudiantes de ingeniería de software que ha decidido
                                            fusionar la física y la tecnología en una experiencia única.
                                        </p>

                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                            <h2 className="text-xl text-white mb-4">Nuestra Misión</h2>
                                            <p className="text-gray-300">
                                                Desarrollamos una herramienta interactiva que facilita la comprensión
                                                de los conceptos fundamentales de Leyes de Newton. A través de nuestra
                                                simulación, los usuarios pueden explorar fenómenos como el equilibrio
                                                de fuerzas, el movimiento en planos inclinados y la caída libre, todo
                                                de manera intuitiva y precisa.
                                            </p>
                                        </div>

                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                            <h2 className="text-xl text-white mb-4">Tecnologías</h2>
                                            <p className="text-gray-300">
                                                Este proyecto fue desarrollado en TypeScript, un lenguaje que nos permite
                                                crear simulaciones precisas y robustas. Además, hemos integrado la IA
                                                Gemini para proporcionar un análisis más profundo de los ejercicios.
                                            </p>
                                        </div>

                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                            <h2 className="text-xl text-white mb-4">Nuestro Objetivo</h2>
                                            <p className="text-gray-300">
                                                Buscamos combinar ciencia y tecnología para ofrecer una herramienta
                                                educativa accesible, que permita a estudiantes y profesionales analizar
                                                y comprender mejor los principios que rigen el movimiento de los cuerpos
                                                en el mundo físico.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <div className="mt-8 relative z-50">
                                        <button
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                            onClick={() => {
                                                window.location.href = '/';
                                            }}
                                        >
                                            Explorar Simulación
                                        </button>
                                    </div>

                                    {/* Efecto de meteoritos */}
                                    <Meteors number={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;