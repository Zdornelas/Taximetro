# 🧪 Documento de Desenvolvimento

## 📅 Planejamento do Projeto

O projeto foi planejado com foco na construção de um sistema de taxímetro digital com backend em Node.js e frontend em React.js, integrando-se a um banco de dados MySQL e utilizando Docker para facilitar a execução em diferentes ambientes.

## 🚀 Sprints

- **Quantidade de sprints:** 3 sprints
- **Duração de cada sprint:** 1 semana

### 📌 Cronograma das Sprints:

- **Sprint 1:** Levantamento de requisitos e configuração inicial do ambiente.
- **Sprint 2:** Desenvolvimento das funcionalidades principais (cálculo da tarifa, interface de entrada de dados).
- **Sprint 3:** Integração, testes, ajustes de usabilidade e preparação da documentação.

## 🧭 Metodologia Ágil

A metodologia utilizada foi o **Scrum**, com reuniões rápidas diárias para acompanhamento (daily meetings) e revisão ao final de cada sprint.

## 🚀 Tecnologias Utilizadas

- [React Js](https://react.dev)
- [Node js](https://nodejs.org/pt)
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Docker](https://www.docker.com)
- [Mysql](https://www.mysql.com/products/workbench/)

## Como Executar o Projeto

1. **Clone o repositório:**

```bash
git clone https://github.com/Zdornelas/Taximetro.git
```

2. **Instale as dependências:**

```bash
cd frontend
npm install
```

3. **Execute o frontend**

```bash
npm start
```
4. **Execute o backend**

```bash
cd backend
npm install
node server.js
```
5.**Instalação do Docker**
```bash
docker-compose up --build
```

## Estrutura do Projeto
```
Taximetro/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── eslint.config.js
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── AgendamentoForm.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── CancelarAgendamento.jsx
│   │   ├── ConsultarAgendamento.jsx
│   │   ├── Login.jsx
│   │   ├── main.jsx
│   │   ├── PainelColaborador.jsx
│   │   ├── index.css
│
├── Banco.sql
├── docker-compose.yml
├── README.md
```
## 🧩 Desafios Enfrentados e Soluções

### 🔧 Integração entre frontend e backend

**Desafio**: Gerenciar corretamente as rotas e comunicação entre os dois lados, especialmente em ambiente Docker.

**Solução**: Padronizar as URLs base e criar arquivos `.env` para facilitar a configuração dos endpoints.

### 🐳 Aprendizado e configuração do Docker

**Desafio**: Criar containers que funcionassem corretamente em conjunto.

**Solução**: Estudo da documentação oficial e testes iterativos até alcançar um `docker-compose.yml` funcional.

### 🔐 Conexão com o MySQL

**Desafio**: Garantir que o backend conseguisse se conectar corretamente ao banco de dados em um ambiente Dockerizado.

**Solução**: Configuração correta das variáveis de ambiente e das redes internas do Docker.

---
