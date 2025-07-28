// src/views/SubtipoVista.js
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from './component/header';
import Footer from './component/footer';

const SubtipoVista = () => {
  const { tipo } = useParams(); // obtiene el subtipo desde la URL

  return (
    <>
      <Header />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Vehículos tipo: {tipo}</h2>
        {/* Aquí puedes filtrar y mostrar los autos según el tipo */}
        <p>Aquí se mostrarán todos los vehículos del tipo <strong>{tipo}</strong>.</p>
      </main>
      <Footer />
    </>
  );
};

export default SubtipoVista;
