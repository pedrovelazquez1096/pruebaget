import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Footer from './component/footer';
import './cotizacion.css';
import HeaderPrivado from './component/headerPrivado';

const Desktop4 = () => {
  return (
    <div className="desktop4-container">
      <Helmet>
        <title>Cotización | CarsGet</title>
      </Helmet>

      <HeaderPrivado />

      {/* CONTENIDO PRINCIPAL */}
      <main className="desktop4-main">

        {/* CALCULADORA */}
        <section className="desktop4-cotiza">
          <h2 className="desktop4-subtitulo">COTIZA JUSTO AQUÍ</h2>

          <div className="desktop4-input-field">
            <label>PRECIO:</label>
            <input type="text" placeholder="$200,000" disabled />

            <label>Monto de enganche</label>
            <input type="text" placeholder="$20,000" />

            <label>Meses de plazo</label>
            <input type="text" placeholder="60 meses" />

            <button className="desktop4-button">
              CALCULA TU MENSUALIDAD
            </button>
            <Link to="/solicitud-credito">
              <button className="desktop4-button">
                SOLICITUD DE CRÉDITO
              </button>
            </Link>
          </div>

          <div className="desktop4-requisitos">
            <h3>Requisitos</h3>
            <ul>
              <li>Comprobante de ingresos</li>
              <li>Investigación socioeconómica en línea</li>
              <li>Capacidad de pagos</li>
              <li>INE, CURP, referencias personales</li>
              <li>Enganche inicial</li>
              <li>GPS inmovilizador (con contrato)</li>
              <li>Seguro vehicular y de vida</li>
            </ul>
          </div>
        </section>

        {/* GALERÍA */}
        <section className="desktop4-galeria">
          <img src="/external/ima-mazda (1).png" alt="Vista 1" />
          <img src="/external/ima-mazda (2).png" alt="Vista 2" />
          <img src="/external/ima-mazda (3).png" alt="Vista 3" />
          <img src="/external/ima-mazda (4).png" alt="Vista 4" />
        </section>

        {/* DESCRIPCIÓN */}
        <section className="desktop4-descripcion">
          <h2>Descripción del Vehículo</h2>
          <p className="desktop4-texto-descripcion">
            Perfecto para ciudad o carretera, este Mazda ofrece una experiencia de conducción cómoda, segura y con carácter. ¡Una gran opción si buscas un sedán con presencia y calidad!
          </p>

          <ul className="desktop4-especificaciones">
            <li>✔ Motor 2.5L, 4 cilindros</li>
            <li>✔ Transmisión automática</li>
            <li>✔ Combustible: gasolina</li>
            <li>✔ 4 puertas, espacioso y elegante</li>
            <li>✔ Estética moderna con acabados deportivos</li>
            <li>✔ Garantía mecánica y eléctrica</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Desktop4;