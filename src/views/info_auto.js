// COMPONENTE REACT CON CARRUSEL PERSONALIZADO + CAMBIO DE IMAGEN PRINCIPAL
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import './info_auto.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useHistory } from 'react-router-dom';
import Footer from './component/footer';
import HeaderPrivado from './component/headerPrivado';

const Desktop2 = () => {

  const history = useHistory();
  
  const [mainImage, setMainImage] = useState('/external/imgvehiculo1211-tt09-600h.png');
  const [thumbnails, setThumbnails] = useState([
    '/external/ima-mazda (1).png',
    '/external/ima-mazda (2).png',
    '/external/ima-mazda (3).png',
    '/external/ima-mazda (4).png',
  ]);

  const handleThumbnailClick = (index) => {
    const newThumbnails = [...thumbnails];
    const clickedImage = newThumbnails[index];
    newThumbnails[index] = mainImage;
    setMainImage(clickedImage);
    setThumbnails(newThumbnails);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 100,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="desktop2-container">
      <Helmet>
        <title>Mazda CX-3 | CARS GET</title>
      </Helmet>

     <HeaderPrivado />


      <main className="desktop2-main">
        <div className="titulo-busqueda">
          <h1>Mazda CX-3</h1>
          <div className="busqueda">
            <input type="text" placeholder="Buscar" />
            <img src="/external/searchi120-k4h9.svg" alt="Buscar" />
          </div>
        </div>

        <section className="galeria-principal">
          <div className="imagen-principal">
            <img src="/external/rectangle34750521211-zpe8-1000h.png" alt="Fondo del vehículo" />
            <img className="vehiculo" src={mainImage} alt="Principal" />
          </div>

          <div className="miniaturas">
            {thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`Vista ${index + 1}`}
                onClick={() => handleThumbnailClick(index)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </section>

        <section className="info-vehiculo">
          <h2>Descripción</h2>
          <ul>
            <li><strong>Marca:</strong> Mazda</li>
            <li><strong>Modelo:</strong> CX-3</li>
            <li><strong>Año:</strong> 2023</li>
            <li><strong>Versión:</strong> Touring</li>
            <li><strong>Transmisión:</strong> Automática</li>
            <li><strong>Kilometraje:</strong> 35,000 km</li>
            <li><strong>Combustible:</strong> Gasolina</li>
          </ul>
          <p className="precio">$200,000</p>
          <p className="descripcion-detalle">
            Perfecto para ciudad o carretera, este Mazda ofrece una experiencia de conducción cómoda, segura y con carácter. ¡Una gran opción si buscas un sedán con presencia y calidad!
          </p>
          <button className="cotiza-btn" onClick={() => history.push('/cotizacion')}>
            ¡COTIZA AHORA!
          </button>
        </section>

        <section className="otros-vehiculos">
          <h2>OTROS VEHÍCULOS</h2>
          <Slider {...sliderSettings} className="galeria-otros">
            <div><img className="vehiculo-slide" src="/external/image4352406169413463841270221217-6jud-200h.png" alt="Vehículo 1" /></div>
            <div><img className="vehiculo-slide" src="/external/image4617720172616632470365731217-mn-200h.png" alt="Vehículo 2" /></div>
            <div><img className="vehiculo-slide" src="/external/image4518135170093701314899821217-qnc4-200h.png" alt="Vehículo 3" /></div>
            <div><img className="vehiculo-slide" src="/external/image4658051174602598128997031218-zry-200h.png" alt="Vehículo 4" /></div>
          </Slider>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Desktop2;
