import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Footer from './component/footer';
import Header from './component/header';
import './home.css';

const testimonials = [{
    id: 1,
    image: "/external/testimonialimage1409-ki5c-300h.png",
    name: "Laura - 26 años",
    text: "Después de ahorrar durante dos años, por fin compré mi primer auto. Es un modelo compacto, perfecto para moverme por la ciudad y visitar a mi familia los fines de semana. Me siento libre e independiente, y ya estoy planeando mi primer viaje por carretera.",
    advisor: "Roberto Osvaldo Orea Mesta"
  },
  {
    id: 2,
    image: "/external/testimonialimage1414-4u1d-300h.png",
    name: "Miriam - 23 años",
    text: "Soy ingeniera ambiental y desde hace tiempo quería un auto eléctrico. Finalmente lo compré, y me encanta. No solo contribuyo a cuidar el medio ambiente, sino que también ahorro mucho en gasolina. Me siento bien con mi decisión y la recomiendo a todos.",
    advisor: "José Villa Rosales"
  },
  {
    id: 3,
    image: "/external/testimonialimage1420-252-300h.png",
    name: "José - 32 años",
    text: "Hace poco cambié mi sedán por una camioneta más amplia. Tengo dos hijos y necesitábamos más espacio y comodidad para nuestros viajes. Me siento tranquilo sabiendo que ahora viajamos más seguros y cómodos. Fue una buena decisión para mi familia.",
    advisor: "Alexis Rico Herrera"
  }];

const brands = [
  { name: "Ford", logo: "/external/ford1513-6hxm-200h.png" },
  { name: "Chevrolet", logo: "/external/chevrolet1516-oqty-200h.png" },
  { name: "Bentley", logo: "/external/bentley1519-dvky-200h.png" },
  { name: "Kia", logo: "/external/kia1522-t3zc-200h.png" },
  { name: "Audi", logo: "/external/audi1525-a9ld-200h.png" },
  { name: "Suzuki", logo: "/external/suzuki11528-yf6t-200h.png" },
  { name: "Honda", logo: "/external/honda1531-0gn-200h.png" },
  { name: "BMW", logo: "/external/bmw1534-lfrd-200h.png" },
  { name: "Toyota", logo: "/external/toyota1537-8pm-200h.png" },
  { name: "Subaru", logo: "/external/subaru1540-d56o-200h.png" },
  { name: "Renault", logo: "/external/renault1543-23z-200h.png" },
  { name: "Fiat", logo: "/external/fiat1546-452g-200h.png" },
  { name: "Hyundai", logo: "/external/hyundai1549-obex-200h.png" },
  { name: "Nissan", logo: "/external/nissan1552-kn7-200h.png" },
  { name: "Seat", logo: "/external/seat1555-pqyc-200h.png" },
  { name: "Mazda", logo: "/external/mazda51558-0vco-200h.png" }];

const featuredVehicles = Array(4).fill({
  price: "$220,000",
  brand: "Mazda",
  image: "/external/dnqnp2x946744mlm84432126149052025fmazdamazda325sgr1447-4jnsf-200h.png"
});

