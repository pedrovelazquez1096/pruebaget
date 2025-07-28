import React, { useState, useEffect } from 'react';
import {
  Search, FileText as PDFIcon, UserCheck, UserX, Frown, Smile
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import LayoutAdmin from '../layout/LayoutAdmin';

const AuditoriaView = ({ showNotification }) => {
  const [asistencias, setAsistencias] = useState([]);
  const [filteredAsistencias, setFilteredAsistencias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const mockAsistencias = [
      {
        id: 1,
        empleadoId: 'EMP001',
        nombre: 'Juan Pérez',
        departamento: 'Ventas',
        fecha: '2023-11-15',
        horaEntrada: '08:05:23',
        horaSalida: '17:30:45',
        estado: 'presente'
      },
      {
        id: 2,
        empleadoId: 'EMP002',
        nombre: 'María García',
        departamento: 'TI',
        fecha: '2023-11-15',
        horaEntrada: '09:15:10',
        horaSalida: '18:45:30',
        estado: 'tardanza'
      },
      {
        id: 3,
        empleadoId: 'EMP003',
        nombre: 'Carlos López',
        departamento: 'RH',
        fecha: '2023-11-15',
        horaEntrada: null,
        horaSalida: null,
        estado: 'ausente'
      }
    ];
    setAsistencias(mockAsistencias);
    setFilteredAsistencias(mockAsistencias);
  }, []);

  useEffect(() => {
    const filtered = asistencias.filter((asistencia) =>
      asistencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asistencia.empleadoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asistencia.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asistencia.estado.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAsistencias(filtered);
    setCurrentPage(1);
  }, [searchTerm, asistencias]);

  const paginatedAsistencias = filteredAsistencias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAsistencias.length / itemsPerPage);

  const formatHora = (hora) => hora || '--:--:--';

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'presente':
        return <Smile size={16} className="text-green-500" />;
      case 'tardanza':
        return <Frown size={16} className="text-yellow-500" />;
      case 'ausente':
        return <UserX size={16} className="text-red-500" />;
      default:
        return <UserCheck size={16} />;
    }
  };

  const generatePDFReport = () => {
    setLoadingPDF(true);

    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text('Reporte de Asistencia de Empleados', 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

      const headers = [
        'ID',
        'Empleado',
        'Departamento',
        'Fecha',
        'Hora Entrada',
        'Hora Salida',
        'Estado'
      ];

      const data = filteredAsistencias.map(asistencia => [
        asistencia.empleadoId,
        asistencia.nombre,
        asistencia.departamento,
        asistencia.fecha,
        formatHora(asistencia.horaEntrada),
        formatHora(asistencia.horaSalida),
        asistencia.estado.charAt(0).toUpperCase() + asistencia.estado.slice(1)
      ]);

      doc.autoTable({
        head: [headers],
        body: data,
        startY: 40,
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 }
        }
      });

      doc.save(`reporte-asistencia-${new Date().toISOString().slice(0, 10)}.pdf`);
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
          <h3 className="card-title">Reporte de Asistencia</h3>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre, ID o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn btn-secondary"
              onClick={generatePDFReport}
              disabled={loadingPDF || filteredAsistencias.length === 0}
            >
              {loadingPDF ? (
                'Generando...'
              ) : (
                <>
                  <PDFIcon size={18} /> Exportar PDF
                </>
              )}
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID Empleado</th>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Fecha</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAsistencias.length > 0 ? (
                paginatedAsistencias.map((asistencia) => (
                  <tr key={asistencia.id}>
                    <td>{asistencia.empleadoId}</td>
                    <td>{asistencia.nombre}</td>
                    <td>{asistencia.departamento}</td>
                    <td>{asistencia.fecha}</td>
                    <td>{formatHora(asistencia.horaEntrada)}</td>
                    <td>{formatHora(asistencia.horaSalida)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(asistencia.estado)}
                        <span>
                          {asistencia.estado.charAt(0).toUpperCase() + asistencia.estado.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    No se encontraron registros de asistencia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
};

export default AuditoriaView;