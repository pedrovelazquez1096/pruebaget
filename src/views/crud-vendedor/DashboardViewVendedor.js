import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Car, FileText, DollarSign, Check, Clock } from 'lucide-react';
import LayoutVendedor from '../layout/LayoutVendedor';

const DashboardViewVendedor = () => {
  const [stats, setStats] = useState({
    vehiculos: 0,
    publicaciones: 0,
    ventas: 0,
    comisiones: 0
  });
  const history = useHistory();

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        vehiculos: 12,
        publicaciones: 8,
        ventas: 3,
        comisiones: 12500
      });
    }, 500);
  }, []);

  const handleLogout = () => {
    history.push('/login');
  };

  return (
    <LayoutVendedor>
      <div className="dashboard-container" style={{ minHeight: '100vh', position: 'relative' }}>
        <div className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h3>Mis Vehículos</h3>
              <Car size={20} className="metric-icon" />
            </div>
            <p className="metric-value blue">{stats.vehiculos}</p>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <h3>Publicaciones</h3>
              <FileText size={20} className="metric-icon" />
            </div>
            <p className="metric-value green">{stats.publicaciones}</p>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <h3>Ventas</h3>
              <DollarSign size={20} className="metric-icon" />
            </div>
            <p className="metric-value yellow">{stats.ventas}</p>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <h3>Comisiones</h3>
              <DollarSign size={20} className="metric-icon" />
            </div>
            <p className="metric-value purple">${stats.comisiones.toLocaleString()}</p>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <Check size={16} />
              </div>
              <div className="activity-content">
                <p>Venta completada: Toyota Corolla 2020</p>
                <small className="activity-time">
                  <Clock size={14} /> Hoy a las 11:30
                </small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <FileText size={16} />
              </div>
              <div className="activity-content">
                <p>Nueva publicación creada: Ford F-150 2019</p>
                <small className="activity-time">
                  <Clock size={14} /> Ayer a las 16:45
                </small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <Car size={16} />
              </div>
              <div className="activity-content">
                <p>Vehículo agregado: Honda Civic 2021</p>
                <small className="activity-time">
                  <Clock size={14} /> 2 días atrás
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de cerrar sesión al fondo */}
        <div className="logout-section">
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </LayoutVendedor>
  );
};

export default DashboardViewVendedor;