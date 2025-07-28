import React, { useState, useContext } from 'react';
import { 
  Users, Package, ShoppingCart, BarChart3, 
  Settings, Menu, X, Home, Car, User, 
  Image, FileText, Tag 
} from 'lucide-react';
import LayoutAdmin from './layout/LayoutAdmin';
import { NotificationContext } from '../../context/NotificationContext';

// Importar componentes de vista
import DashboardView from './views/cruds/DashboardView';
import UsuariosView from './views/cruds/UsuariosView';
import MarcasView from './views/cruds/MarcasView';
import VehiculosView from './views/cruds/VehiculosView';
import ImagenesView from './views/cruds/ImagenesView';
import PublicacionesView from './views/cruds/PublicacionesView';
import AuditoriaView from './views/cruds/AuditoriaView';
import SettingsView from './views/cruds/SettingsView';

const AdminPanel = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const { showNotification } = useContext(NotificationContext);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'usuarios', label: 'Usuarios', icon: User },
    { id: 'marcas', label: 'Marcas', icon: Tag },
    { id: 'vehiculos', label: 'Vehículos', icon: Car },
    { id: 'imagenes', label: 'Imágenes', icon: Image },
    { id: 'publicaciones', label: 'Publicaciones', icon: FileText },
    { id: 'auditoria', label: 'Auditoría', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const renderContent = () => {
    const views = {
      dashboard: <DashboardView showNotification={showNotification} />,
      usuarios: <UsuariosView showNotification={showNotification} />,
      marcas: <MarcasView showNotification={showNotification} />,
      vehiculos: <VehiculosView showNotification={showNotification} />,
      imagenes: <ImagenesView showNotification={showNotification} />,
      publicaciones: <PublicacionesView showNotification={showNotification} />,
      auditoria: <AuditoriaView showNotification={showNotification} />,
      settings: <SettingsView showNotification={showNotification} />
    };
    return views[activeView] || <DashboardView showNotification={showNotification} />;
  };

  return (
    <LayoutAdmin>
      <div className="admin-panel">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
          <div className="sidebar-header">
            {sidebarOpen && <h1 className="sidebar-title">Admin Panel</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-toggle"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`menu-item ${activeView === item.id ? 'active' : ''}`}
                aria-current={activeView === item.id ? 'page' : undefined}
              >
                <item.icon size={20} className="menu-item-icon" />
                <span className="menu-item-text">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <header className="main-header">
            <h2>
              {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h2>
          </header>
          
          <main className="main-body">
            {loading ? (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default AdminPanel;