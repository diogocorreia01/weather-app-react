import React, { useEffect, useState } from 'react'; // Importa a biblioteca React e a função useState
import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP
import sun from '../assets/sun.png'; // Importa a imagem do sol
import heavyRain from '../assets/heavyrain.png'; // Importa a imagem de chuva intensa
import emptyStar from '../assets/emptyStar.png'; // Importa a imagem da estrela vazia
import mist from '../assets/mist.png'; // Importa a imagem de nevoeiro
import cloud from '../assets/cloud.png'; // Importa a imagem da nuvem
import moderateRain from '../assets/moderaterain.png'; // Importa a imagem da chuva moderada
import CountryFlag from 'react-country-flag'; // Importa o componente CountryFlag da biblioteca react-country-flag
import { API_KEY } from '../config'; // Importa a chave da API a partir do arquivo de configuração
import { useLocation } from 'react-router-dom';

const Weather = () => {
  const [city, setCity] = useState(''); // Define o estado 'city' e a função 'setCity' para atualizá-lo
  const [weatherData, setWeatherData] = useState(null); // Define o estado 'weatherData' e a função 'setWeatherData' para atualizá-lo
  const [error, setError] = useState(''); // Define o estado 'error' e a função 'setError' para atualizá-lo
  const apiKey = API_KEY; // Armazena a chave da API na variável 'apiKey'
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cityName = searchParams.get('city');

  // Função que converte temperatura de Kelvin para Celsius
  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15; 
  };

  const [countryCode, setCountryCode] = useState(''); // Define o estado 'countryCode' e a função 'setCountryCode' para atualizá-lo

  const handleSearch = async () => {
    try {
      // Realiza a requisição GET para a API do OpenWeatherMap
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

      // Converte a temperatura de Kelvin para Celsius
      const temperatureCelsius = kelvinToCelsius(response.data.main.temp);

      // Formata a temperatura com uma casa decimal
      const formattedTemperature = temperatureCelsius.toFixed(1);

      // Atualiza os dados de clima no estado 'weatherData', incluindo a temperatura formatada
      setWeatherData({ ...response.data, main: { ...response.data.main, temp: formattedTemperature } });

      // Atualiza o código do país no estado 'countryCode'
      setCountryCode(response.data.sys.country);
    } catch (error) {
      // Regista o erro na consola
      console.log('Error obtaining the data:', error);

      // Define a mensagem de erro no estado 'error'
      setError('An error occurred while retrieving the weather data.');

      // Limpa os dados de clima no estado 'weatherData'
      setWeatherData(null);

      // Limpa o código do país no estado 'countryCode'
      setCountryCode('');
    }
  };

  // Função que atribui a imagem das contições do tempo
  const getWeatherImage = (condition) => {
    switch (condition) {
      case 'Clear':
        return sun;
      case 'Clouds':
        return cloud;
      case 'Rain':
        return moderateRain;
      case 'Drizzle':
        return moderateRain;
      case 'Thunderstorm':
        return heavyRain;
      case 'Snow':
        return emptyStar;
      case 'Mist':
        return mist;
      case 'Smoke':
        return mist;
      case 'Haze':
        return mist;
      case 'Dust':
        return mist;
      case 'Fog':
        return cloud;
      case 'Sand':
        return mist;
      case 'Ash':
        return mist;
      case 'Squall':
        return mist;
      case 'Squalls':
        return mist;
      case 'Tornado':
        return mist;
      default:
        return sun;
    }
  };  

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (cityName) { // Verifica se cityName está definido
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`); // Faz uma requisição GET para a API do OpenWeatherMap com a cityName e apiKey
          const temperatureCelsius = kelvinToCelsius(response.data.main.temp); // Converte a temperatura de Kelvin para Celsius
          const formattedTemperature = temperatureCelsius.toFixed(1); // Formata a temperatura com 1 casa decimal
          setWeatherData({ ...response.data, main: { ...response.data.main, temp: formattedTemperature } }); // Atualiza o estado weatherData com os dados da resposta da API substituindo a temperatura formatada
          setCountryCode(response.data.sys.country); // Atualiza o estado countryCode com o código do país da resposta da API
        } catch (error) {
          console.log('Error obtaining the data:', error); // Exibe um erro em caso de falha na requisição
          setError('An error occurred while retrieving the weather data.');
          setWeatherData(null);
          setCountryCode('');
        }
      }
    };

    fetchWeatherData(); // Chama a função fetchWeatherData para obter os dados meteorológicos
  }, [apiKey, cityName]); // Define as dependências para o efeito: apiKey e cityName
  
  // Verifica se os dados do clima estão presentes e se existe um valor para a propriedade weather[0].main
  const weatherImage = weatherData?.weather[0]?.main ? getWeatherImage(weatherData.weather[0].main) : null;

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem('token'); // Obtém o token de autenticação do localStorage
  
    try {
      const response = await axios.post(
        'http://localhost:8000/api/favorites',
        { location: city }, // Envia o objeto com a propriedade "location" contendo o valor da cidade
        { headers: { Authorization: token } } // Define o cabeçalho com o token de autenticação
      );
  
      if (response.status === 200) {
        console.log('City added to favorites successfully.'); // Exibe mensagem de sucesso
        // Recarrega a página
        window.location.reload();
      } else {
        console.log('Error adding city to favorites. Please try again.'); // Exibe mensagem de erro
      }
    } catch (error) {
      console.log('Error adding city to favorites:', error.response.data); // Exibe mensagem de erro
    }
  };

  return (
    <div className='weather'>
      <div className='citySearch'>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {/* Renderiza a mensagem de erro caso não haja dados de clima disponíveis */}
      {!weatherData && error && <p className='error'>{error}</p>}

      {weatherData && (
        <div className='weatherData'>
          <button onClick={handleAddToFavorites} className='favButton'>Add to Favorites</button> {/* Botão para adicionar aos favoritos */}

          <div className='countryData'>
            <h2>{weatherData.name}</h2>
            {/* Renderiza a bandeira do país caso haja um código de país disponível */}
            {countryCode && (
              <div className='countryFlag'>
                <CountryFlag countryCode={countryCode} svg style={{
                    fontSize: '2em',
                    lineHeight: '2em',
                    margin: '0',
                }} />
              </div>
            )}
          </div>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Conditions: {weatherData.weather[0].description}</p>
          <img src={weatherImage} alt="Weather" />
        </div>
      )}
    </div>
  );
};

export default Weather; // Exporta o componente Weather como o componente padrão do arquivo
