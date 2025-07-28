import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, FileText, DollarSign, BadgeCheck, Menu, X 
} from 'lucide-react';

const VendedorPanel = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard-vendedor', label: 'Inicio', icon: Home },
    { path: '/publicaciones-vendedor', label: 'Publicaciones', icon: FileText },
    { path: '/ventas-vendedor', label: 'Ventas', icon: DollarSign },
    { path: '/financiamiento-vendedor', label: 'Financiamiento', icon: BadgeCheck },
  ];

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h1 className="sidebar-title">Panel Vendedor</h1>}
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
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} className="menu-item-icon" />
              {sidebarOpen && <span className="menu-item-text">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <header className="main-header">
          <h2>
            {menuItems.find((item) => item.path === location.pathname)?.label || 'Vista'}
          </h2>
        </header>

        <main className="main-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default VendedorPanel;
