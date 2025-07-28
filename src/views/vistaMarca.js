import React from 'react';
import { useParams } from 'react-router-dom';
import Header from './component/header';
import Footer from './component/footer';

const VistaMarca = () => {
  const { nombre } = useParams();

  return (
    <>
      <Header />
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#f8791d' }}>
          Vehículos de {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
        </h1>
        <p style={{ marginTop: '20px' }}>
          Aquí puedes mostrar un catálogo filtrado o información relevante sobre la marca {nombre}.
        </p>
        {/* Aquí puedes renderizar componentes de vehículos filtrados por marca */}
      </div>
      <Footer />
    </>
  );
};

export default VistaMarca;
