import React, { useState } from "react";
import "./App.css";
import imagem from "./assets/Imeq.png";
import AgendamentoForm from "./AgendamentoForm"; 
import ConsultarAgendamento from "./ConsultarAgendamento";
import CancelarAgendamento from "./CancelarAgendamento";
import Login from "./Login"; // Importa o componente de login

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
  const handleLogoClick = () => {
    setCurrentView("");
  }
  return (
    <div>
      <header className="top-bar">
        <div className="logo-container">
          <img src={imagem} 
          alt="Logo IMEQ-PB" 
          className="top-bar-logo"
          onClick={handleLogoClick}
          />
          <span className="top-bar-title"></span>

        </div>
        <div className="top-barlogin"> {/* Corrigido de classname para className */}
          <button onClick={() => openForm("login")}>Login</button>
      </div>
      </header>
      
         {/* Formulário de Login */}
       {currentView === "login" && <Login closeForm={closeForm} />}
      
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

      {currentView === "agendar" && <AgendamentoForm closeForm={closeForm} />}
      {currentView === "consultar" && <ConsultarAgendamento closeForm={closeForm} />}
      {currentView === "cancelar" && <CancelarAgendamento closeForm={closeForm} />}
  
    </div>
  );
};

export default App;
