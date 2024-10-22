import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Calculadora de Física Avanzada. Todos los derechos reservados.</p>
        <p className='text-indigo-300'>
          David Villada, Vanesa Jiménez, Laura Zapata, Valentin Vélez.
        </p>
      </div>
    </footer>
  );
};

export default Footer;