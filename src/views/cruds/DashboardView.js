import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  User, Car, FileText, ShoppingCart,
  Plus, Edit, Check, Clock
} from 'lucide-react';
import LayoutAdmin from '../layout/LayoutAdmin';

const DashboardView = ({ showNotification }) => {
  const [stats, setStats] = useState({
    usuarios: 0,
    vehiculos: 0,
    publicaciones: 0,
    ventas: 0
  });
  const history = useHistory();

  useEffect(() => {
    // Simula carga de datos
    setTimeout(() => {
      setStats({
        usuarios: 124,
        vehiculos: 56,
        publicaciones: 89,
        ventas: 42
      });
      if (showNotification) {
        showNotification('Estadísticas cargadas correctamente');
      }
    }, 500);
  }, [showNotification]);

  const handleLogout = () => {
    history.push('/login');
  };

  return (
    <LayoutAdmin>
      <div className="dashboard-container" style={{ minHeight: '100vh', position: 'relative' }}>
        <div className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h3>Total Usuarios</h3>
              <User size={20} className="metric-icon" />
            </div>
            <p className="metric-value blue">{stats.usuarios}</p>
            <p className="metric-change positive">+12% desde el mes pasado</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>Vehículos</h3>
              <Car size={20} className="metric-icon" />
            </div>
            <p className="metric-value green">{stats.vehiculos}</p>
            <p className="metric-change positive">+5% desde el mes pasado</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>Publicaciones</h3>
              <FileText size={20} className="metric-icon" />
            </div>
            <p className="metric-value yellow">{stats.publicaciones}</p>
            <p className="metric-change negative">-2% desde el mes pasado</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3>Ventas</h3>
              <ShoppingCart size={20} className="metric-icon" />
            </div>
            <p className="metric-value purple">{stats.ventas}</p>
            <p className="metric-change positive">+8% desde el mes pasado</p>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <Plus size={16} />
              </div>
              <div className="activity-content">
                <p>Nuevo vehículo agregado: Toyota Corolla 2022</p>
                <small className="activity-time">
                  <Clock size={14} /> Hace 15 minutos
                </small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <Edit size={16} />
              </div>
              <div className="activity-content">
                <p>Usuario actualizado: Juan Pérez</p>
                <small className="activity-time">
                  <Clock size={14} /> Hace 2 horas
                </small>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <Check size={16} />
              </div>
              <div className="activity-content">
                <p>Venta completada: Ford F-150</p>
                <small className="activity-time">
                  <Clock size={14} /> Ayer a las 14:30
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
    </LayoutAdmin>
  );
};

export default DashboardView;