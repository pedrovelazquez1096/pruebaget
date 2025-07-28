import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import LayoutVendedor from '../layout/LayoutVendedor';

const VehiculosViewVendedor = ({ showNotification }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    idVendedor: '',
    idMarca: '',
    modelo: '',
    version: '',
    ano: '',
    kilometraje: '',
    precio: '',
    caracteristicas: '',
    descripcion: '',
    estado: 'disponible',
    tipoCombustible: '',
    transmision: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simular carga de datos
    const mockMarcas = [
      { idMarca: 1, nombre_marca: 'Toyota' },
      { idMarca: 2, nombre_marca: 'Ford' },
      { idMarca: 3, nombre_marca: 'Honda' }
    ];
    
    const mockVendedores = [
      { idUsuario: 2, nombre: 'Vendedor 1' },
      { idUsuario: 3, nombre: 'Vendedor 2' }
    ];
    
    const mockVehiculos = [
      { 
        idVehiculo: 1, 
        idVendedor: 2, 
        idMarca: 1, 
        modelo: 'Corolla', 
        version: 'SE', 
        ano: 2020, 
        kilometraje: 25000, 
        precio: 25000.00, 
        estado: 'disponible', 
        tipoCombustible: 'Gasolina', 
        transmision: 'Automática',
        caracteristicas: 'Aire acondicionado, Bluetooth, Cámara de reversa',
        descripcion: 'Excelente estado, único dueño'
      },
      { 
        idVehiculo: 2, 
        idVendedor: 3, 
        idMarca: 2, 
        modelo: 'F-150', 
        version: 'Lariat', 
        ano: 2019, 
        kilometraje: 45000, 
        precio: 35000.00, 
        estado: 'disponible', 
        tipoCombustible: 'Diésel', 
        transmision: 'Automática',
        caracteristicas: '4x4, Asientos de cuero, Sistema de navegación',
        descripcion: 'Truck en perfectas condiciones'
      }
    ];
    
    setMarcas(mockMarcas);
    setVendedores(mockVendedores);
    setVehiculos(mockVehiculos);
    setFilteredVehiculos(mockVehiculos);
  }, []);

  useEffect(() => {
    const filtered = vehiculos.filter(vehiculo => {
      const marca = marcas.find(m => m.idMarca === vehiculo.idMarca);
      const marcaNombre = marca ? marca.nombre_marca.toLowerCase() : '';
      return (
        marcaNombre.includes(searchTerm.toLowerCase()) ||
        vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehiculo.ano.toString().includes(searchTerm)
      );
    });
    setFilteredVehiculos(filtered);
    setCurrentPage(1);
  }, [searchTerm, vehiculos, marcas]);

  const paginatedVehiculos = filteredVehiculos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVehiculos.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        setVehiculos(vehiculos.map(v => 
          v.idVehiculo === editingId ? { ...v, ...formData } : v
        ));
        showNotification('Vehículo actualizado correctamente');
      } else {
        const newVehiculo = { ...formData, idVehiculo: vehiculos.length + 1 };
        setVehiculos([...vehiculos, newVehiculo]);
        showNotification('Vehículo creado correctamente');
      }
      resetForm();
    } catch (error) {
      showNotification('Error al guardar el vehículo', 'error');
    }
  };

  const handleEdit = (vehiculo) => {
    setFormData({
      idVendedor: vehiculo.idVendedor,
      idMarca: vehiculo.idMarca,
      modelo: vehiculo.modelo,
      version: vehiculo.version,
      ano: vehiculo.ano,
      kilometraje: vehiculo.kilometraje,
      precio: vehiculo.precio,
      caracteristicas: vehiculo.caracteristicas || '',
      descripcion: vehiculo.descripcion || '',
      estado: vehiculo.estado,
      tipoCombustible: vehiculo.tipoCombustible || '',
      transmision: vehiculo.transmision || ''
    });
    setEditingId(vehiculo.idVehiculo);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este vehículo?')) {
      setVehiculos(vehiculos.filter(v => v.idVehiculo !== id));
      showNotification('Vehículo eliminado correctamente');
    }
  };

  const resetForm = () => {
    setFormData({
      idVendedor: '',
      idMarca: '',
      modelo: '',
      version: '',
      ano: '',
      kilometraje: '',
      precio: '',
      caracteristicas: '',
      descripcion: '',
      estado: 'disponible',
      tipoCombustible: '',
      transmision: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getMarcaNombre = (idMarca) => {
    const marca = marcas.find(m => m.idMarca === idMarca);
    return marca ? marca.nombre_marca : 'Desconocido';
  };

  const getVendedorNombre = (idVendedor) => {
    const vendedor = vendedores.find(v => v.idUsuario === idVendedor);
    return vendedor ? vendedor.nombre : 'Desconocido';
  };

  return (
    <LayoutVendedor>
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Gestión de Vehículos</h3>
        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar vehículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} /> {showForm ? 'Cancelar' : 'Nuevo Vehículo'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="card-body form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Vendedor</label>
                <select
                  name="idVendedor"
                  value={formData.idVendedor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar vendedor</option>
                  {vendedores.map(v => (
                    <option key={v.idUsuario} value={v.idUsuario}>
                      {v.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Marca</label>
                <select
                  name="idMarca"
                  value={formData.idMarca}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar marca</option>
                  {marcas.map(m => (
                    <option key={m.idMarca} value={m.idMarca}>
                      {m.nombre_marca}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Versión</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Año</label>
                <input
                  type="number"
                  name="ano"
                  value={formData.ano}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div className="form-group">
                <label>Kilometraje</label>
                <input
                  type="number"
                  name="kilometraje"
                  value={formData.kilometraje}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Precio (MXN)</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  required
                >
                  <option value="disponible">Disponible</option>
                  <option value="no_disponible">No disponible</option>
                  <option value="vendido">Vendido</option>
                  <option value="reservado">Reservado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tipo de Combustible</label>
                <select
                  name="tipoCombustible"
                  value={formData.tipoCombustible}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                </select>
              </div>
              <div className="form-group">
                <label>Transmisión</label>
                <select
                  name="transmision"
                  value={formData.transmision}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Automática">Automática</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div className="form-group span-2">
                <label>Características</label>
                <textarea
                  name="caracteristicas"
                  value={formData.caracteristicas}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Separar por comas (Aire acondicionado, Bluetooth, etc.)"
                />
              </div>
              <div className="form-group span-2">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Actualizar Vehículo' : 'Crear Vehículo'}
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
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Vendedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVehiculos.length > 0 ? (
              paginatedVehiculos.map((vehiculo) => (
                <tr key={vehiculo.idVehiculo}>
                  <td>{vehiculo.idVehiculo}</td>
                  <td>{getMarcaNombre(vehiculo.idMarca)}</td>
                  <td>{vehiculo.modelo} {vehiculo.version && `(${vehiculo.version})`}</td>
                  <td>{vehiculo.ano}</td>
                  <td>{formatPrice(vehiculo.precio)}</td>
                  <td>
                    <span className={`badge ${
                      vehiculo.estado === 'disponible' ? 'badge-success' :
                      vehiculo.estado === 'reservado' ? 'badge-warning' :
                      vehiculo.estado === 'vendido' ? 'badge-primary' : 'badge-secondary'
                    }`}>
                      {vehiculo.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{getVendedorNombre(vehiculo.idVendedor)}</td>
                  <td className="actions">
                    <button 
                      className="btn-icon btn-warning"
                      onClick={() => handleEdit(vehiculo)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(vehiculo.idVehiculo)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No se encontraron vehículos
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

export default VehiculosViewVendedor;