import React, { useState } from "react";
import "./App.css";
import imagem from "./assets/Imeq.png";
import AgendamentoForm from "./AgendamentoForm"; 

const App = () => {
  const [currentView, setCurrentView] = useState(""); // Estado para controlar a janela ativa

  // Função para abrir o formulário com a ação correta
  const openForm = (view) => {
    setCurrentView(view);
  };

  // Função para fechar o formulário e voltar à tela inicial
  const closeForm = () => {
    setCurrentView("");
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src={imagem} alt="Logo IMEQ-PB" />
          <span>IMEQ-PB</span>
        </div>
      </header>

      {/* Tela Inicial */}
      {currentView === "" && (
        <div className="Quadrado">
          <h1>Agendamento de Serviços</h1>
          <p>Selecione a Opção Desejada:</p>
          <button onClick={() => openForm("agendar")}>Agendar Serviço</button>
          <button onClick={() => openForm("consultar")}>Consultar Agendamento</button>
          <button onClick={() => openForm("cancelar")}>Cancelar Agendamento</button>
        </div>
      )}

      {/* Formulário de Agendamento */}
      {currentView === "agendar" && <AgendamentoForm closeForm={closeForm} />}

      {/* Tela de Consulta */}
      {currentView === "consultar" && (
        <div className="form-container">
          <h2>Consultar Agendamento</h2>
          <p>Aqui você pode consultar seu agendamento.</p>
          <button onClick={closeForm}>Voltar</button>
        </div>
      )}

      {/* Tela de Cancelamento */}
      {currentView === "cancelar" && (
        <div className="form-container">
          <h2>Cancelar Agendamento</h2>
          <p>Aqui você pode cancelar seu agendamento.</p>
          <button onClick={closeForm}>Voltar</button>
        </div>
      )}
    </div>
  );
};

export default App;
