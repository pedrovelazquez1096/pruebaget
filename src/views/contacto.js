import React from 'react'
import { Helmet } from 'react-helmet'
import Header from './component/header';
import Footer from './component/footer';
import './contacto.css'

const Desktop5 = () => {
  return (
    <div className="desktop5-container">
      <Helmet>
        <title>Trabaja con Nosotros - CARS GET</title>
      </Helmet>

      <Header />

      {/* TÍTULO PRINCIPAL */}
      <h1 className="desktop5-text10">¿QUIERES SER PARTE DEL EQUIPO?</h1>

      {/* SECCIÓN TRABAJA CON NOSOTROS */}
      <section className="desktop5-group2147220671">
        <img src="/external/equipofeliz11481-nez-500h.png" alt="Equipo feliz" className="desktop5-equipofeliz1" />
        <div>
          <h2 className="desktop5-text39">Trabaja con nosotros</h2>
          <p className="desktop5-text38">
            Ven y conócenos en nuestros locales. Tenemos distintas oportunidades para ti:
            capacitaciones, buen ambiente laboral, horarios flexibles y beneficios especiales.
          </p>
        </div>
      </section>

      {/* SECCIÓN ESTUDIANTES */}
      <section className="desktop5-group2147220671">
        <img src="/external/estudiantesestadias11482-8szr-400w.png" alt="Estudiantes en estadía" className="desktop5-estudiantesestadias1" />
        <div>
          <h2 className="desktop5-text39">Realiza tus estadías, prácticas o servicio</h2>
          <p className="desktop5-text38">
            ¿Quieres aprender a trabajar de manera profesional? Nosotros tenemos la oportunidad para ti.
            Aprende de nosotros y nosotros de ti. Demuestra tus capacidades en el mejor ambiente laboral.
          </p>
        </div>
      </section>


      <Footer />
    </div>
  )
}

export default Desktop5
