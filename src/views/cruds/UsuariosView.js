import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronUp, Fingerprint } from 'lucide-react';
import LayoutAdmin from '../layout/LayoutAdmin';
import FingerprintModal from './FingerprintModal';

const UsuariosView = ({ showNotification }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'idUsuario', direction: 'asc' });
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    idRol: 2,
    estado: 'activo',
    fingerprintStatus: 'no registrado'
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const mockUsuarios = [
      { idUsuario: 1, nombre: 'Admin', email: 'admin@example.com', telefono: '123456789', direccion: 'Calle 123', idRol: 1, estado: 'activo', fingerprintStatus: 'no registrado' },
      { idUsuario: 2, nombre: 'Vendedor 1', email: 'vendedor1@example.com', telefono: '987654321', direccion: 'Avenida 456', idRol: 2, estado: 'activo', fingerprintStatus: 'verificado' },
      { idUsuario: 3, nombre: 'Vendedor 2', email: 'vendedor2@example.com', telefono: '555555555', direccion: 'Boulevard 789', idRol: 2, estado: 'inactivo', fingerprintStatus: 'en espera' }
    ];
    setUsuarios(mockUsuarios);
    setFilteredUsuarios(mockUsuarios);
  }, []);

  useEffect(() => {
    const filtered = usuarios.filter(user =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telefono.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsuarios(filtered);
    setCurrentPage(1);
  }, [searchTerm, usuarios]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsuarios = useMemo(() => {
    let sortableItems = [...filteredUsuarios];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredUsuarios, sortConfig]);

  const totalPages = Math.ceil(sortedUsuarios.length / itemsPerPage);
  const paginatedUsuarios = sortedUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        setUsuarios(usuarios.map(u =>
          u.idUsuario === editingId ? { ...u, ...formData } : u
        ));
        if (showNotification) {
          showNotification('Usuario actualizado correctamente');
        }
      } else {
        const newUser = { ...formData, idUsuario: usuarios.length + 1 };
        setUsuarios([...usuarios, newUser]);
        if (showNotification) {
          showNotification('Usuario creado correctamente');
        }
      }
      resetForm();
    } catch (error) {
      if (showNotification) {
        showNotification('Error al guardar el usuario', 'error');
      }
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      password: '',
      idRol: usuario.idRol,
      estado: usuario.estado,
      fingerprintStatus: usuario.fingerprintStatus
    });
    setEditingId(usuario.idUsuario);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.idUsuario !== id));
      if (showNotification) {
        showNotification('Usuario eliminado correctamente');
      }
    }
  };

  const handleManageFingerprint = (usuario) => {
    setSelectedUser(usuario);
    setShowFingerprintModal(true);
  };

  const handleFingerprintSuccess = (idUsuario) => {
    setUsuarios(usuarios.map(u => 
      u.idUsuario === idUsuario ? { ...u, fingerprintStatus: 'verificado' } : u
    ));
    setShowFingerprintModal(false);
    if (showNotification) {
      showNotification('Huella registrada correctamente');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      password: '',
      idRol: 2,
      estado: 'activo',
      fingerprintStatus: 'no registrado'
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <LayoutAdmin>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Gestión de Usuarios</h3>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={18} /> {showForm ? 'Cancelar' : 'Nuevo Usuario'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="card-body form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select name="idRol" value={formData.idRol} onChange={handleInputChange}>
                    <option value="1">Administrador</option>
                    <option value="2">Vendedor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleInputChange}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                {!editingId && (
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar Usuario' : 'Crear Usuario'}
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
                <th onClick={() => requestSort('idUsuario')}>ID {sortConfig.key === 'idUsuario' && (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}</th>
                <th onClick={() => requestSort('nombre')}>Nombre {sortConfig.key === 'nombre' && (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}</th>
                <th onClick={() => requestSort('email')}>Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}</th>
                <th>Teléfono</th>
                <th onClick={() => requestSort('idRol')}>Rol {sortConfig.key === 'idRol' && (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}</th>
                <th onClick={() => requestSort('estado')}>Estado {sortConfig.key === 'estado' && (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}</th>
                <th>Huella</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsuarios.length > 0 ? (
                paginatedUsuarios.map((usuario) => (
                  <tr key={usuario.idUsuario}>
                    <td>{usuario.idUsuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefono || '-'}</td>
                    <td>{usuario.idRol === 1 ? 'Admin' : 'Vendedor'}</td>
                    <td>
                      <span className={`badge ${usuario.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td style={{ paddingLeft: '20px' }}> {/* Aumenta la separación con padding-left */}
                      <span className={`badge ${usuario.fingerprintStatus === 'verificado' ? 'badge-success' : usuario.fingerprintStatus === 'en espera' ? 'badge-warning' : 'badge-danger'}`}>
                        {usuario.fingerprintStatus}
                      </span>
                      <button 
                        className="btn-icon btn-primary" 
                        onClick={() => handleManageFingerprint(usuario)} 
                        title="Gestionar Huella"
                        style={{ 
                          marginLeft: '15px', // Separación adicional del badge
                          padding: '8px 15px', // Padding más amplio
                          borderRadius: '8px' // Bordes redondeados
                        }}
                      >
                        <Fingerprint size={16} />
                      </button>
                    </td>
                    <td className="actions">
                      <button className="btn-icon btn-warning" onClick={() => handleEdit(usuario)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(usuario.idUsuario)} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showFingerprintModal && (
          <FingerprintModal
            user={selectedUser}
            onClose={() => setShowFingerprintModal(false)}
            onSuccess={() => handleFingerprintSuccess(selectedUser.idUsuario)}
          />
        )}

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

export default UsuariosView;