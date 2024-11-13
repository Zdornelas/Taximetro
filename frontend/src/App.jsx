import React from "react"
import "./App.css"
import imagem from "./assets/Imeq.png"
const  App=()=>{
  return(
    <div>
    <header className="header">
        <div className="logo">
          <img src= {imagem} />
          <span>IMEQ-PB</span>
        </div>
      </header>
    <div className="Quadrado">
      <h1>
        Agendamento de Serviços
      </h1>
      <p>
        Selecione a Opção Desejada:
      </p>
      <button>
        Agendar Serviço
      </button>
      <button>
        Consultar Agendamento
      </button>
      <button>
        Cancelar Agendamento
      </button>

    </div>
    </div>
  )
}
export default App;