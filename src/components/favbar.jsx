import React, { useEffect, useState } from 'react'; // Importa a biblioteca React
import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP
import { Link } from 'react-router-dom'; // Importa o componente Link da biblioteca React Router

const FavBar = () => {
    const [cities, setCities] = useState([]); // Define "cities" como um array vazio

    useEffect(() => {
        const fetchFavoriteCities = async () => {
          try {
            const token = localStorage.getItem('token'); // Obtém o token de autenticação do localStorage
            const response = await axios.get('http://localhost:8000/api/favorites', {
              headers: { Authorization: token }, // Define o cabeçalho da requisição com o token de autenticação
            });
            setCities(response.data.cities); // Define as cidades favoritas com base na resposta do servidor
            // Recarrega a página
          } catch (error) {
            console.log('Error retrieving favorite cities:', error.response.data); // Exibe o erro caso ocorra uma falha na obtenção das cidades
          }
        };
    
        fetchFavoriteCities(); // Chama a função para obter as cidades favoritas quando o componente é montado
    }, []);

    const handleRemoveFavorite = async (city) => {
      const token = localStorage.getItem('token'); // Obtém o token de autenticação do localStorage
    
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/favorites/${encodeURIComponent(city)}`, 
          { headers: { Authorization: token } } // Define o cabeçalho da requisição com o token de autenticação
        );
    
        if (response.status === 200) {
          console.log('City successfully removed from favorites.'); // Exibe uma mensagem de sucesso ao remover a cidade
          // Recarrega a página
          window.location.reload();
        } else {
          console.log('Error removing city from favorites.'); // Exibe o erro caso ocorra uma falha ao remover a cidade
        }
      } catch (error) {
        console.log('Error removing city from favorites:', error.response.data); // Exibe o erro caso ocorra uma falha ao remover a cidade
      }
    };

    return (
        <header className='favBar'> 
            <div>
                <h3>Favorite Cities:</h3>
                {cities.map((city, index) => (
                  <div key={index}>
                    <Link to={`/home?city=${encodeURIComponent(city)}`} className='favLink'> {/* Cria um link com a rota "/home" passando o parâmetro da cidade */}
                      <button className='favButton'>{city}</button> {/* Define um botão com a classe 'favButton' e exibe o nome da cidade */}
                    </Link>
                    <button className='removeButton' onClick={() => handleRemoveFavorite(city)}>X</button> {/* Define um botão com a classe 'removeButton' para remover a cidade dos favoritos */}
                  </div>
                ))}
            </div>
        </header>
    );
};

export default FavBar; // Exporta o componente FavBar como o componente padrão do ficheiro
