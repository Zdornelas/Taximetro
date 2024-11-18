import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import axios from 'axios';
import "./App.css";

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getDiasUteis = (inicio, feriados) => {
  let diasUteis = [];
  let data = new Date(inicio);

  while (diasUteis.length < 7) {
    const diaSemana = data.getDay();
    const dataFormatada = formatDate(data);

    const diaMes = `${data.getDate()}/${data.getMonth() + 1}`;

    if (diaSemana !== 0 && diaSemana !== 6 && !feriados.includes(diaMes)) {
      diasUteis.push({
        date: dataFormatada,
        dayOfWeek: data.toLocaleDateString('pt-BR', { weekday: 'long' }),
      });
    }
    data.setDate(data.getDate() + 1); 
  }
  return diasUteis;
};

const AgendamentoForm = ({ closeForm }) => {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    cidade: "",
    servico: "",
    cpfCnpj: "",
    nome: "",
    telefone: "",
    placa: "",
    renavam: "",
    dataAtendimento: "", 
    horarioAtendimento: "", 
    localAtendimento: "", 
  });
  const formDataComDataConvertida = {
    ...formData,
    dataAtendimento: converterData(formData.dataAtendimento),
  };
  const enviarAgendamento = () => {
    fetch('http://localhost:3001/agendamentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataComDataConvertida), 
    })
      .then((response) => {
        if (response.ok) { 
          setTimeout(() => {
            setShowNotification(false);
            closeForm(); 
          }, 1000);
        } else {
          throw new Error('Erro ao enviar dados');
        }
      })
      .catch((error) => {
        console.error('Erro:', error);
        setErrorMessage('Erro ao confirmar o agendamento.');
      });
  };

  const [showNotification, setShowNotification] = useState(false);
     const isValidCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0, remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  };
    
    const [diasUteis, setDiasUteis] = useState([]);
    const feriados = [
    "01/01","21/04","01/05","07/09","12/10","02/11", "15/11","25/12",
  ];
  function converterData(data) {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  }
  useEffect(() => {
    const hoje = new Date();
    const dias = getDiasUteis(hoje, feriados);
    setDiasUteis(dias);
  
    if (formData.dataAtendimento) {
      console.log(formData.dataAtendimento);
              const dataConvertida = converterData(formData.dataAtendimento);
      console.log(dataConvertida);
      axios.get(`http://localhost:3001/horarios-disponiveis?dataAtendimento=${dataConvertida}`)
        .then(response => {
          const horariosOcupados = response.data;
          console.log(horariosOcupados);
          const todosHorarios = [
            "1° Período - 09:00 às 09:30",
            "2° Período - 09:30 às 10:00",
            "3° Período - 10:00 às 10:30",
            "4° Período - 10:30 às 11:00",
            "5° Período - 11:00 às 11:30",
            "6° Período - 11:30 às 12:00",
            "7° Período - 13:00 às 13:30",
            "8° Período - 13:30 às 14:00"
          ];
          const horariosDisponiveis = todosHorarios.filter(horario => !horariosOcupados.includes(horario));
          setFormData({ ...formData, horariosDisponiveis }); 
        })
        .catch(err => {
          console.error('Erro ao buscar horários ocupados:', err);
        });
    }
  }, [formData.dataAtendimento]); 
    const validateCpf = (cpf) => {
    const cleanedCpf = cpf.replace(/\D/g, "");
    return cleanedCpf.length === 11;
  };
  const validateNome = (nome) => {
    const regex = /\d/;
    return !regex.test(nome);
  };
  const validateRenavam = (renavam) => {
    return renavam.replace(/\D/g, "").length === 9;
  };
  const nextStep = () => {
    if (step === 1) {
      if (!formData.cidade ||!formData.servico) {
        setErrorMessage("Por favor, selecione a Cidade, Tipo de Serviço e Serviço para continuar.");
        return;
      }
    } else if (step === 2) {
      if (!formData.cpfCnpj || !formData.nome || !formData.telefone || !formData.placa || !formData.renavam) {
        setErrorMessage("Preencha todos os campos para continuar.");
        return;
      }
       if (!isValidCPF(formData.cpfCnpj)){
        setErrorMessage("CPF inválido.");
        return;
      }
      if (!validateNome(formData.nome)) {
        setErrorMessage("Nome inválido. O nome não pode conter números.");
        return;
      }
      if (!validateRenavam(formData.renavam)) {
        setErrorMessage("RENAVAM inválido. Deve conter 9 dígitos.");
        return;
      }
    } else if (step === 3) {
      if (!formData.localAtendimento || !formData.dataAtendimento || !formData.horarioAtendimento) {
        setErrorMessage("Por favor, selecione Local, Data e Horário de Atendimento para continuar.");
        return;
      }
    }
    setErrorMessage(""); 
    if (step < 4) {
      setStep(step + 1);
    }
  };
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      closeForm(); 
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateCpf(value)  
    isValidCPF(value)
  };
   const confirmAgendamento = () => {
    setStep(); 
    setShowNotification(true); 
    setTimeout(() => {
      setShowNotification(false);
      console.log(formData);
      enviarAgendamento();
    }, 1000);
  };
  return (
    <div className="agendamento-container">
      <h1>Agendamento de Serviços</h1>
      {step === 1 && (
        <div className="form-step">
          <h2>1. Serviços disponíveis para agendamento</h2>
          <select name="cidade" value={formData.cidade} onChange={handleChange}>
            <option value="">Informe a Cidade</option>
            <option value="João Pessoa">João Pessoa</option>
          </select>
           <select name="servico" value={formData.servico} onChange={handleChange}>
            <option value="">Serviço selecionado</option>
            <option value="Fiscalização de Taximetro">Fiscalização de Taximetro</option>
          </select>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button onClick={nextStep}>PRÓXIMO</button>
        </div>
      )}
      {step === 2 && (
        <div className="form-step">
          <h2>2. Digite seus dados</h2>
          <div className="input-container">
            <InputMask
              mask="999.999.999-99"
              value={formData.cpfCnpj}
              onChange={handleChange}
              placeholder="___.___.___-__"
              name="cpfCnpj"
              required>
              {(inputProps) => <input {...inputProps} />}
            </InputMask>
            <label>CPF/CNPJ *</label>
          </div>
          <div className="input-container">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome *"
              required/>
            <label>Nome *</label>
          </div>
          <div className="input-container">
            <InputMask
              mask="(99) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(__) _____-____"
              name="telefone"
              required>
              {(inputProps) => <input {...inputProps} />}
            </InputMask>
            <label>Telefone</label>
          </div>
          <div className="input-container">
            <InputMask
              mask="aaa-9999"
              value={formData.placa}
              onChange={handleChange}
              placeholder="___-____"
              name="placa"
              required>
              {(inputProps) => <input {...inputProps} />}
            </InputMask>
            <label>Placa</label>
          </div>
          <div className="input-container">
            <input
              type="text"
              name="renavam"
              value={formData.renavam}
              onChange={handleChange}
              placeholder="Renavam"
              required/>
            <label>Renavam</label>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button onClick={nextStep}>PRÓXIMO</button>
        </div>
      )}
      {step === 3 && (
        <div className="form-step">
          <h2>3. Local e Data do Atendimento</h2>
          <div className="input-container">
            <label>Local de Atendimento:</label>
            <select
              name="localAtendimento"
              value={formData.localAtendimento}
              onChange={handleChange}>
              <option value=""></option>
              <option value="IMEQ-SEDE">IMEQ SEDE - João Pessoa</option>
            </select>
          </div>
          <div className="input-container">
            <label>Data de Atendimento:</label>
            <select
              name="dataAtendimento"
              value={formData.dataAtendimento}
              onChange={handleChange}>
              <option value=""></option>
              {diasUteis.map((dia) => (
                <option key={dia.date} value={dia.date}>
                  {`${dia.date}`}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
             <label>Horário de Atendimento:</label>
            <select
              name="horarioAtendimento"
              value={formData.horarioAtendimento}
              onChange={handleChange}>
              <option value=""></option>
              {formData.horariosDisponiveis && formData.horariosDisponiveis.map((horario, index) => (
                <option key={index} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button onClick={nextStep}>PRÓXIMO</button>
        </div>
      )}
{step === 4 && (
  <div className="form-step">
    <h2>4. Revise e confirme seu agendamento</h2>

    <div className="review-container">
      <div className="review-column">
        <h3>Dados Pessoais</h3>
        <p><strong>CPF/CNPJ:</strong> {formData.cpfCnpj}</p>
        <p><strong>Nome:</strong> {formData.nome}</p>
        <p><strong>Telefone:</strong> {formData.telefone}</p>
      </div>
      <div className="review-column">
        <h3>Serviço Selecionado</h3>
        <p><strong>Serviço:</strong> {formData.servico}</p>
      </div>
    </div>
    <div className="review-container">
      <div className="review-column">
        <h3>Local de Atendimento</h3>
        <p><strong>Local:</strong> {formData.localAtendimento}</p>
      </div>
      <div className="review-column">
        <h3>Data e Hora Agendada</h3>
        <p><strong>Data:</strong> {formData.dataAtendimento}</p>
        <p><strong>Hora:</strong> {formData.horarioAtendimento}</p>
      </div>
      <button id="confirmarbuttom" onClick={confirmAgendamento}>CONFIRMAR</button>   
    </div>
  </div>
)}
{showNotification && (
        <div className="notification">
          <p>Agendamento confirmado!</p>
        </div>
      )}
        <div className="footer-buttons">       
        <button onClick={prevStep}>VOLTAR</button>
      </div>
        </div>
  );
};
export default AgendamentoForm;