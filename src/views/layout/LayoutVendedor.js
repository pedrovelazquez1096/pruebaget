import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, DollarSign, BadgeCheck, Menu, X } from 'lucide-react';

const LayoutVendedor = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard-vendedor', label: 'Inicio', icon: Home },
    { path: '/publicaciones-vendedor', label: 'Publicaciones', icon: FileText },
    { path: '/ventas-vendedor', label: 'Ventas', icon: DollarSign },
    { path: '/financiamiento-vendedor', label: 'Financiamiento', icon: BadgeCheck },
  ];

  return (
    <div className="admin-panel fin-flex fin-h-screen">
      <div className={`sidebar ${sidebarOpen ? '' : 'collapsed'} fin-transition-all fin-duration-300`}>
        <div className="sidebar-header fin-flex fin-items-center fin-justify-between fin-p-4">
          {sidebarOpen && <h1 className="sidebar-title fin-text-lg fin-font-semibold">Panel Vendedor</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle fin-p-2 fin-rounded fin-hover:bg-gray-200">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="sidebar-nav fin-mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item fin-flex fin-items-center fin-p-2 fin-m-1 fin-rounded fin-text-gray-700 fin-hover:bg-gray-100 ${location.pathname === item.path ? 'fin-bg-blue-500 fin-text-white' : ''}`}
            >
              <item.icon size={20} className="fin-mr-2" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="main-content fin-flex-1 fin-overflow-auto">
        <header className="main-header fin-bg-white fin-p-4 fin-shadow fin-border-b">
          <h2 className="fin-text-xl fin-font-semibold">{menuItems.find(i => i.path === location.pathname)?.label || ''}</h2>
        </header>
        <main className="main-body fin-p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutVendedor;