import React, { useState } from "react";

const Login = ({ onLogin, closeForm }) => {
  const [step, setStep] = useState("login");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matricula, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login.");
        return;
      }

      onLogin(data);
    } catch (error) {
      setError("Erro ao conectar ao servidor.");
    }
  };

  const handleCpfMatriculaValidation = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/validar-cpf-matricula", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, matricula }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao validar CPF e Matrícula.");
        return;
      }

      setStep("novaSenha"); 
    } catch (error) {
      setError("Erro ao conectar ao servidor.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    if (novaSenha !== repetirSenha) {
      setError("As senhas não coincidem.");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:3001/atualizar-senha", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, novaSenha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao atualizar a senha.");
        return;
      }

      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setStep("login"); 
      }, 500);
    } catch (error) {
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {step === "login" && (
          <>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="Matricula">Matrícula</label>
                <input
                  type="text"
                  id="Matricula"
                  placeholder="Digite sua matrícula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <div className="forgot-password">
                <a href="#" onClick={() => setStep("validarCpfMatricula")}>
                  Esqueci a senha
                </a>
              </div>
              {error && <div className="error-container">{error}</div>}
              <button type="submit" className="login-button">
                Entrar
              </button>
              <button onClick={closeForm} className="close-button">Voltar</button>
            </form>
          </>
        )}

        {step === "validarCpfMatricula" && (
          <>
            <h2>Validação</h2>
            <form onSubmit={handleCpfMatriculaValidation}>
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  placeholder="Digite seu CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="matricula">Matrícula</label>
                <input
                  type="text"
                  id="matricula"
                  placeholder="Digite sua matrícula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                />
              </div>
              {error && <div className="error-container">{error}</div>}
              <button type="submit" className="login-button">
                Validar
              </button>
            </form>
            <button onClick={() => setStep("login")} className="close-button">
              Voltar
            </button>
          </>
        )}

        {step === "novaSenha" && (
          <>
            <h2>Redefinir Senha</h2>
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label htmlFor="novaSenha">Nova Senha</label>
                <input
                  type="password"
                  id="novaSenha"
                  placeholder="Digite sua nova senha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="repetirSenha">Repetir Senha</label>
                <input
                  type="password"
                  id="repetirSenha"
                  placeholder="Repita sua nova senha"
                  value={repetirSenha}
                  onChange={(e) => setRepetirSenha(e.target.value)}
                />
              </div>
              {error && <div className="error-container">{error}</div>}
              <button type="submit" className="login-button">
                Redefinir Senha
              </button>
            </form>
            <button onClick={() => setStep("login")} className="close-button">
              Voltar
            </button>
          </>
        )}
      </div>

      {showNotification && (
        <div className="notification">
          <p>Senha redefinida com sucesso!</p>
        </div>
      )}
    </div>
  );
};

export default Login;
