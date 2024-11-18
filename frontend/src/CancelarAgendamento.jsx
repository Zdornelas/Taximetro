import React, { useState } from "react";
import InputMask from "react-input-mask";
import axios from "axios";

const ConsultarAgendamento = ({ closeForm }) => {
  const [cpf, setCpf] = useState("");
  const [agendamento, setAgendamento] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false); 
  const [notification, setNotification] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(cpf);
      const response = await axios.get(`http://localhost:3001/agendamentos/${cpf}`);

      if (response.data) {
        setAgendamento(response.data);
        setError(""); 
        setStep(2);
      }
    } catch (err) {
      setError("CPF/CNPJ não encontrado.");
    }
  };

  const handleBack = () => {
    setStep(1);
    setAgendamento(null);
  };

  const handleCancel = async () => {
    try {
      console.log(cpf);
      await axios.put(`http://localhost:3001/agendamentos/${cpf}`);
      
      setNotification("Agendamento cancelado com sucesso!"); 
      setStep(1); 
      setAgendamento(null); 
      setShowModal(false); 

      setTimeout(() => {
        setNotification("");
      }, 3000);
    } catch (err) {
      console.error("Erro ao cancelar o agendamento:", err);
      alert("Erro ao cancelar o agendamento. Tente novamente.");
    }
  };

  return (
    <div className="form-container">
      {step === 1 && (
        <>
          <h2>Consultar Agendamento</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <InputMask
                mask="999.999.999-99"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder=" "
              >
                {(inputProps) => <input {...inputProps} />}
              </InputMask>
              <label>CPF *</label>
            </div>
            <button type="submit">Consultar</button>
            <button type="button" onClick={closeForm}> Voltar</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}

      {step === 2 && agendamento && (
        <div className="agendamento-details">
          <h3>Detalhes do Agendamento</h3>
          <p><strong>Cidade:</strong> {agendamento.cidade}</p>
          <p><strong>Serviço:</strong> {agendamento.servico}</p>
          <p><strong>Nome:</strong> {agendamento.nome}</p>
          <p><strong>Telefone:</strong> {agendamento.telefone}</p>
          <p><strong>Placa:</strong>{agendamento.placa}</p>
          <p><strong>Revenam:</strong>{agendamento.renavam}</p>
          <p><strong>Local:</strong>{agendamento.localAtendimento}</p>
          <p><strong>Data:</strong>{agendamento.dataAtendimento}</p>
          <p><strong>Horario:</strong>{agendamento.horarioAtendimento}</p>
          <div>
            <button type="button" onClick={() => setShowModal(true)}>
              Cancelar
            </button>
            <button type="button" onClick={handleBack}>
              Voltar
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overley">
          <div className="modal-contont">
            <h3>Você Deseja Cancelar O Agendamento?</h3>
            <div>
              <button onClick={handleCancel}>Sim</button>
              <button onClick={() => setShowModal(false)}>Não</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default ConsultarAgendamento;
