// src/component/HeaderPrivado.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './headerPrivado.css';

const HeaderPrivado = () => {
  const history = useHistory();
  return (
    <header className="header-privado">
      <div
        className="header-privado-logo-container"
        onClick={() => history.push('/')}
        style={{ cursor: 'pointer' }}
      >
        <img src="/external/logo1390-enlh-200h.png" alt="Logo" className="header-privado-logo" />
        <h1 className="header-privado-company-name">
          <span>CARS</span> <span>GET</span><br />
          <span className="header-privado-financiamiento">FINANCIAMIENTO</span>
        </h1>
      </div>

      <nav className="header-privado-nav-menu">
        <span className="header-privado-nav-link" onClick={() => history.push('/catalogo')}>Catálogo</span>
        <span className="header-privado-nav-link" onClick={() => history.push('/contacto')}>Contacto</span>
        <span className="header-privado-nav-link" onClick={() => history.push('/testimonios')}>Testimonios</span>
        <span className="header-privado-nav-link" onClick={() => history.push('/sucursales')}>Sucursales</span>
      </nav>
    </header>
  );
};

export default HeaderPrivado;
