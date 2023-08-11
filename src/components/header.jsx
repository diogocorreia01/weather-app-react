import React from 'react'; // Importa a biblioteca React
import { Link } from 'react-router-dom'; // Importa a biblioteca React Router 

const Header = () => {
  return (
    <header className='header'> {/* Define o elemento header com a classe 'header' (será utilizado no ficheiro scss) */}
      <Link to="/logout"> {/* Cria um link para a rota "/logout" */}
        <button className='logoutButton'>Log Out</button>
      </Link>
      <h1>Weather App</h1> 
    </header>
  );
};

export default Header; // Exporta o componente Header como o componente padrão do ficheiro
