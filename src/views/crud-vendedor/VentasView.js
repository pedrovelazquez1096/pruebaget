import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  Search, Plus, Edit, Trash2, DollarSign, Check, 
  X, Percent, Calculator, Upload, Image, XCircle 
} from 'lucide-react';
import LayoutVendedor from '../layout/LayoutVendedor';
import { NotificationContext } from '../../context/NotificationContext';

const VentasView = () => {
  const [ventas, setVentas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    idVehiculo: '',
    idCliente: '',
    fecha: new Date().toISOString().split('T')[0],
    precioVenta: '',
    enganche: '',
    plazo: 60,
    mensualidad: '',
    comision: '',
    metodoPago: 'efectivo',
    estado: 'completada',
    imagenes: []
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    const mockVehiculos = [
      { idVehiculo: 1, modelo: 'Corolla', marca: 'Toyota', precio: 250000 },
      { idVehiculo: 2, modelo: 'F-150', marca: 'Ford', precio: 350000 },
      { idVehiculo: 3, modelo: 'Versa', marca: 'Nissan', precio: 180000 }
    ];
    
    const mockClientes = [
      { idCliente: 1, nombre: 'Juan Pérez', telefono: '5551234567' },
      { idCliente: 2, nombre: 'María García', telefono: '5557654321' }
    ];
    
    const mockVentas = [
      { 
        idVenta: 1, 
        idVehiculo: 1, 
        idCliente: 1, 
        fecha: '2023-06-15', 
        precioVenta: 240000,
        enganche: 24000,
        plazo: 60,
        mensualidad: 5280,
        comision: 12000,
        metodoPago: 'efectivo',
        estado: 'completada',
        imagenes: [
          'https://example.com/corolla1.jpg',
          'https://example.com/corolla2.jpg'
        ]
      },
      { 
        idVenta: 2, 
        idVehiculo: 2, 
        idCliente: 2, 
        fecha: '2023-06-10', 
        precioVenta: 340000,
        enganche: 34000,
        plazo: 60,
        mensualidad: 7480,
        comision: 17000,
        metodoPago: 'transferencia',
        estado: 'completada',
        imagenes: [
          'https://example.com/f150.jpg'
        ]
      }
    ];
    
    setVehiculos(mockVehiculos);
    setClientes(mockClientes);
    setVentas(mockVentas);
    setFilteredVentas(mockVentas);
  }, []);

  useEffect(() => {
    const filtered = ventas.filter(venta => {
      const vehiculo = vehiculos.find(v => v.idVehiculo === venta.idVehiculo);
      const cliente = clientes.find(c => c.idCliente === venta.idCliente);
      const vehiculoInfo = vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}`.toLowerCase() : '';
      const clienteInfo = cliente ? cliente.nombre.toLowerCase() : '';
      
      return (
        vehiculoInfo.includes(searchTerm.toLowerCase()) ||
        clienteInfo.includes(searchTerm.toLowerCase()) ||
        venta.fecha.includes(searchTerm) ||
        venta.precioVenta.toString().includes(searchTerm)
      );
    });
    setFilteredVentas(filtered);
    setCurrentPage(1);
  }, [searchTerm, ventas, vehiculos, clientes]);

  const paginatedVentas = filteredVentas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVentas.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'precioVenta' && value) {
      const precio = parseFloat(value);
      const comision = Math.round(precio * 0.05);
      let enganche = Math.round(precio * 0.10);
      
      if (precio < 200000 && enganche < 20000) {
        enganche = 20000;
      }
      
      const mensualidad = Math.round(precio * 0.022);
      
      setFormData(prev => ({ 
        ...prev, 
        comision: comision,
        enganche: enganche,
        mensualidad: mensualidad
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    if (formData.imagenes.length + files.length > 2) {
      showNotification('Solo puedes subir un máximo de 2 imágenes', 'error');
      return;
    }
    
    const validFiles = files.filter(file => {
      if (!file.type.match('image.*')) {
        showNotification(`El archivo ${file.name} no es una imagen válida`, 'error');
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`La imagen ${file.name} excede el tamaño máximo de 5MB`, 'error');
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    setUploading(true);
    
    setTimeout(() => {
      const newImages = validFiles.map(file => URL.createObjectURL(file));
      
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...newImages].slice(0, 2)
      }));
      
      setUploading(false);
      showNotification('Imágenes subidas correctamente');
    }, 1500);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const calculateFinancing = () => {
    const precio = parseFloat(formData.precioVenta);
    if (!precio || isNaN(precio)) return;
    
    let enganche = Math.round(precio * 0.10);
    
    if (precio < 200000 && enganche < 20000) {
      enganche = 20000;
    }
    
    const mensualidad = Math.round(precio * 0.022);
    const comision = Math.round(precio * 0.05);
    
    setFormData(prev => ({ 
      ...prev, 
      enganche: enganche,
      mensualidad: mensualidad,
      comision: comision,
      plazo: 60
    }));
    
    showNotification('Financiamiento calculado correctamente');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        setVentas(ventas.map(v => 
          v.idVenta === editingId ? { ...v, ...formData } : v
        ));
        showNotification('Venta actualizada correctamente');
      } else {
        const newVenta = { 
          ...formData, 
          idVenta: ventas.length + 1,
          comision: formData.comision || Math.round(parseFloat(formData.precioVenta) * 0.05)
        };
        setVentas([...ventas, newVenta]);
        showNotification('Venta registrada correctamente');
      }
      resetForm();
    } catch (error) {
      showNotification('Error al guardar la venta', 'error');
    }
  };

  const handleEdit = (venta) => {
    setFormData({
      idVehiculo: venta.idVehiculo,
      idCliente: venta.idCliente,
      fecha: venta.fecha,
      precioVenta: venta.precioVenta,
      enganche: venta.enganche,
      plazo: venta.plazo,
      mensualidad: venta.mensualidad,
      comision: venta.comision,
      metodoPago: venta.metodoPago,
      estado: venta.estado,
      imagenes: [...venta.imagenes]
    });
    setEditingId(venta.idVenta);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta venta?')) {
      setVentas(ventas.filter(v => v.idVenta !== id));
      showNotification('Venta eliminada correctamente');
    }
  };

  const resetForm = () => {
    setFormData({
      idVehiculo: '',
      idCliente: '',
      fecha: new Date().toISOString().split('T')[0],
      precioVenta: '',
      enganche: '',
      plazo: 60,
      mensualidad: '',
      comision: '',
      metodoPago: 'efectivo',
      estado: 'completada',
      imagenes: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getVehiculoInfo = (idVehiculo) => {
    const vehiculo = vehiculos.find(v => v.idVehiculo === idVehiculo);
    return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'Desconocido';
  };

  const getClienteInfo = (idCliente) => {
    const cliente = clientes.find(c => c.idCliente === idCliente);
    return cliente ? cliente.nombre : 'Desconocido';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  return (
    <LayoutVendedor>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Gestión de Ventas</h3>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar ventas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={18} /> {showForm ? 'Cancelar' : 'Nueva Venta'}
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
                    onChange={(e) => {
                      const vehiculo = vehiculos.find(v => v.idVehiculo === parseInt(e.target.value));
                      if (vehiculo) {
                        setFormData(prev => ({ 
                          ...prev, 
                          idVehiculo: e.target.value,
                          precioVenta: vehiculo.precio
                        }));
                        calculateFinancing();
                      } else {
                        setFormData(prev => ({ ...prev, idVehiculo: e.target.value }));
                      }
                    }}
                    required
                  >
                    <option value="">Seleccionar vehículo</option>
                    {vehiculos.map(v => (
                      <option key={v.idVehiculo} value={v.idVehiculo}>
                        {v.marca} {v.modelo} - {formatPrice(v.precio)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    name="idCliente"
                    value={formData.idCliente}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(c => (
                      <option key={c.idCliente} value={c.idCliente}>
                        {c.nombre} - {c.telefono}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio de Venta (Libro Azul)</label>
                  <input
                    type="number"
                    name="precioVenta"
                    value={formData.precioVenta}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="form-group">
                  <label>Enganche (10% mínimo)</label>
                  <input
                    type="number"
                    name="enganche"
                    value={formData.enganche}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                  {formData.precioVenta && formData.precioVenta < 200000 && (
                    <small className="hint">Mínimo $20,000 para vehículos bajo $200,000</small>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Plazo (meses)</label>
                  <input
                    type="number"
                    name="plazo"
                    value={formData.plazo}
                    onChange={handleInputChange}
                    required
                    min="12"
                    max="60"
                    disabled
                  />
                  <small className="hint">Máximo 60 meses</small>
                </div>
                
                <div className="form-group">
                  <label>Mensualidad</label>
                  <input
                    type="number"
                    name="mensualidad"
                    value={formData.mensualidad}
                    onChange={handleInputChange}
                    required
                    min="0"
                    readOnly
                  />
                  <small className="hint">Precio × 0.022</small>
                </div>
                
                <div className="form-group">
                  <label>Comisión (5%)</label>
                  <input
                    type="number"
                    name="comision"
                    value={formData.comision}
                    onChange={handleInputChange}
                    required
                    min="0"
                    readOnly
                  />
                </div>
                
                <div className="form-group">
                  <label>Método de Pago</label>
                  <select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="financiamiento">Financiamiento</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="completada">Completada</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelada">Cancelada</option>
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
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={calculateFinancing}
                  >
                    <Calculator size={16} /> Calcular Financiamiento
                  </button>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {editingId ? 'Actualizar Venta' : 'Registrar Venta'}
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
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Enganche</th>
                <th>Mensualidad</th>
                <th>Imágenes</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVentas.length > 0 ? (
                paginatedVentas.map((venta) => (
                  <tr key={venta.idVenta}>
                    <td>{venta.idVenta}</td>
                    <td>{getVehiculoInfo(venta.idVehiculo)}</td>
                    <td>{getClienteInfo(venta.idCliente)}</td>
                    <td>{venta.fecha}</td>
                    <td>{formatPrice(venta.precioVenta)}</td>
                    <td>{formatPrice(venta.enganche)}</td>
                    <td>{formatPrice(venta.mensualidad)}</td>
                    <td>
                      <div className="table-images">
                        {venta.imagenes.slice(0, 2).map((img, index) => (
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
                    <td>
                      <span className={`badge ${
                        venta.estado === 'completada' ? 'badge-success' :
                        venta.estado === 'pendiente' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-icon btn-warning"
                        onClick={() => handleEdit(venta)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(venta.idVenta)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-results">
                    No se encontraron ventas
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

export default VentasView;