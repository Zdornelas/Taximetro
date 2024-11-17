const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Seu usuário do MySQL
  password: 'root', // Sua senha do MySQL
  database: 'AgendamentoServicos', // Nome do banco de dados
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

// Rota para inserir agendamentos
app.post('/agendamentos', (req, res) => {
  const {
    cidade,
    servico,
    cpfCnpj,
    nome,
    telefone,
    placa,
    renavam,
    localAtendimento,
    dataAtendimento,
    horarioAtendimento,
  } = req.body;

  const query = `
  INSERT INTO Agendamentos 
  (cidade, servico, cpfCnpj, nome, telefone, placa, renavam, localAtendimento, dataAtendimento, horarioAtendimento)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;


  db.query(
    query,
    [
      cidade,
      servico,
      cpfCnpj,
      nome,
      telefone,
      placa,
      renavam,
      localAtendimento,
      dataAtendimento,
      horarioAtendimento,
    ],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir agendamento:', err);
        res.status(500).send('Erro ao inserir agendamento');
      } else {
        res.status(200).send('Agendamento inserido com sucesso');
      }
    }
  );
});

app.get('/agendamentos/:cpfCnpj', (req, res) => {
    const { cpfCnpj } = req.params;
  
    const query = 'SELECT * FROM Agendamentos WHERE cpfCnpj = ?';
  
    db.query(query, [cpfCnpj], (err, results) => {
      if (err) {
        console.error('Erro ao buscar agendamento:', err);
        return res.status(500).send('Erro ao consultar agendamento');
      }
  
      if (results.length > 0) {
        res.status(200).json(results[0]); // Retorna o primeiro agendamento encontrado
      } else {
        res.status(404).send('Agendamento não encontrado');
      }
    });
  });
  app.delete('/agendamentos/:cpfCnpj', (req, res) => {
    const { cpfCnpj } = req.params;
  
    const query = 'DELETE FROM Agendamentos WHERE cpfCnpj = ?';
  
    db.query(query, [cpfCnpj], (err, result) => {
      if (err) {
        console.error('Erro ao cancelar agendamento:', err);
        return res.status(500).send('Erro ao cancelar agendamento');
      }
  
      if (result.affectedRows > 0) {
        res.status(200).send('Agendamento cancelado com sucesso');
      } else {
        res.status(404).send('Agendamento não encontrado');
      }
    });
  });
  app.get('/horarios-disponiveis', (req, res) => {
    const { dataAtendimento } = req.query; // A data é passada como parâmetro na query
  
    const query = `
      SELECT horarioAtendimento 
      FROM Agendamentos 
      WHERE dataAtendimento = ?
    `;
  
    db.query(query, [dataAtendimento], (err, results) => {
      if (err) {
        console.error('Erro ao buscar horários:', err);
        return res.status(500).send('Erro ao buscar horários');
      }
  
      // Retorna os horários já ocupados
      const horariosOcupados = results.map(row => row.horarioAtendimento);
      res.status(200).json(horariosOcupados);
    });
  });
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });