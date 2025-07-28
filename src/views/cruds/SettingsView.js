import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import LayoutAdmin from '../layout/LayoutAdmin';

const SettingsView = ({ showNotification }) => {
  const [settings, setSettings] = useState({
    empresa: 'Mi Empresa S.A.',
    email: 'contacto@miempresa.com',
    moneda: 'MXN',
    mantenimiento: false
  });

  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showNotification) {
      showNotification('Configuración guardada correctamente');
    }
  };

  const mockData = {
    usuarios: [
      { idUsuario: 1, nombre: 'Admin', email: 'admin@example.com', rol: 'Administrador', estado: 'Activo' },
      { idUsuario: 2, nombre: 'Vendedor 1', email: 'vendedor1@example.com', rol: 'Vendedor', estado: 'Activo' }
    ],
    marcas: [
      { idMarca: 1, nombre: 'Toyota', logo: 'https://logo.clearbit.com/toyota.com' },
      { idMarca: 2, nombre: 'Ford', logo: 'https://logo.clearbit.com/ford.com' }
    ],
    vehiculos: [
      { idVehiculo: 1, marca: 'Toyota', modelo: 'Corolla', año: 2020, precio: 250000, estado: 'Disponible' },
      { idVehiculo: 2, marca: 'Ford', modelo: 'F-150', año: 2019, precio: 350000, estado: 'Disponible' }
    ],
    publicaciones: [
      { idPublicacion: 1, vehiculo: 'Toyota Corolla', fecha: '2023-05-15', estado: 'Activa' },
      { idPublicacion: 2, vehiculo: 'Ford F-150', fecha: '2023-05-10', estado: 'Activa' }
    ]
  };

  const generateReportPDF = () => {
    setLoadingPDF(true);

    try {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();

      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text(`Reporte General - ${settings.empresa}`, 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${date}`, 14, 28);
      doc.text(`Moneda: ${settings.moneda}`, 14, 35);

      let yPosition = 45;

      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Usuarios del Sistema', 14, yPosition);

      doc.autoTable({
        head: [['ID', 'Nombre', 'Email', 'Rol', 'Estado']],
        body: mockData.usuarios.map(user => [
          user.idUsuario, user.nombre, user.email, user.rol, user.estado
        ]),
        startY: yPosition + 10,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.text('Marcas Registradas', 14, yPosition);

      doc.autoTable({
        head: [['ID', 'Nombre', 'Logo']],
        body: mockData.marcas.map(marca => [
          marca.idMarca, marca.nombre, marca.logo ? 'Sí' : 'No'
        ]),
        startY: yPosition + 10,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.text('Vehículos Registrados', 14, yPosition);

      doc.autoTable({
        head: [['ID', 'Marca', 'Modelo', 'Año', 'Precio', 'Estado']],
        body: mockData.vehiculos.map(vehiculo => [
          vehiculo.idVehiculo,
          vehiculo.marca,
          vehiculo.modelo,
          vehiculo.año,
          `${settings.moneda} ${vehiculo.precio.toLocaleString()}`,
          vehiculo.estado
        ]),
        startY: yPosition + 10,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.text('Publicaciones Activas', 14, yPosition);

      doc.autoTable({
        head: [['ID', 'Vehículo', 'Fecha', 'Estado']],
        body: mockData.publicaciones.map(pub => [
          pub.idPublicacion, pub.vehiculo, pub.fecha, pub.estado
        ]),
        startY: yPosition + 10,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
      });

      doc.save(`reporte-general-${date.replace(/\//g, '-')}.pdf`);
      if (showNotification) {
        showNotification('Reporte generado correctamente');
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      if (showNotification) {
        showNotification('Error al generar el reporte', 'error');
      }
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <LayoutAdmin>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Configuración del Sistema</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre de la Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={settings.empresa}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email de Contacto</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Moneda</label>
                <select
                  name="moneda"
                  value={settings.moneda}
                  onChange={handleInputChange}
                  required
                >
                  <option value="MXN">Peso Mexicano (MXN)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Modo Mantenimiento</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="mantenimiento"
                    name="mantenimiento"
                    checked={settings.mantenimiento}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="mantenimiento">Activar modo mantenimiento</label>
                </div>
                <small className="hint">El sitio no será accesible para los usuarios</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>

          <div className="settings-section">
            <h4>Exportar Datos</h4>
            <p>Descarga una copia de seguridad de toda la información del sistema.</p>
            <button
              className="btn btn-secondary"
              onClick={generateReportPDF}
              disabled={loadingPDF}
            >
              {loadingPDF ? (
                <span className="pdf-generating">Generando...</span>
              ) : (
                <>
                  <Download size={18} /> Exportar Datos
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default SettingsView;