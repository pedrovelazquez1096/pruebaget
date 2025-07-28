import React, { useState, useEffect, useRef, useContext } from 'react';
import { Search, Plus, Edit, Trash2, Upload, Image, XCircle } from 'lucide-react';
import LayoutVendedor from '../layout/LayoutVendedor';
import { NotificationContext } from '../../context/NotificationContext';

const PublicacionesViewVendedor = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredPublicaciones, setFilteredPublicaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    idVehiculo: '',
    descripcion: '',
    imagenes: []
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const itemsPerPage = 10;

  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const mockVehiculos = [
      { idVehiculo: 1, modelo: 'Corolla', version: 'SE', ano: 2020, precio: 250000 },
      { idVehiculo: 2, modelo: 'F-150', version: 'Lariat', ano: 2019, precio: 350000 }
    ];
    const mockPublicaciones = [
      { idPublicacion: 1, idVehiculo: 1, descripcion: 'Corolla en excelente estado', fecha: '2023-05-15', imagenes: [] },
      { idPublicacion: 2, idVehiculo: 2, descripcion: 'Camioneta lista para trabajar', fecha: '2023-05-10', imagenes: [] }
    ];
    setVehiculos(mockVehiculos);
    setPublicaciones(mockPublicaciones);
    setFilteredPublicaciones(mockPublicaciones);
  }, []);

  useEffect(() => {
    const filtered = publicaciones.filter(pub => {
      const vehiculo = vehiculos.find(v => v.idVehiculo === pub.idVehiculo);
      const info = vehiculo ? `${vehiculo.modelo} ${vehiculo.version}`.toLowerCase() : '';
      return (
        info.includes(searchTerm.toLowerCase()) ||
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.imagenes.length + files.length > 2) {
      showNotification('Máximo 2 imágenes permitidas', 'error');
      return;
    }

    const valid = files.filter(f => {
      if (!f.type.includes('image/')) {
        showNotification(`${f.name} no es una imagen válida`, 'error');
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        showNotification(`${f.name} excede los 5MB`, 'error');
        return false;
      }
      return true;
    });

    if (valid.length === 0) return;

    setUploading(true);
    setTimeout(() => {
      const newImgs = valid.map(f => URL.createObjectURL(f));
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...newImgs].slice(0, 2)
      }));
      setUploading(false);
      showNotification('Imágenes subidas con éxito');
    }, 1500);
  };

  const removeImage = (i) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, index) => index !== i)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        setPublicaciones(publicaciones.map(p =>
          p.idPublicacion === editingId ? { ...p, ...formData } : p
        ));
        showNotification('Publicación actualizada correctamente');
      } else {
        const nueva = {
          ...formData,
          idPublicacion: publicaciones.length + 1,
          fecha: new Date().toISOString().split('T')[0]
        };
        setPublicaciones([...publicaciones, nueva]);
        showNotification('Publicación creada correctamente');
      }
      resetForm();
    } catch (err) {
      showNotification('Error al guardar publicación', 'error');
    }
  };

  const handleEdit = (pub) => {
    setFormData({
      idVehiculo: pub.idVehiculo,
      descripcion: pub.descripcion,
      imagenes: pub.imagenes || []
    });
    setEditingId(pub.idPublicacion);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar publicación?')) {
      setPublicaciones(publicaciones.filter(p => p.idPublicacion !== id));
      showNotification('Publicación eliminada correctamente');
    }
  };

  const resetForm = () => {
    setFormData({ idVehiculo: '', descripcion: '', imagenes: [] });
    setEditingId(null);
    setShowForm(false);
  };

  const getVehiculoInfo = (id) => {
    const v = vehiculos.find(v => v.idVehiculo === id);
    return v ? `${v.modelo} (${v.version}) - ${v.ano}` : 'Desconocido';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const totalPages = Math.ceil(filteredPublicaciones.length / itemsPerPage);

  return (
    <LayoutVendedor>
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
                        {v.modelo} {v.version ? `(${v.version})` : ''} - {v.ano} - {formatPrice(v.precio)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group span-2">
                  <label>Imágenes del vehículo (Máximo 2)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                  />
                  <div className="file-upload-container">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={triggerFileInput}
                      disabled={uploading || formData.imagenes.length >= 2}
                    >
                      {uploading ? (
                        'Subiendo...'
                      ) : (
                        <>
                          <Upload size={16} /> Seleccionar Imágenes
                        </>
                      )}
                    </button>
                    <small>Formatos aceptados: JPG, PNG (max 5MB cada una)</small>
                  </div>
                  
                  {formData.imagenes.length > 0 && (
                    <div className="images-preview-container">
                      <div className="images-grid">
                        {formData.imagenes.map((img, index) => (
                          <div key={index} className="image-preview-item">
                            <img 
                              src={img} 
                              alt={`Vehículo ${index + 1}`}
                              className="image-preview-thumbnail"
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                              title="Eliminar imagen"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <small>{formData.imagenes.length}/2 imágenes seleccionadas</small>
                    </div>
                  )}
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
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {editingId ? 'Actualizar Publicación' : 'Crear Publicación'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={resetForm}
                  disabled={uploading}
                >
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
                <th>Imágenes</th>
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
                    <td>
                      <div className="table-images">
                        {publicacion.imagenes.slice(0, 2).map((img, index) => (
                          <img 
                            key={index}
                            src={img} 
                            alt={`Vehículo ${index + 1}`}
                            className="table-image-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/50?text=Imagen+no+disponible';
                            }}
                          />
                        ))}
                      </div>
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
                  <td colSpan="6" className="no-results">
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
    </LayoutVendedor>
  );
};

export default PublicacionesViewVendedor;