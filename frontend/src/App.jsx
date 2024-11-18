import React, { useState } from "react";
import "./App.css";
import imagem from "./assets/Imeq.png";
import AgendamentoForm from "./AgendamentoForm";
import ConsultarAgendamento from "./ConsultarAgendamento";
import CancelarAgendamento from "./CancelarAgendamento";
import Login from "./Login"; 
import PainelColaborador from "./painelcolaborador";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentView, setCurrentView] = useState(""); 

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(""); 
  };

  const openForm = (view) => {
    setCurrentView(view);
  };

  const closeForm = () => {
    setCurrentView("");
  };

  const handleLogoClick = () => {
    setCurrentView("");
  };

  return (
    <div>
      {!isLoggedIn ? (

        <>
          <header className="top-bar">
            <div className="logo-container">
              <img
                src={imagem}
                alt="Logo IMEQ-PB"
                className="top-bar-logo"
                onClick={handleLogoClick}
              />
              <span className="top-bar-title"></span>
            </div>
            <div className="top-barlogin">
              <button onClick={() => openForm("login")}>Login</button>
            </div>
          </header>

          {currentView === "login" && <Login onLogin={handleLogin} closeForm={closeForm} />}
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
        </>
      ) : (
        <PainelColaborador logout={handleLogout} />
      )}
    </div>
  );
};

export default App;
