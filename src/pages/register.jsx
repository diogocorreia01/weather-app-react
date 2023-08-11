import React, { useState } from 'react'; // Importa a biblioteca React
import { Link, useNavigate  } from 'react-router-dom'; // Importa os componentes Link e useNavigate da biblioteca React Router
import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP

const Register = () => {
    const [name, setName] = useState(''); // Define o estado "name" como uma string vazia
    const [email, setEmail] = useState(''); // Define o estado "email" como uma string vazia
    const [password, setPassword] = useState(''); // Define o estado "password" como uma string vazia
    const [error, setError] = useState(''); // Define o estado "error" como uma string vazia
    const navigate = useNavigate(); // Inicializa a função navigate da biblioteca React Router

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Construção do objeto de dados com os campos do formulário
        const userData = {
          name,
          email,
          password,
        };
    
        try {
          // Chamada da API para registar o utilizador
          const response = await axios.post('http://localhost:8000/api/register', userData);
    
          if (response.status === 200) {
            // Utilizador registrado com sucesso, redireciona para a página de login
            navigate('/login');
          } else {
            // Caso ocorra um erro ao registar o utilizador
            setError(error.response.data.message);
          }
        } catch (error) {
          setError(error.response.data.message);
        }
    };

    return (
        <header className='register'>
        <h1>Weather App</h1> 
        {error && <p>{error}</p>} {/* Exibe a mensagem de erro caso exista */}
        <form onSubmit={handleSubmit} className='registerForm'> {/* Define um formulário com a classe 'registerForm' e chama a função handleSubmit ao ser submetido */}

            <div className='name'>
            <label>Name:</label>
            <input type="text" value={name} name="name" onChange={(e) => setName(e.target.value)} /> {/* Define um campo de senha controlado pelo state 'name' */}
            </div>

            <div className='email'>
            <label>Email:</label>
            <input type="text" value={email} name="email" onChange={(e) => setEmail(e.target.value)} /> {/* Define um campo de senha controlado pelo state 'email' */}
            </div>
            
            <div className='password'>
            <label>Password:</label>
            <input type="password" value={password} name="password" onChange={(e) => setPassword(e.target.value)} /> {/* Define um campo de senha controlado pelo state 'password' */}
            </div>

            <button className='registerButton' type='submit'>Register</button>
        </form>
        <p>Already have an account? <Link to={'/login'}>Login</Link></p> {/* Exibe texto e um link para a página de login */}
        </header>
    );
};

export default Register; // Exporta o componente Register como o componente padrão do arquivo
