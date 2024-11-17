import React from "react";

const Login = ({ closeForm }) => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input type="text" id="username" placeholder="Digite seu usuário" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="Digite sua senha" />
          </div>
          <div className="forgot-password">
          <a href="#">Esqueci a senha</a>
        </div>
          <button type="submit" className="login-button">Entrar</button>
        </form>
        <button onClick={closeForm} className="close-button">Voltar</button>
      </div>
    </div>
  );
};

export default Login;
