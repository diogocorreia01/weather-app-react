import React, { useEffect } from 'react'; // Importa a biblioteca React
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Limpa o token de autenticação do localStorage
        localStorage.removeItem('token');
    
        // Redireciona para a página de logout
        navigate('/login');
    });

    return <div>Logging out...</div>;
};

export default Logout; // Exporta o componente Logout como o componente padrão do ficheiro
