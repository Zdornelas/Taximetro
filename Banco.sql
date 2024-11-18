
CREATE DATABASE AgendamentoServicos;
USE AgendamentoServicos;
CREATE TABLE Agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cidade VARCHAR(100) NOT NULL,
    servico VARCHAR(100) NOT NULL,
    cpfCnpj VARCHAR(20) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    placa VARCHAR(10),
    renavam VARCHAR(20),
    localAtendimento VARCHAR(100) NOT NULL,
    dataAtendimento VARCHAR(20) NOT NULL,
    horarioAtendimento VARCHAR(50) NOT NULL,
    situacaoatual ENUM ("Pendente","Cancelado","Concluido") DEFAULT "Pendente"
);
   CREATE TABLE Colaboradores (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    matricula VARCHAR(20) NOT NULL,
    senha VARCHAR(20) NOT NULL
);
INSERT INTO Colaboradores
(nome,cpf,matricula,senha)
VALUES
('dilney','40028922','007','007')