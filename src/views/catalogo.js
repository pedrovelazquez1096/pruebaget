import React from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './component/header';
import Footer from './component/footer';
import './catalogo.css';

const Desktop1 = () => {
  const history = useHistory();


  const colores = ['Rojo', 'Azul', 'Blanco', 'Negro', 'Gris'];
  const años = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];


  return (
    <div className="desktop1-container">
      <Helmet>
        <title>Catálogo de Vehículos</title>
      </Helmet>

      <Header />

      <div className="search-bar">
        <span>Buscar</span>
        <img src="/external/searchi113-4ayv.svg" alt="Buscar" />
      </div>

      <div className="desktop1-desktop">
        <aside className="filtro">
          <div>
            <h3>Marca</h3>
            <div className="marcas">
              {[
                { name: "ford", img: "/external/ford1513-6hxm-200h.png" },
                { name: "chevrolet", img: "/external/chevrolet1516-oqty-200h.png" },
                { name: "bentley", img: "/external/bentley1519-dvky-200h.png" },
                { name: "suzuki", img: "/external/suzuki11528-yf6t-200h.png" },
                { name: "kia", img: "/external/kia1522-t3zc-200h.png" },
                { name: "audi", img: "/external/audi1525-a9ld-200h.png" },
                { name: "honda", img: "/external/honda1531-0gn-200h.png" },
                { name: "bmw", img: "/external/bmw1534-lfrd-200h.png" },
                { name: "toyota", img: "/external/toyota1537-8pm-200h.png" },
                { name: "seat", img: "/external/seat1555-pqyc-200h.png" },
                { name: "subaru", img: "/external/subaru1540-d56o-200h.png" },
                { name: "renault", img: "/external/renault1543-23z-200h.png" },
                { name: "fiat", img: "/external/fiat1546-452g-200h.png" },
                { name: "hyundai", img: "/external/hyundai1549-obex-200h.png" },
                { name: "nissan", img: "/external/nissan1552-kn7-200h.png" },
                { name: "mazda", img: "/external/mazda51558-0vco-200h.png" },
              ].map((brand, i) => (
                <Link to={`/marca/${brand.name}`} key={i} className="marca-card">
                  <img src={brand.img} alt={brand.name} />
                </Link>
              ))}
            </div>


          </div>

          <div>
            <h3>Color</h3>
            <div className="colores">
              <label className="checkbox">
                <input type="checkbox" name="color" value="Rojo" />
                <span>Rojo</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="color" value="Azul" />
                <span>Azul</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="color" value="Blanco" />
                <span>Blanco</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="color" value="Negro" />
                <span>Negro</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="color" value="Gris" />
                <span>Gris</span>
              </label>
            </div>
          </div>


          <div>
            <h3>Año</h3>
            <div className="años">
              <label className="checkbox">
                <input type="checkbox" name="año" value="2025" />
                <span>2025</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="año" value="2024" />
                <span>2024</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="año" value="2023" />
                <span>2023</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="año" value="2022" />
                <span>2022</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="año" value="2021" />
                <span>2021</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="año" value="2020" />
                <span>2020</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="año" value="2019" />
                <span>2019</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="año" value="2018" />
                <span>2018</span>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="año" value="2017" />
                <span>2017</span>
              </label>
            </div>
          </div>

        </aside>

        <section className="catalogo">
           <div className="producto">
            <img src="/external/auto1.png" alt="Toyota" className="auto" />
            <span className="marca">Toyota</span>
            <span className="precio">$15,000</span>
            <button className="mas-info" onClick={() => history.push('/info-auto')}>
              Más información
            </button>

          </div>


          <div className="producto">
            <img src="/external/auto1.png" alt="Toyota" className="auto" />
            <span className="marca">Toyota</span>
            <span className="precio">$15,000</span>
            <button className="mas-info" onClick={() => navigate('/info-auto')}>
              Más información
            </button>
          </div>


          <div className="producto">
            <img src="/external/auto1.png" alt="Toyota" className="auto" />
            <span className="marca">Toyota</span>
            <span className="precio">$15,000</span>
            <button className="mas-info" onClick={() => navigate('/info-auto')}>
              Más información
            </button>
          </div>

          <div className="producto">
            <img src="/external/auto1.png" alt="Toyota" className="auto" />
            <span className="marca">Toyota</span>
            <span className="precio">$15,000</span>
            <button className="mas-info" onClick={() => navigate('/info-auto')}>
              Más información
            </button>
          </div>

          <div className="producto">
            <img src="/external/auto1.png" alt="Toyota" className="auto" />
            <span className="marca">Toyota</span>
            <span className="precio">$15,000</span>
            <button className="mas-info" onClick={() => navigate('/info-auto')}>
              Más información
            </button>
          </div>

          <div className="producto">
            <img src="/external/auto1.png" alt="Toyota" className="auto" />
            <span className="marca">Toyota</span>
            <span className="precio">$15,000</span>
            <button className="mas-info" onClick={() => navigate('/info-auto')}>
              Más información
            </button>
          </div>

          <div className="producto">
            <img src="/external/auto1.png" alt="Toyota" className="auto" />
            <span className="marca">Toyota</span>
            <span className="precio">$15,000</span>
            <button className="mas-info" onClick={() => navigate('/info-auto')}>
              Más información
            </button>
          </div>

          <div className="producto">
            <img src="/external/auto1.png" alt="Toyota" className="auto" />
            <span className="marca">Toyota</span>
            <span className="precio">$15,000</span>
            <button className="mas-info" onClick={() => navigate('/info-auto')}>
              Más información
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Desktop1;
