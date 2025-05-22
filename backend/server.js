require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const port = process.env.PORT || 3001;

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
        res.status(200).json(results[0]); 
      } else {
        res.status(404).send('Agendamento não encontrado');
      }
    });
  });

  app.put('/agendamentos/:cpfCnpj', (req, res) => {
    const { cpfCnpj } = req.params;
    
    const query = 'UPDATE Agendamentos SET situacaoAtual = ? WHERE cpfCnpj = ?';
    
    db.query(query, ['Cancelado', cpfCnpj], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar agendamento:', err);
        return res.status(500).send('Erro ao atualizar agendamento');
      }
    
      if (result.affectedRows > 0) {
        res.status(200).send('Agendamento cancelado com sucesso');
      } else {
        res.status(404).send('Agendamento não encontrado');
      }
    });
  });

  app.put('/agendamentos/:dataAtendimento/:horarioAtendimento/:situacaoatual', (req, res) => {
    const { dataAtendimento, horarioAtendimento, situacaoatual } = req.params;
  
    const query = `
      UPDATE Agendamentos 
      SET situacaoAtual = 'Concluido' 
      WHERE dataAtendimento = ? 
      AND horarioAtendimento = ? 
      AND situacaoatual = ?
    `;
  
    db.query(query, [dataAtendimento, horarioAtendimento, situacaoatual], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar agendamento:', err);
        return res.status(500).send('Erro ao atualizar agendamento');
      }
  
      if (result.affectedRows > 0) {
        res.status(200).send('Agendamento atualizado com sucesso');
      } else {
        res.status(404).send('Agendamento não encontrado');
      }
    });
  });
  
  app.get('/situacao', (req, res) => {
    const query = `
      SELECT *
      FROM Agendamentos 
      WHERE situacaoatual = "Cancelado" OR situacaoatual = "Concluido"
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Erro ao buscar agendamentos:', err);
        return res.status(500).send('Erro ao buscar agendamentos');
      }
      res.status(200).json(result);
    });
  });

  app.get('/situacao/Pendente', (req, res) => {
    const query = `
      SELECT *
      FROM Agendamentos 
      WHERE situacaoatual = "Pendente"
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Erro ao buscar agendamentos:', err);
        return res.status(500).send('Erro ao buscar agendamentos');
      }
      res.status(200).json(result);
    });
  });

  app.get('/horarios-disponiveis/', (req, res) => {
    const { dataAtendimento } = req.query; 
  
    const query = `
      SELECT horarioAtendimento 
      FROM Agendamentos 
      WHERE dataAtendimento = ?
      AND situacaoatual = "Pendente" 
      OR situacaoatual = "Concluido"
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

  app.get('/usuario/:cpf', (req, res) => {
    const { cpf } = req.params;
    console.log('CPF recebido na rota:', cpf);
  
    const query = 'SELECT * FROM Colaboradores WHERE cpf = ?';
    db.query(query, [cpf], (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).send('Erro ao consultar usuário');
      }
  
      console.log('Resultados da consulta:', results);
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).send('Usuário não encontrado');
      }
    });
  });

  app.post('/login', (req, res) => {

    const { matricula, senha } = req.body;
  
    // Verifica se a matrícula e a senha foram fornecidas
    if (!matricula || !senha) {
      return res.status(400).json({ error: 'Matrícula e senha são obrigatórios.' });
    }
  
    // Consulta no banco de dados para verificar se a matrícula existe e a senha corresponde
    const query = 'SELECT * FROM Colaboradores WHERE matricula = ?';
  
    db.query(query, [matricula], (err, results) => {
      if (err) {
        console.error('Erro ao consultar a matrícula:', err);
        return res.status(500).json({ error: 'Erro no servidor.' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: 'Matrícula ou senha incorreta.' });
      }
  
      const user = results[0];
  
      // Verifica se a senha fornecida é a mesma no banco
      if (user.senha !== senha) {
        return res.status(401).json({ error: 'Matrícula ou senha incorreta.' });
      }
  
      // Se a matrícula e a senha estiverem corretas
      res.status(200).json({ message: 'Login bem-sucedido', user });
    });
  });
  // Rota para validar CPF e Matrícula
app.post('/validar-cpf-matricula', (req, res) => {
  const { cpf, matricula } = req.body;

  if (!cpf || !matricula) {
    return res.status(400).json({ error: 'CPF e Matrícula são obrigatórios.' });
  }

  const query = 'SELECT * FROM Colaboradores WHERE cpf = ? AND matricula = ?';

  db.query(query, [cpf, matricula], (err, results) => {
    if (err) {
      console.error('Erro ao consultar CPF e Matrícula:', err);
      return res.status(500).json({ error: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'CPF ou Matrícula inválidos.' });
    }

    // CPF e Matrícula válidos
    res.status(200).json({ message: 'Validação bem-sucedida.' });
  });
});
app.put('/atualizar-senha', (req, res) => {
  const { cpf, novaSenha } = req.body;

  if (!cpf || !novaSenha) {
    return res.status(400).json({ error: 'CPF e nova senha são obrigatórios.' });
  }

  const query = 'UPDATE Colaboradores SET senha = ? WHERE cpf = ?';

  db.query(query, [novaSenha, cpf], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar senha:', err);
      return res.status(500).json({ error: 'Erro no servidor ao atualizar a senha.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  });
});

app.get('/situacao', (req, res) => {
  const query = `
    SELECT *
    FROM Agendamentos 
    WHERE situacaoatual = "Pendente"
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao buscar agendamentos:', err);
      return res.status(500).send('Erro ao buscar agendamentos');
    }
    res.status(200).json(result);
  });
});

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });