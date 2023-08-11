import './App.scss'; // Importa o ficheiro de estilos SCSS para o componente App
import React from 'react'; // Importa a biblioteca React
import Login from './pages/login'; // Importa o componente Login (Pagina de Login)
import Register from './pages/register'; // Importa o componente Register (Pagina de Registo)
import Home from './pages/home'; // Importa o componente Home (Pagina principal da App)
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom' // Importa componentes do React Router
import Logout from './components/logout';

function App() {

  // Função para verificar se o utilizador está autenticado (verifica se ao aceder a página existe a variavel 'token' armazenada nas variaveis locais)
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  return (
    <Router>
      <div>
        {/* Definição das rotas */}
        <Routes>
          {/* Rota raiz */}
          <Route exact path="/" element={isAuthenticated() ? <Home /> : <Navigate to="/login" replace />}/>
          {/* Rota de login */}
          <Route exact path="/login" element={<Login/>}/>
          {/* Rota de registo */}
          <Route exact path="/register" element={<Register/>}/>
          {/* Rota da página principal da App */}
          <Route exact path="/home" element={<Home/>}/>
          {/* Rota de Logout */}
          <Route exact path="/logout" element={<Logout/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Exporta o componente App como o componente principal do ficheiro
