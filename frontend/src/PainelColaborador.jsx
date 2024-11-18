import React, { useState, useEffect } from "react";
import imagem from "./assets/Imeq.png";
import imagem2 from "./assets/Okay.jpg";
import axios from "axios";

const PainelColaborador = ({ userData, logout }) => {
  const [showModalPendentes, setShowModalPendentes] = useState(false);
  const [showModalConcluidos, setShowModalConcluidos] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [agendamentosPendentes, setAgendamentosPendentes] = useState([]);

 
  const fetchAgendamentosPendentes = () => {
    axios
      .get("http://localhost:3001/situacao/Pendente")
      .then((response) => {
        setAgendamentosPendentes(response.data); 
      })
      .catch((error) => {
        console.error("Erro ao buscar agendamentos pendentes:", error);
      });
  };

 
  const fetchAgendamentos = () => {
    axios
      .get("http://localhost:3001/situacao")
      .then((response) => {
        setAgendamentos(response.data); 
      })
      .catch((error) => {
        console.error("Erro ao buscar agendamentos:", error);
      });
  };

 
  useEffect(() => {
    fetchAgendamentosPendentes(); 
  }, []); 


  const handleAlterarSituacao = () => {
    if (selectedAgendamento) {
      const { dataAtendimento, horarioAtendimento, situacaoatual } = selectedAgendamento;

      if (!dataAtendimento || !horarioAtendimento || !situacaoatual) {
        console.error("Faltam dados no agendamento:", selectedAgendamento);
        return;
      }

      const url = `http://localhost:3001/agendamentos/${dataAtendimento}/${horarioAtendimento}/${situacaoatual}`;

      axios
        .put(url, { situacaoatual: "Concluido" })
        .then(() => {
    
          fetchAgendamentosPendentes(); 
          setShowConfirmation(false); 
        })
        .catch((error) => {
          console.error("Erro ao atualizar agendamento:", error);
        });
    } else {
      console.error("Nenhum agendamento selecionado.");
    }
  };


  const handleOpenConfirmation = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setShowConfirmation(true);
  };


  const handleFecharConfirmacao = () => {
    setShowConfirmation(false);
    setSelectedAgendamento(null);
  };

  
  const handleToggleModalPendentes = () => {
    setShowModalPendentes(!showModalPendentes);
    if (!showModalPendentes) {
      fetchAgendamentosPendentes(); 
    }
  };

 
  const handleToggleModalConcluidos = () => {
    setShowModalConcluidos(!showModalConcluidos);
    if (!showModalConcluidos) {
      fetchAgendamentos(); 
    }
  };

  return (
    <div>
      <header className="top-bar">
        <div className="logo-container">
          <img src={imagem} alt="Logo IMEQ-PB" className="top-bar-logo" />
          <span className="top-bar-title">Painel do Colaborador</span>
        </div>
        <div className="top-barlogin">
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <div className="Quadrado">
        <h1>Bem-vindo, {userData?.name || "Colaborador"}!</h1>
        <p>Aqui você pode acessar funcionalidades específicas do sistema.</p>

        <button onClick={handleToggleModalPendentes}>
          {showModalPendentes
            ? "Fechar Consulta de Agendamentos Pendentes"
            : "Consultar Agendamentos Pendentes"}
        </button>
        <button onClick={handleToggleModalConcluidos}>
          {showModalConcluidos
            ? "Fechar Consulta de Agendamentos Concluídos ou Cancelados"
            : "Consultar Agendamentos Concluídos ou Cancelados"}
        </button>
      </div>

      {showModalPendentes && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agendamentos Pendentes</h2>
            <table>
              <thead>
                <tr>
                  <th>CPF/CNPJ</th>
                  <th>Nome</th>
                  <th>Placa</th>
                  <th>Renavam</th>
                  <th>Serviço</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Local</th>
                  <th>Situação Atual</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentosPendentes
                  .filter((agendamento) => agendamento.situacaoatual === "Pendente")
                  .map((agendamento) => (
                    <tr key={agendamento.id}>
                      <td>{agendamento.cpfCnpj}</td>
                      <td>{agendamento.nome}</td>
                      <td>{agendamento.placa}</td>
                      <td>{agendamento.renavam}</td>
                      <td>{agendamento.servico}</td>
                      <td>{agendamento.dataAtendimento}</td>
                      <td>{agendamento.horarioAtendimento}</td>
                      <td>{agendamento.localAtendimento}</td>
                      <td>{agendamento.situacaoatual}</td>
                      <td style={{ display: "flex", justifyContent: "center" }}>
                        <img
                          src={imagem2}
                          alt="Alterar para Concluído"
                          onClick={() => handleOpenConfirmation(agendamento)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button onClick={handleToggleModalPendentes}>Fechar</button>
          </div>
        </div>
      )}

      {showModalConcluidos && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agendamentos Concluídos ou Cancelados</h2>
            <table>
              <thead>
                <tr>
                  <th>CPF/CNPJ</th>
                  <th>Nome</th>
                  <th>Placa</th>
                  <th>Renavam</th>
                  <th>Serviço</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Local</th>
                  <th>Situação Atual</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos
                  .filter(
                    (agendamento) =>
                      agendamento.situacaoatual === "Concluido" ||
                      agendamento.situacaoatual === "Cancelado"
                  )
                  .map((agendamento) => (
                    <tr key={agendamento.id}>
                      <td>{agendamento.cpfCnpj}</td>
                      <td>{agendamento.nome}</td>
                      <td>{agendamento.placa}</td>
                      <td>{agendamento.renavam}</td>
                      <td>{agendamento.servico}</td>
                      <td>{agendamento.dataAtendimento}</td>
                      <td>{agendamento.horarioAtendimento}</td>
                      <td>{agendamento.localAtendimento}</td>
                      <td>{agendamento.situacaoatual}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button onClick={handleToggleModalConcluidos}>Fechar</button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="modal-confirma">
          <div className="modal-confirmar modal-confirmation">
            <h2>Você tem certeza?</h2>
            <button onClick={handleAlterarSituacao}>Sim</button>
            <button onClick={handleFecharConfirmacao}>Não</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainelColaborador;
