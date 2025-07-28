import React from 'react';
import { Helmet } from 'react-helmet';
import './testimonios.css';
import Header from './component/header';
import Footer from './component/footer';

const testimonios = [
  {
    nombre: 'Luis Martínez',
    comentario: 'Comprar mi auto con CARS GET fue rápido y sencillo. El financiamiento me permitió adquirir el coche que necesitaba sin complicaciones.',
    ciudad: 'Guadalajara, Jalisco',
  },
  {
    nombre: 'Ana López',
    comentario: 'Excelente atención al cliente. Me guiaron durante todo el proceso y ahora disfruto de mi auto nuevo.',
    ciudad: 'Monterrey, Nuevo León',
  },
  {
    nombre: 'Carlos Ramírez',
    comentario: 'Los plazos y opciones de pago se ajustaron perfectamente a mis necesidades. Muy recomendado.',
    ciudad: 'CDMX',
  },
];

const Testimonios = () => {
  return (
    <div className="testimonios-page">
      <Helmet>
        <title>Testimonios | CARS GET</title>
      </Helmet>

      <Header />

      <main className="testimonios-main">
        <h2 className="testimonios-title">Testimonios</h2>

        <div className="testimonios-grid">
          {testimonios.map((testimonio, index) => (
            <div key={index} className="testimonio-item">
              <p className="testimonio-comentario">"{testimonio.comentario}"</p>
              <p className="testimonio-nombre">- {testimonio.nombre}</p>
              <p className="testimonio-ciudad">{testimonio.ciudad}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Testimonios;
