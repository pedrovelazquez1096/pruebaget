import React from 'react'
import { Helmet } from 'react-helmet'
import './sucursal.css'
import { useHistory } from 'react-router-dom';
import Header from './component/header';
import Footer from './component/footer';


const Desktop6 = () => {
  const history = useHistory();
  return (
    <div className="desktop6-container">
      <Helmet>
        <title>Sucursales - CARS GET</title>
      </Helmet>

      <Header />


      {/* TÍTULO */}
      <h1 className="desktop6-text10">NOS PUEDES ENCONTRAR EN ESTAS SUCURSALES</h1>

      {/* SUCURSAL QUERÉTARO */}
      <section className="desktop6-sucursal">
        <img src="/external/rectangle34750571513-5zoq-600h.png" alt="Sucursal Querétaro" className="desktop6-sucursal-img" />
        <div>
          <h2 className="desktop6-text40">SUCURSAL QUERÉTARO</h2>
          <p className="desktop6-text39">
            CarsGet en Querétaro, estamos abiertos desde las 10am hasta 7pm.
            Ave Universidad Pte 260 Col. El Retablo. Plaza del Árbol. Loc. B5, B6, B7.
            (55) 27 83 32 03
          </p>
        </div>
      </section>

      {/* SUCURSAL Toluca */}
      <section className="desktop6-sucursal">
        <img src="/external/sucursalguadalajara.png" alt="Sucursal Guadalajara" className="desktop6-sucursal-img" />
        <div>
          <h2 className="desktop6-text40">SUCURSAL TOLUCA, C.D. MÉXICO</h2>
          <p className="desktop6-text39">
            CarsGet en Toluca, abre de lunes a sábado de 9am a 6pm.
            Av. López Mateos Sur 1450, Plaza del Sol. Local A-12.
            Tel: (33) 16 24 78 90
          </p>
        </div>
      </section>

      {/* CTA DE CONTACTO */}
      <section
        className="desktop6-frame2147220671"
        onClick={() => history.push('/contacto')}
        style={{ cursor: 'pointer' }}
      >
        <span className="desktop6-text41">¡Contáctanos aquí!</span>
      </section>


      <Footer />
    </div>
  )
}

export default Desktop6