const Desktop = () => {
  const history = useHistory();
  return (
    <div className="desktop-container">
      <Helmet>
        <title>Cars Get Financiamiento - Compra tu auto ideal</title>
        <meta name="description" content="Encuentra el auto perfecto con nuestro financiamiento flexible y tasas competitivas" />
      </Helmet>

      <Header />

      <main>
        {/* 1. Barra de búsqueda */}
        <section className="search-section">
          <h2 className="search-title">Encuentra exactamente lo que buscas</h2>
          <div className="search-container">
            <div className="search-bar1">
              <img src="/external/search24dp000000fill0wght400grad0opsz2411564-sok-200h.png" alt="Buscar" />
              <input type="text" placeholder="Busca por marca" />
              <img src="/external/xi156-w54t.svg" alt="Limpiar búsqueda" />
            </div>
            <div className="search-filters">
              <Link to="/subtipo/SUV" className="filter-button">SUV</Link>
              <Link to="/subtipo/VAN" className="filter-button">VAN</Link>
              <Link to="/subtipo/Sedán" className="filter-button">Sedán</Link>
              <Link to="/subtipo/Minivan" className="filter-button">Minivan</Link>
              <Link to="/subtipo/Pickup" className="filter-button">Pickup</Link>
            </div>
          </div>
        </section>

        {/* 2. Logos de marcas */}
        <section className="brands-section">
          <h2 className="section-title">¡DESCUBRE NUESTRO CATÁLOGO AQUÍ!</h2>
          <div className="brands-grid">
            {brands.map((brand, index) => (
              <Link to={`/marca/${brand.name.toLowerCase()}`} key={index} className="brand-card">
                <img src={brand.logo} alt={brand.name} className="brand-logo" />
              </Link>
            ))}

          </div>
        </section>

        {/* 3. Vehículos destacados */}
        <section className="featured-section">
          <h2 className="section-title">VEHÍCULOS DESTACADOS</h2>
          <div className="vehicles-grid">
            {featuredVehicles.map((vehicle, index) => (
              <div key={index} className="vehicle-card">
                <img src={vehicle.image} alt={`Vehículo ${vehicle.brand}`} />
                <p className="vehicle-brand">{vehicle.brand}</p>
                <p className="vehicle-price">{vehicle.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Testimonios */}
        <section className="testimonials-section">
          <h2 className="section-title">CONOCE LA EXPERIENCIA DE NUESTROS CLIENTES</h2>
          <div className="testimonials-carousel">
            <img src="/external/testimonialbackground1405-j3zb-1400w.png" alt="" className="testimonials-bg" />
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
                  <p className="testimonial-text">{testimonial.text}</p>
                  <p className="testimonial-advisor">Asesor que atendió: {testimonial.advisor}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Promociones */}
        <section className="promo-section">
          <div className="promo-item">
            <p>Solicitud digital con un</p>
            <h3>90% <span>de APROBACIÓN</span></h3>
          </div>
          <div className="promo-item">
            <p>Plazos forzosos</p>
            <h3>NO MANEJAMOS</h3>
          </div>
          <div className="promo-item">
            <p>Con enganches hasta del</p>
            <h3>12%</h3>
          </div>
        </section>

        {/* 7. ¿Por qué elegirnos? */}
        <section className="why-choose-us">
          <h2 className="section-title">¿POR QUÉ ELEGIRNOS?</h2>
          <div className="benefits-grid">
            <div className="benefit-card"><h3>Preparados para tu compra</h3><p>Nuestros vehículos se preparan para su entrega y darlos en su mejor estado</p></div>
            <div className="benefit-card"><h3>¿Qué opinan nuestros clientes?</h3><p>Satisfacerlos, darles seguridad y brindarles calma es nuestra máxima prioridad</p></div>
            <div className="benefit-card"><h3>Atención al cliente</h3><p>Te ofrecemos una guía de servicios fácil y rápida para ti</p></div>
            <div className="benefit-card"><h3>Sencillo</h3><p>Con nuestra asesoría, entenderás todo el proceso. Siempre estaremos atentos a ti.</p></div>
            <div className="benefit-card"><h3>Variedad</h3><p>En nuestro catálogo podrás encontrar todo tipo de vehículos.</p></div>
            <div className="benefit-card"><h3>Tú eres la prioridad</h3><p>Buscamos, mejoramos y te ofrecemos el mejor camino para ti</p></div>
            <div className="benefit-card"><h3>Ahorra tiempo y dinero</h3><p>Proceso de aprobación eficiente, veloz y eficaz.</p></div>
          </div>
        </section>
      </main>

      <Footer />



    </div>
  );
};

export default Desktop;
