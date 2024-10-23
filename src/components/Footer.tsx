const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200 py-10 mt-10"> {/* Aumentar el padding */}
            <div className="container mx-auto px-4">
                <div
                    className="flex flex-col items-center justify-center space-y-8"> {/* Aumentar el espacio entre elementos */}
                    {/* Logo y nombre de la institución */}
                    <div
                        className="flex items-center justify-center space-x-4 group"> {/* Aumentar espacio entre logo y texto */}
                        <img
                            src="/pati.png"
                            alt="Logo TDEA"
                            className="h-12 w-12 transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <a
                            href="https://www.tdea.edu.co/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xl font-bold hover:text-indigo-300 transition-colors duration-300"
                        >
                            Tecnológico de Antioquia I.U.
                        </a>
                    </div>
                    <a
                        href="/"
                        className="text-xl font-bold hover:text-indigo-300 transition-colors duration-300"
                    >
                        •&nbsp;Ramp It Up!&nbsp;•
                    </a>
                    {/* Línea decorativa */}
                    <div className="w-60 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"/>
                    {/* Aumentar el ancho de la línea */}

                    {/* Créditos */}
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Desarrollado por:</p>
                        <p className="mt-2 font-medium text-gray-300 text-lg"> {/* Aumentar tamaño de texto */}
                            <span className="hover:text-indigo-300 transition-colors duration-300 cursor-default px-2">David Villada</span> •
                            <span className="hover:text-indigo-300 transition-colors duration-300 cursor-default px-2">Vanesa Jiménez</span> •
                            <span className="hover:text-indigo-300 transition-colors duration-300 cursor-default px-2">Laura Zapata</span> •
                            <span className="hover:text-indigo-300 transition-colors duration-300 cursor-default px-2">Valentin Vélez</span>
                        </p>
                    </div>

                    {/* Copyright */}
                    <p className="text-xs text-gray-500">
                        &copy;&nbsp;{new Date().getFullYear()} Ingeniería de Software - TdeA
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
