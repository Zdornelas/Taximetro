import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import "./App.css";
import imagem from "./assets/Imeq.png";

// Função para formatar a data no formato dd/mm/yyyy
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Função para gerar os dias úteis, excluindo feriados e fins de semana
const getDiasUteis = (inicio, feriados) => {
  let diasUteis = [];
  let data = new Date(inicio);

  while (diasUteis.length < 7) {
    const diaSemana = data.getDay(); // 0 = domingo, 1 = segunda-feira, ..., 6 = sábado
    const dataFormatada = formatDate(data); // Formato dd/mm/yyyy

    const diaMes = `${data.getDate()}/${data.getMonth() + 1}`; // Apenas dia e mês

    if (diaSemana !== 0 && diaSemana !== 6 && !feriados.includes(diaMes)) {
      diasUteis.push({
        date: dataFormatada,
        dayOfWeek: data.toLocaleDateString('pt-BR', { weekday: 'long' }), // Nome do dia da semana
      });
    }
    data.setDate(data.getDate() + 1); // Avançar um dia
  }
  return diasUteis;
};

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

const AgendamentoForm = ({ closeForm }) => {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    cidade: "",
    tipoServico: "",
    servico: "",
    cpfCnpj: "",
    nome: "",
    telefone: "",
    placa: "",
    renavam: "",
    dataAtendimento: "", // Adicionado para armazenar a data de atendimento
    horarioAtendimento: "", // Adicionado para armazenar o horário de atendimento
    localAtendimento: "", // Adicionado para armazenar o local de atendimento
  });
  // Estado para controlar a visibilidade da notificação
  const [showNotification, setShowNotification] = useState(false);
  
  // Função para verificar a validade do CPF
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
    // Lista de feriados fixos no formato "dd/mm"
    const feriados = [
    "01/01", // Ano Novo
    "21/04", // Tiradentes
    "01/05", // Dia do Trabalho
    "07/09", // Independência do Brasil
    "12/10", // Nossa Senhora Aparecida
    "02/11", // Finados
    "15/11", // Proclamação da República
    "25/12", // Natal
  ];
  useEffect(() => {
    // Calcula os dias úteis a partir da data de hoje
    const hoje = new Date();
    const dias = getDiasUteis(hoje, feriados);
    setDiasUteis(dias);
  }, []); 

    const validateCpf = (cpf) => {
    // Remove caracteres não numéricos
    const cleanedCpf = cpf.replace(/\D/g, "");
    // Verifica se tem 11 dígitos
    return cleanedCpf.length === 11;
  };
  
  const validateNome = (nome) => {
    // Verifica se o nome contém números
    const regex = /\d/;
    return !regex.test(nome);
  };
  
  const validateRenavam = (renavam) => {
    // Verifica se o RENAVAM tem exatamente 9 dígitos
    return renavam.replace(/\D/g, "").length === 9;
  };
  
  const nextStep = () => {
    if (step === 1) {
      // Validação do Step 1
      if (!formData.cidade || !formData.tipoServico || !formData.servico) {
        setErrorMessage("Por favor, selecione a Cidade, Tipo de Serviço e Serviço para continuar.");
        return;
      }
    } else if (step === 2) {
      // Validação do Step 2
      if (!formData.cpfCnpj || !formData.nome || !formData.telefone || !formData.placa || !formData.renavam) {
        setErrorMessage("Preencha todos os campos para continuar.");
        return;
      }
  
      // Valida CPF
      if (!isValidCPF(formData.cpfCnpj)){
        setErrorMessage("CPF inválido.");
        return;
      }

      // Valida nome (não pode conter números)
      if (!validateNome(formData.nome)) {
        setErrorMessage("Nome inválido. O nome não pode conter números.");
        return;
      }
  
      // Valida RENAVAM
      if (!validateRenavam(formData.renavam)) {
        setErrorMessage("RENAVAM inválido. Deve conter 9 dígitos.");
        return;
      }
    } else if (step === 3) {
      // Validação do Step 3
      if (!formData.localAtendimento || !formData.dataAtendimento || !formData.horarioAtendimento) {
        setErrorMessage("Por favor, selecione Local, Data e Horário de Atendimento para continuar.");
        return;
      }
    }
    setErrorMessage(""); // Limpa a mensagem de erro ao avançar
    if (step < 4) {
      setStep(step + 1);
    }
  };

  // Função para retroceder para o passo anterior
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      closeForm(); // Se estiver no primeiro passo, volta para a tela inicial
    }
  };

  // Função para atualizar os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateCpf(value)  
    isValidCPF(value)
  };
  
   // Função para finalizar o agendamento
   const confirmAgendamento = () => {
    setStep(); // Avançar para a próxima tela (finalizar)
    setShowNotification(true); // Exibir a notificação

    // Ocultar a notificação após 3 segundos
    setTimeout(() => {
      setShowNotification(false);
      closeForm(); // Voltar à tela inicial
    }, 3000);
  };

  return (
    <div className="agendamento-container">
      <h1>Agendamento de Serviços</h1>

      {step === 1 && (
        <div className="form-step">
          <h2>1. Serviços disponíveis para agendamento</h2>
          <select name="cidade" value={formData.cidade} onChange={handleChange}>
            <option value="">Informe a Cidade</option>
            <option value="cidade1">João Pessoa</option>
          </select>
          <select name="tipoServico" value={formData.tipoServico} onChange={handleChange}>
            <option value="">Tipo de Serviço</option>
            <option value="servico1">Taximetro</option>
          </select>
          <select name="servico" value={formData.servico} onChange={handleChange}>
            <option value="">Serviço selecionado</option>
            <option value="Fiscalização de Taximetro">Fiscalização de Taximetro</option>
          </select>

          {/* Notificação de erro */}
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
              required
            >
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
              required
            />
            <label>Nome *</label>
          </div>

          <div className="input-container">
            <InputMask
              mask="(99) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(__) _____-____"
              name="telefone"
              required
            >
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
              required
            >
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
              required
            />
            <label>Renavam</label>
          </div>

          {/* Notificação de erro */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button onClick={nextStep}>PRÓXIMO</button>
        </div>
      )}

      {step === 3 && (
        <div className="form-step">
          <h2>3. Local e Data do Atendimento</h2>

          {/* Local de Atendimento */}
          <div className="input-container">
            <label>Local de Atendimento:</label>
            <select
              name="localAtendimento"
              value={formData.localAtendimento}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="IMEQ-SEDE">IMEQ SEDE - João Pessoa</option>
            </select>
          </div>

          {/* Data de Atendimento */}
          <div className="input-container">
            <label>Data de Atendimento:</label>
            <select
              name="dataAtendimento"
              value={formData.dataAtendimento}
              onChange={handleChange}
            >
              <option value=""></option>
              {diasUteis.map((dia) => (
                <option key={dia.date} value={dia.date}>
                  {`${dia.date}`}
                </option>
              ))}
            </select>
          </div>

          {/* Horários de Atendimento */}
          <div className="input-container">
            <label>Horário de Atendimento:</label>
            <select
              name="horarioAtendimento"
              value={formData.horarioAtendimento}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="1° Período - 09:00 às 09:30">
                1° Período - Horário de chegada das 09:00 às 09:30
              </option>
              <option value="2° Período - 09:30 às 10:00">
                2° Período - Horário de chegada das 09:30 às 10:00
              </option>
              <option value="3° Período - 10:00 às 10:30">
                3° Período - Horário de chegada das 10:00 às 10:30
              </option>
              <option value="4° Período - 10:30 às 11:00">
                4° Período - Horário de chegada das 10:30 às 11:00
              </option>
              <option value="5° Período - 11:00 às 11:30">
                5° Período - Horário de chegada das 11:00 às 11:30
              </option>
              <option value="6° Período - 11:30 às 12:00">
                6° Período - Horário de chegada das 11:30 às 12:00
              </option>
              <option value="7° Período - 13:00 às 13:30">
                7° Período - Horário de chegada das 13:00 às 13:30
              </option>
              <option value="8° Período - 13:30 às 14:00">
                8° Período - Horário de chegada das 13:30 às 14:00
              </option>
            </select>
          </div>

          {/* Notificação de erro */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button onClick={nextStep}>PRÓXIMO</button>
        </div>
      )}

{step === 4 && (
  <div className="form-step">
    <h2>4. Revise e confirme seu agendamento</h2>

    <div className="review-container">
      {/* Dados Pessoais */}
      <div className="review-column">
        <h3>Dados Pessoais</h3>
        <p><strong>CPF/CNPJ:</strong> {formData.cpfCnpj}</p>
        <p><strong>Nome:</strong> {formData.nome}</p>
        <p><strong>Telefone:</strong> {formData.telefone}</p>
      </div>

      {/* Serviço Selecionado */}
      <div className="review-column">
        <h3>Serviço Selecionado</h3>
        <p><strong>Serviço:</strong> {formData.servico}</p>
      </div>
    </div>
    
    <div className="review-container">
      {/* Local de Atendimento */}
      <div className="review-column">
        <h3>Local de Atendimento</h3>
        <p><strong>Local:</strong> {formData.localAtendimento}</p>
      </div>

      {/* Data e Hora Agendada */}
      <div className="review-column">
        <h3>Data e Hora Agendada</h3>
        <p><strong>Data:</strong> {formData.dataAtendimento}</p>
        <p><strong>Hora:</strong> {formData.horarioAtendimento}</p>
      </div>
      <button onClick={confirmAgendamento}>CONFIRMAR</button>
    </div>
  </div>
)}
{/* Notificação */}
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
