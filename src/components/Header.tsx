import { Beaker } from 'lucide-react';

const Header = () => {
  return (
      <header className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700">
        {/* Efecto de resplandor */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl" />

        {/* Contenido principal */}
        <div className="relative">
          <div className="container mx-auto px-4 py-6"> {/* Aumentar el padding para más espacio */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* Logo y título */}
              <div className="flex items-center group">
                <div className="bg-white/10 p-2 rounded-lg mr-3 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                  <Beaker className="text-white h-8 w-8 group-hover:scale-110 transition-transform duration-300" /> {/* Aumentar el tamaño del ícono */}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"> {/* Ajustar tamaño y grosor de la fuente */}
                  Calculadora de Física Avanzada
                </h1>
              </div>

              {/* Navegación */}
              <nav className="flex items-center">
                <ul className="flex space-x-8"> {/* Mayor espacio entre los elementos */}
                  <li>
                    <a
                        href="/"
                        className="text-indigo-100 hover:text-white transition-colors duration-300 relative py-2 px-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300"
                    >
                      Inicio
                    </a>
                  </li>
                  <li>
                    <a
                        href="#"
                        className="text-indigo-100 hover:text-white transition-colors duration-300 relative py-2 px-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300"
                    >
                      Acerca de Nosotros
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Línea decorativa inferior */}
        <div className="h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </header>
  );
};

export default Header;
