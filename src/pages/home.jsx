import React from 'react'; // Importa a biblioteca React
import Header from '../components/header'; // Importa o componente Header
import Weather from '../components/weather'; // Importa o componente Weather
import LeftBar from '../components/favbar'; // Importa o componente LeftBar

const Home = () => {

  return (
    <header className='home'>
      <Header /> {/* Chama o componente Header */}
      <Weather /> {/* Chama o componente Weather */}
      <LeftBar /> {/* Chama o componente LeftBar */}
    </header>
  );
};

export default Home; // Exporta o componente Home como o componente padrão do ficheiro
