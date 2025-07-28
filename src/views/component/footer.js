import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Marca y redes */}
        <div className="footer-brand">
          <h2 className="company-names">
            <span className="text-orange">CARS</span> <span className="text-orange">GET</span>
          </h2>
          <span
            style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                fontStyle: 'italic',
                color: '#000',
            }}
            >
            FINANCIAMIENTO
            </span>

          <div className="social-links">
            <a href="#"><img src="/external/facebook138403711684-3p2o-200h.png" alt="Facebook" /></a>
            <a href="#"><img src="/external/tiktok311649111685-x576-200h.png" alt="TikTok" /></a>
            <a href="#"><img src="/external/logoinstagram1686-vfi.svg" alt="Instagram" /></a>
            <a href="#"><img src="/external/linkedin1688-y8yy.svg" alt="LinkedIn" /></a>
          </div>
        </div>

        {/* Enlaces */}
        <div className="footer-links">
          <div className="links-column">
            <h3>Compra un vehículo</h3>
            <ul>
              <li><a href="#">Paga a meses</a></li>
              <li><a href="#">Vende tu auto</a></li>
              <li><a href="#">Cuida tu auto</a></li>
              <li><a href="#">Ubicaciones</a></li>
            </ul>
          </div>
          <div className="links-column">
            <h3>Información</h3>
            <ul>
              <li><a href="#">Testimoniales</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Trabaja con nosotros</a></li>
              <li><a href="#">Contacto</a></li>
              <li><a href="#">Preguntas frecuentes</a></li>
            </ul>
          </div>
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <p>
          Copyright © 2025. Todos los derechos reservados. · Aviso de Privacidad ·
          Términos y Condiciones · Transparencia · Sitemap
        </p>
      </div>
    </footer>
  );
};

export default Footer;
