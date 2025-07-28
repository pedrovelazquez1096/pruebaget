import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import './header.css';

const Header = () => {
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname;

  const handleLogoClick = () => {
    history.push('/');
  };

  return (
    <header className="header-main">
      <div
        className="header-logo-container"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      >
        <img
          src="/external/logo1390-enlh-200h.png"
          alt="Cars Get Financiamiento"
          className="header-logo"
        />
        <h1 className="header-company-name">
          <span>CARS</span> <span>GET</span> <br />
          <span className="header-financiamiento">
            FINANCIAMIENTO
          </span>
        </h1>
      </div>

      <nav className="header-nav-menu">
        {path !== '/catalogo' && <Link to="/catalogo" className="header-nav-link">Catálogo</Link>}
        {path !== '/contacto' && <Link to="/contacto" className="header-nav-link">Contacto</Link>}
        {path !== '/testimonios' && <Link to="/testimonios" className="header-nav-link">Testimonios</Link>}
        {path !== '/sucursales' && <Link to="/sucursales" className="header-nav-link">Sucursales</Link>}
        {path !== '/login' && <Link to="/login" className="header-primary-button">Inicia Sesión</Link>}
      </nav>
    </header>
  );
};

export default Header;
