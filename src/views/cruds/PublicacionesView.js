import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import LayoutAdmin from '../layout/LayoutAdmin';

const PublicacionesView = ({ showNotification }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredPublicaciones, setFilteredPublicaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    idVehiculo: '',
    descripcion: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const mockVehiculos = [
      { idVehiculo: 1, modelo: 'Corolla', marca: 'Toyota' },
      { idVehiculo: 2, modelo: 'F-150', marca: 'Ford' }
    ];

    const mockPublicaciones = [
      {
        idPublicacion: 1,
        idVehiculo: 1,
        descripcion: 'Excelente estado, único dueño, mantenimiento al día',
        fecha: '2023-05-15'
      },
      {
        idPublicacion: 2,
        idVehiculo: 2,
        descripcion: 'Truck en perfectas condiciones, lista para trabajar',
        fecha: '2023-05-10'
      }
    ];

    setVehiculos(mockVehiculos);
    setPublicaciones(mockPublicaciones);
    setFilteredPublicaciones(mockPublicaciones);
  }, []);

  useEffect(() => {
    const filtered = publicaciones.filter(pub => {
      const vehiculo = vehiculos.find(v => v.idVehiculo === pub.idVehiculo);
      const vehiculoInfo = vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}`.toLowerCase() : '';
      return (
        vehiculoInfo.includes(searchTerm.toLowerCase()) ||
        pub.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredPublicaciones(filtered);
    setCurrentPage(1);
  }, [searchTerm, publicaciones, vehiculos]);

  const paginatedPublicaciones = filteredPublicaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPublicaciones.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        setPublicaciones(publicaciones.map(p =>
          p.idPublicacion === editingId ? { ...p, ...formData } : p
        ));
        if (showNotification) {
          showNotification('Publicación actualizada correctamente');
        }
      } else {
        const newPublicacion = {
          ...formData,
          idPublicacion: publicaciones.length + 1,
          fecha: new Date().toISOString().split('T')[0]
        };
        setPublicaciones([...publicaciones, newPublicacion]);
        if (showNotification) {
          showNotification('Publicación creada correctamente');
        }
      }
      resetForm();
    } catch (error) {
      if (showNotification) {
        showNotification('Error al guardar la publicación', 'error');
      }
    }
  };

  const handleEdit = (publicacion) => {
    setFormData({
      idVehiculo: publicacion.idVehiculo,
      descripcion: publicacion.descripcion
    });
    setEditingId(publicacion.idPublicacion);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      setPublicaciones(publicaciones.filter(p => p.idPublicacion !== id));
      if (showNotification) {
        showNotification('Publicación eliminada correctamente');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idVehiculo: '',
      descripcion: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getVehiculoInfo = (idVehiculo) => {
    const vehiculo = vehiculos.find(v => v.idVehiculo === idVehiculo);
    return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'Desconocido';
  };

  return (
    <LayoutAdmin>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Gestión de Publicaciones</h3>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar publicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={18} /> {showForm ? 'Cancelar' : 'Nueva Publicación'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card-body form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Vehículo</label>
                  <select
                    name="idVehiculo"
                    value={formData.idVehiculo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar vehículo</option>
                    {vehiculos.map(v => (
                      <option key={v.idVehiculo} value={v.idVehiculo}>
                        {v.marca} {v.modelo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group span-2">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    rows="5"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar Publicación' : 'Crear Publicación'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehículo</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPublicaciones.length > 0 ? (
                paginatedPublicaciones.map((publicacion) => (
                  <tr key={publicacion.idPublicacion}>
                    <td>{publicacion.idPublicacion}</td>
                    <td>{getVehiculoInfo(publicacion.idVehiculo)}</td>
                    <td>
                      {publicacion.descripcion.length > 50
                        ? `${publicacion.descripcion.substring(0, 50)}...`
                        : publicacion.descripcion}
                    </td>
                    <td>{publicacion.fecha}</td>
                    <td className="actions">
                      <button
                        className="btn-icon btn-warning"
                        onClick={() => handleEdit(publicacion)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(publicacion.idPublicacion)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">
                    No se encontraron publicaciones
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

export default PublicacionesView;