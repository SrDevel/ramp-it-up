import React from 'react';
import { Beaker } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Beaker className="mr-2" size={24} />
          <h1 className="text-2xl font-bold">Calculadora de Física Avanzada</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-indigo-200">Inicio</a></li>
            <li><a href="#" className="hover:text-indigo-200">Acerca de Nosotros</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;