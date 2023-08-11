import React, { useState } from 'react'; // Importa a biblioteca React
import { Link, useNavigate } from "react-router-dom" // Importa a biblioteca React Router (componentes Link e useNavigate)
import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP


const Login = () => {
  const [email, setEmail] = useState(''); // Define o estado "email" como uma string vazia
  const [password, setPassword] = useState(''); // Define o estado "password" como uma string vazia
  const [error, setError] = useState(''); // Define o estado "error" como uma string vazia
  const navigate = useNavigate(); // Inicializa a função navigate da biblioteca React Router

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login', { email, password });

      if (response.status === 200) {
        const token = response.data.token;

        // Armazena o token na localStorage
        localStorage.setItem('token', token);

        // Redireciona o utilizador para a página inicial
        navigate('/home');
      } else {
        setError('Error logging in. Please try again.');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <header className='login'>
      <h1>Weather App</h1> 
      {error && <p>{error}</p>} {/* Exibe a mensagem de erro caso exista */}
      <form onSubmit={handleSubmit} className='loginForm'> {/* Define um formulário e chama a função handleSubmit ao ser submetido */}
        <div className='email'>
          <label>Email:</label>
          <input type="text" name="email" value={email} onChange={handleEmailChange}/>
        </div>
        
        <div className='password'>
          <label>Password:</label>
          <input type="password" name="password" value={password} onChange={handlePasswordChange}/>
        </div>

        <button className='loginButton' type='submit'>Login</button>
      </form>
      <p>Don't have an account? <Link to={'/register'}>Register</Link></p> {/* Exibe um texto e um link para a página de registo */}
    </header>
  );
};

export default Login; // Exporta o componente Login como o componente padrão do arquivo

