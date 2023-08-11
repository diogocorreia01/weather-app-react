const express = require('express'); // Importa o módulo 'express' para criar o servidor
const bodyParser = require('body-parser'); // Importa o módulo 'body-parser' para analisar o corpo das requisições HTTP
const mysql = require('mysql'); // Importa o módulo 'mysql' para interagir com a base de dados MySQL
const cors = require('cors'); // Importa o módulo 'cors' para habilitar o Cross-Origin Resource Sharing (possibilita que o servidor responda a requisições de origens diferentes )
const jwt = require('jsonwebtoken'); // Importa o módulo 'jsonwebtoken' para gerar o token com base nas informações do utilizador

const app = express(); // Cria uma instância do servidor Express
const port = 8000; // Define a porta do servidor

// Middleware para analisar o corpo das requisições como JSON e permitir requisições de origens diferentes
app.use(bodyParser.json());
app.use(cors({allowedHeaders: ['Content-Type', 'Authorization']}));

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    try {
      // Verifica e decodifica o token para autenticação
      const decoded = jwt.verify(token, 'secret-key');
  
      // Passa o UserId decodificado para as próximas rotas
      req.userId = decoded.userId;
      console.log(req.userId)
  
      next(); // Chama a próxima função/middleware
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.' }); // Retorna uma mensagem de erro com a mensagem 'Invalid token.'
    }
};

// Configuração da conexão com a base de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'diogo_testes',
    password: 'diogo123',
    database: 'weather-app',
});

// Rota para o registo de novos utilizadores
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    // Lógica para registar o utilizador na base de dados
    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.query(query, [name, email, password], (error, results, fields) => {
        if (error) {
            console.log('Error registering user:', error);
            res.status(500).json({ message: 'Error while registering the user.' });
        } else {
            res.json({ message: 'User registered.' });
        }
    });
});

// Rota para o login dos utilizadores
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    // Verifica se o utilizador existe na base de dados
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (error, results) => {
      if (error) {
            console.log('Error logging in:', error);
            res.status(500).json({ message: 'Error while logging in.' });
      } else {
        if (results.length > 0) {
            // Utilizador efetuou o login
            const userId = results[0].id;
            // Gera o token
            const token = jwt.sign({ userId }, 'secret-key');
            //Retorna a resposta com o token
            res.json({ message: 'User logged in.', token });
        } else {
          // Credenciais inválidas
          res.status(401).json({ message: 'Invalid email or password.' });
        }
      }
    });
});

// Rotas para Adicionar, Remover e Mostrar as cidades favoritas do utilizador para ver a temperatura
app.post('/api/favorites', authenticateToken, (req, res) => {
    const { location } = req.body;
    const userId = req.userId;
    console.log('User ID:', userId);
  
    // Guarda a cidade favorita associada ao utilizador na tabela favorites
    const query = 'INSERT INTO favorites (userId, city_name) VALUES (?, ?)';
    db.query(query, [userId, location], (error, results) => {
      if (error) {
        console.log('Error adding city to favorites:', error);
        res.status(500).json({ message: 'Error while adding the city to favorites.' });
      } else {
        res.json({ message: 'City added to favorites.' });
      }
    });
});

// Rota para obter as cidades favoritas do utilizador autenticado
app.get('/api/favorites', authenticateToken, (req, res) => {
    const userId = req.userId;
  
    // Recupera as localizações favoritas do utilizador na base de dados
    const query = 'SELECT city_name FROM favorites WHERE userId = ?';
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.log('Error retrieving favorite locations:', error);
        res.status(500).json({ message: 'Error while retrieving the favorite locations.' });
      } else {
        const cities = results.map((row) => row.city_name);
        res.json({ cities });
      }
    });
});

// Rota para apagar as cidades favoritas
app.delete('/api/favorites/:city', (req, res) => {
  const { city } = req.params;

  // Cria a instrução SQL para remover a cidade dos favoritos
  const sql = `DELETE FROM favorites WHERE city_name = '${city}'`;

  // Executa a query SQL para remover a cidade dos favoritos
  db.query(sql, (error, results) => {
    if (error) {
      console.log('Error removing city from favorites:', error);
      res.sendStatus(500);
    } else {
      console.log('City removed from favorites.');
      res.sendStatus(200);
    }
  });
});
  
// Inicialização do servidor
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});