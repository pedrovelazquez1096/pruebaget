import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import LayoutAdmin from '../layout/LayoutAdmin';

const MarcasView = ({ showNotification }) => {
  const [marcas, setMarcas] = useState([]);
  const [filteredMarcas, setFilteredMarcas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre_marca: '',
    enlace_imagen: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const mockMarcas = [
      { idMarca: 1, nombre_marca: 'Toyota', enlace_imagen: 'https://logo.clearbit.com/toyota.com' },
      { idMarca: 2, nombre_marca: 'Ford', enlace_imagen: 'https://logo.clearbit.com/ford.com' },
      { idMarca: 3, nombre_marca: 'Honda', enlace_imagen: 'https://logo.clearbit.com/honda.com' },
      { idMarca: 4, nombre_marca: 'Chevrolet', enlace_imagen: 'https://logo.clearbit.com/chevrolet.com' },
      { idMarca: 5, nombre_marca: 'Nissan', enlace_imagen: 'https://logo.clearbit.com/nissan.com' }
    ];
    setMarcas(mockMarcas);
    setFilteredMarcas(mockMarcas);
  }, []);

  useEffect(() => {
    const filtered = marcas.filter(marca =>
      marca.nombre_marca.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMarcas(filtered);
    setCurrentPage(1);
  }, [searchTerm, marcas]);

  const paginatedMarcas = filteredMarcas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMarcas.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        setMarcas(marcas.map(m =>
          m.idMarca === editingId ? { ...m, ...formData } : m
        ));
        if (showNotification) {
          showNotification('Marca actualizada correctamente');
        }
      } else {
        const newMarca = { ...formData, idMarca: marcas.length + 1 };
        setMarcas([...marcas, newMarca]);
        if (showNotification) {
          showNotification('Marca creada correctamente');
        }
      }
      resetForm();
    } catch (error) {
      if (showNotification) {
        showNotification('Error al guardar la marca', 'error');
      }
    }
  };

  const handleEdit = (marca) => {
    setFormData({
      nombre_marca: marca.nombre_marca,
      enlace_imagen: marca.enlace_imagen
    });
    setEditingId(marca.idMarca);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta marca?')) {
      setMarcas(marcas.filter(m => m.idMarca !== id));
      if (showNotification) {
        showNotification('Marca eliminada correctamente');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_marca: '',
      enlace_imagen: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <LayoutAdmin>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Gestión de Marcas</h3>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar marcas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={18} /> {showForm ? 'Cancelar' : 'Nueva Marca'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card-body form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre de la Marca</label>
                  <input
                    type="text"
                    name="nombre_marca"
                    value={formData.nombre_marca}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Enlace de Imagen</label>
                  <input
                    type="text"
                    name="enlace_imagen"
                    value={formData.enlace_imagen}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.enlace_imagen && (
                    <div className="image-preview">
                      <img
                        src={formData.enlace_imagen}
                        alt="Vista previa"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar Marca' : 'Crear Marca'}
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
                <th>Nombre</th>
                <th>Logo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMarcas.length > 0 ? (
                paginatedMarcas.map((marca) => (
                  <tr key={marca.idMarca}>
                    <td>{marca.idMarca}</td>
                    <td>{marca.nombre_marca}</td>
                    <td>
                      {marca.enlace_imagen ? (
                        <img
                          src={marca.enlace_imagen}
                          alt={marca.nombre_marca}
                          className="table-image"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      ) : 'No disponible'}
                    </td>
                    <td className="actions">
                      <button
                        className="btn-icon btn-warning"
                        onClick={() => handleEdit(marca)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(marca.idMarca)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">
                    No se encontraron marcas
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

export default MarcasView;