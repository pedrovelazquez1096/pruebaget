import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Edit, Trash2, Upload, Info
} from 'lucide-react';
import LayoutAdmin from '../layout/LayoutAdmin';

const ImagenesView = ({ showNotification }) => {
  const [imagenes, setImagenes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredImagenes, setFilteredImagenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    idVehiculo: '',
    urlImagen: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const mockVehiculos = [
      { idVehiculo: 1, modelo: 'Corolla', marca: 'Toyota' },
      { idVehiculo: 2, modelo: 'F-150', marca: 'Ford' }
    ];

    const mockImagenes = [
      { idImagen: 1, idVehiculo: 1, urlImagen: 'https://example.com/corolla1.jpg' },
      { idImagen: 2, idVehiculo: 1, urlImagen: 'https://example.com/corolla2.jpg' },
      { idImagen: 3, idVehiculo: 2, urlImagen: 'https://example.com/f150.jpg' }
    ];

    setVehiculos(mockVehiculos);
    setImagenes(mockImagenes);
    setFilteredImagenes(mockImagenes);
  }, []);

  useEffect(() => {
    const filtered = imagenes.filter(imagen => {
      const vehiculo = vehiculos.find(v => v.idVehiculo === imagen.idVehiculo);
      const vehiculoInfo = vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}`.toLowerCase() : '';
      return (
        vehiculoInfo.includes(searchTerm.toLowerCase()) ||
        imagen.urlImagen.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredImagenes(filtered);
    setCurrentPage(1);
  }, [searchTerm, imagenes, vehiculos]);

  const paginatedImagenes = filteredImagenes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredImagenes.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      if (showNotification) {
        showNotification('Por favor selecciona un archivo de imagen', 'error');
      }
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (showNotification) {
        showNotification('La imagen no debe exceder los 5MB', 'error');
      }
      return;
    }

    setUploading(true);

    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setFormData(prev => ({ ...prev, urlImagen: imageUrl }));
        setPreviewImage(imageUrl);
        setUploading(false);
        if (showNotification) {
          showNotification('Imagen cargada correctamente');
        }
      };
      reader.readAsDataURL(file);
    }, 1500);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        setImagenes(imagenes.map(i =>
          i.idImagen === editingId ? { ...i, ...formData } : i
        ));
        if (showNotification) {
          showNotification('Imagen actualizada correctamente');
        }
      } else {
        const newImagen = { ...formData, idImagen: imagenes.length + 1 };
        setImagenes([...imagenes, newImagen]);
        if (showNotification) {
          showNotification('Imagen creada correctamente');
        }
      }
      resetForm();
    } catch (error) {
      if (showNotification) {
        showNotification('Error al guardar la imagen', 'error');
      }
    }
  };

  const handleEdit = (imagen) => {
    setFormData({
      idVehiculo: imagen.idVehiculo,
      urlImagen: imagen.urlImagen
    });
    setPreviewImage(imagen.urlImagen);
    setEditingId(imagen.idImagen);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta imagen?')) {
      setImagenes(imagenes.filter(i => i.idImagen !== id));
      if (showNotification) {
        showNotification('Imagen eliminada correctamente');
      }
    }
  };

  const resetForm = () => {
    setFormData({ idVehiculo: '', urlImagen: '' });
    setPreviewImage(null);
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
          <h3 className="card-title">Gestión de Imágenes</h3>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar imágenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <Plus size={18} /> {showForm ? 'Cancelar' : 'Nueva Imagen'}
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

                <div className="form-group">
                  <label>Imagen</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div className="file-upload-container">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={triggerFileInput}
                      disabled={uploading}
                    >
                      {uploading ? 'Subiendo...' : <><Upload size={16} /> Seleccionar Imagen</>}
                    </button>
                    <small>Formatos aceptados: JPG, PNG, GIF (max 5MB)</small>
                  </div>

                  {(previewImage || formData.urlImagen) && (
                    <div className="image-preview">
                      <img
                        src={previewImage || formData.urlImagen}
                        alt="Vista previa"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = 'Error al cargar la imagen';
                        }}
                      />
                      {formData.urlImagen && !previewImage && (
                        <div className="image-source-info">
                          <Info size={14} /> Imagen existente
                        </div>
                      )}
                    </div>
                  )}
                  <input type="hidden" name="urlImagen" value={formData.urlImagen} />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!formData.urlImagen || uploading}
                >
                  {editingId ? 'Actualizar Imagen' : 'Crear Imagen'}
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
                <th>Imagen</th>
                <th>URL</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedImagenes.length > 0 ? (
                paginatedImagenes.map((imagen) => (
                  <tr key={imagen.idImagen}>
                    <td>{imagen.idImagen}</td>
                    <td>{getVehiculoInfo(imagen.idVehiculo)}</td>
                    <td>
                      <img
                        src={imagen.urlImagen}
                        alt={`Vehículo ${imagen.idVehiculo}`}
                        className="table-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100?text=No+disponible';
                        }}
                      />
                    </td>
                    <td className="url-cell">
                      <a href={imagen.urlImagen} target="_blank" rel="noopener noreferrer">
                        {imagen.urlImagen.length > 30
                          ? `${imagen.urlImagen.substring(0, 30)}...`
                          : imagen.urlImagen}
                      </a>
                    </td>
                    <td className="actions">
                      <button
                        className="btn-icon btn-warning"
                        onClick={() => handleEdit(imagen)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(imagen.idImagen)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">No se encontraron imágenes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Siguiente
            </button>
          </div>
        )}
      </div>
    </LayoutAdmin>
  );
};

export default ImagenesView;