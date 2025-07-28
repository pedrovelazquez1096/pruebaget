import React, { useState, useEffect, useContext } from 'react';
import { 
  FileText, UserCheck, Shield, DollarSign, Percent, 
  Clock, Users, Heart, Car, CheckCircle, Calculator,
  History, ChevronDown, ChevronUp, Copy, Trash2,
  Search, ArrowRight, Calendar, CreditCard, Image, ImagePlus,
  Info, AlertCircle, Download, Share2, Filter, SortAsc
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import LayoutVendedor from '../layout/LayoutVendedor';
import { NotificationContext } from '../../context/NotificationContext';
import './FinanciamientoView.css';

// Base de datos de vehículos con precios del "Libro Azul"
const vehiculosDisponibles = [
  {
    id: 1,
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2020,
    precio: 250000,
    imagen: 'https://via.placeholder.com/600x400?text=Toyota+Corolla+2020',
    imagenesAlternativas: [
      'https://via.placeholder.com/600x400?text=Toyota+Corolla+Front',
      'https://via.placeholder.com/600x400?text=Toyota+Corolla+Side',
      'https://via.placeholder.com/600x400?text=Toyota+Corolla+Rear'
    ],
    categoria: 'Sedán',
    combustible: 'Gasolina',
    transmision: 'Automático'
  },
];

const FinanciamientoView = () => {
  const { showNotification } = useContext(NotificationContext);

  const [cotizacion, setCotizacion] = useState({
    vehiculo: null,
    enganche: '',
    plazo: 60,
    mensualidad: '',
    comision: '',
    mensualidadesDisponibles: [],
    imagenIndex: 0,
    tasaInteres: 12.5
  });

  const [historial, setHistorial] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('precio');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const historialInicial = [];
    setHistorial(historialInicial);
  }, []);

  const vehiculosFiltrados = vehiculosDisponibles
    .filter(vehiculo => {
      const matchBusqueda = vehiculo.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
                           vehiculo.modelo.toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = !filtroCategoria || vehiculo.categoria === filtroCategoria;
      return matchBusqueda && matchCategoria;
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case 'precio':
          return a.precio - b.precio;
        case 'año':
          return b.año - a.año;
        case 'marca':
          return a.marca.localeCompare(b.marca);
        default:
          return 0;
      }
    });

  const categorias = [...new Set(vehiculosDisponibles.map(v => v.categoria))];

  const seleccionarVehiculo = (vehiculo) => {
    let enganche = Math.round(vehiculo.precio * 0.10);
    
    if (vehiculo.precio < 200000 && enganche < 20000) {
      enganche = 20000;
    }
    
    const tasaInteres = cotizacion.tasaInteres;
    
    const mensualidadesDisponibles = [12, 24, 36, 48, 60].map(plazo => {
      const capital = vehiculo.precio - enganche;
      const tasaMensual = (tasaInteres / 100) / 12;
      const mensualidad = capital * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                         (Math.pow(1 + tasaMensual, plazo) - 1);
      
      return {
        plazo,
        mensualidad: Math.round(mensualidad),
        totalIntereses: Math.round((mensualidad * plazo) - capital)
      };
    });

    const comision = Math.round(vehiculo.precio * 0.05);
    
    setCotizacion({
      vehiculo,
      enganche,
      plazo: 60,
      mensualidad: mensualidadesDisponibles.find(m => m.plazo === 60)?.mensualidad || 0,
      comision,
      mensualidadesDisponibles,
      imagenIndex: 0,
      tasaInteres
    });

    showNotification('Vehículo seleccionado correctamente', 'success');
  };

  const calcularCotizacion = () => {
    if (!cotizacion.vehiculo) {
      showNotification('Por favor selecciona un vehículo primero', 'error');
      return;
    }

    const nuevaCotizacion = {
      ...cotizacion,
      fecha: new Date().toLocaleString(),
      id: Date.now()
    };

    setHistorial(prev => [nuevaCotizacion, ...prev].slice(0, 10));
    showNotification('Cotización guardada en el historial', 'success');
  };

  const handleEngancheChange = (e) => {
    if (!cotizacion.vehiculo) return;

    const enganche = parseFloat(e.target.value) || 0;
    const precio = cotizacion.vehiculo?.precio || 0;
    
    let engancheFinal = enganche;
    const engancheMinimo = precio < 200000 ? 20000 : precio * 0.10;
    
    if (enganche < engancheMinimo) {
      engancheFinal = Math.round(engancheMinimo);
      showNotification(`El enganche mínimo es ${formatPrice(engancheMinimo)}`, 'warning');
    }
    
    if (enganche > precio * 0.5) {
      engancheFinal = Math.round(precio * 0.5);
      showNotification(`El enganche máximo es ${formatPrice(precio * 0.5)}`, 'warning');
    }
    
    const tasaInteres = cotizacion.tasaInteres;
    const mensualidadesDisponibles = [12, 24, 36, 48, 60].map(plazo => {
      const capital = precio - engancheFinal;
      const tasaMensual = (tasaInteres / 100) / 12;
      const mensualidad = capital * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                         (Math.pow(1 + tasaMensual, plazo) - 1);
      
      return {
        plazo,
        mensualidad: Math.round(mensualidad),
        totalIntereses: Math.round((mensualidad * plazo) - capital)
      };
    });
    
    setCotizacion(prev => ({
      ...prev,
      enganche: engancheFinal,
      mensualidadesDisponibles,
      mensualidad: mensualidadesDisponibles.find(m => m.plazo === prev.plazo)?.mensualidad || 0
    }));
  };

  const handleTasaInteresChange = (e) => {
    const nuevaTasa = parseFloat(e.target.value) || 0;
    setCotizacion(prev => ({
      ...prev,
      tasaInteres: nuevaTasa
    }));
    
    if (cotizacion.vehiculo) {
      seleccionarVehiculo(cotizacion.vehiculo);
    }
  };

  const seleccionarMensualidad = (plazo, mensualidad) => {
    setCotizacion(prev => ({
      ...prev,
      plazo,
      mensualidad
    }));
  };

  const cambiarImagen = () => {
    if (!cotizacion.vehiculo || !cotizacion.vehiculo.imagenesAlternativas) return;
    
    const nextIndex = (cotizacion.imagenIndex + 1) % cotizacion.vehiculo.imagenesAlternativas.length;
    setCotizacion(prev => ({
      ...prev,
      imagenIndex: nextIndex
    }));
  };

  const copiarCotizacion = (cotizacion) => {
    setCotizacion({
      vehiculo: cotizacion.vehiculo,
      enganche: cotizacion.enganche,
      plazo: cotizacion.plazo,
      mensualidad: cotizacion.mensualidad,
      comision: cotizacion.comision,
      mensualidadesDisponibles: cotizacion.mensualidadesDisponibles,
      imagenIndex: 0,
      tasaInteres: cotizacion.tasaInteres
    });
    showNotification('Cotización copiada correctamente', 'success');
  };

  const eliminarDelHistorial = (id) => {
    setHistorial(prev => prev.filter(item => item.id !== id));
    showNotification('Cotización eliminada del historial', 'success');
  };

  const exportarCotizacion = () => {
    if (!cotizacion.vehiculo) {
      showNotification('No hay cotización para exportar', 'error');
      return;
    }
    
    setGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();
      
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("Cotización de Financiamiento", 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${date}`, 14, 30);
      doc.text(`Vehículo: ${getNombreVehiculo(cotizacion.vehiculo)}`, 14, 40);

      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Detalles del Vehículo', 14, 55);
      
      doc.autoTable({
        startY: 60,
        head: [['Marca', 'Modelo', 'Año', 'Precio']],
        body: [[
          cotizacion.vehiculo.marca,
          cotizacion.vehiculo.modelo,
          cotizacion.vehiculo.año,
          formatPrice(cotizacion.vehiculo.precio)
        ]],
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        }
      });
      
      doc.setFontSize(14);
      doc.text('Detalles de Financiamiento', 14, doc.lastAutoTable.finalY + 15);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Concepto', 'Valor']],
        body: [
          ['Enganche', formatPrice(cotizacion.enganche)],
          ['Plazo', `${cotizacion.plazo} meses`],
          ['Tasa de interés', `${cotizacion.tasaInteres}% anual`],
          ['Mensualidad', formatPrice(cotizacion.mensualidad)],
          ['Comisión', formatPrice(cotizacion.comision)],
          ['Total a pagar', formatPrice(cotizacion.enganche + (cotizacion.mensualidad * cotizacion.plazo))],
          ['Intereses totales', formatPrice(calcularAhorro())]
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        }
      });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('* Esta cotización es válida por 15 días a partir de la fecha de emisión.', 14, doc.lastAutoTable.finalY + 10);
      doc.text('* Los términos y condiciones están sujetos a aprobación de crédito.', 14, doc.lastAutoTable.finalY + 15);
      
      doc.save(`cotizacion_${getNombreVehiculo(cotizacion.vehiculo).replace(/\s+/g, '_')}.pdf`);
      showNotification('Cotización exportada como PDF', 'success');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showNotification('Error al generar el PDF', 'error');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const compartirCotizacion = () => {
    if (!cotizacion.vehiculo) {
      showNotification('No hay cotización para compartir', 'error');
      return;
    }
    
    const texto = `Cotización de ${getNombreVehiculo(cotizacion.vehiculo)}:
Precio: ${formatPrice(cotizacion.vehiculo.precio)}
Enganche: ${formatPrice(cotizacion.enganche)}
Mensualidad: ${formatPrice(cotizacion.mensualidad)} (${cotizacion.plazo} meses)
Tasa de interés: ${cotizacion.tasaInteres}%`;

    if (navigator.share) {
      navigator.share({
        title: 'Cotización de Financiamiento',
        text: texto
      }).then(() => {
        showNotification('Cotización compartida correctamente', 'success');
      }).catch(() => {
        showNotification('Error al compartir la cotización', 'error');
      });
    } else {
      navigator.clipboard.writeText(texto).then(() => {
        showNotification('Cotización copiada al portapapeles', 'success');
      }).catch(() => {
        showNotification('Error al copiar la cotización', 'error');
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  const getNombreVehiculo = (vehiculo) => {
    return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}` : '';
  };

  const getImagenActual = () => {
    if (!cotizacion.vehiculo) return '';
    if (!cotizacion.vehiculo.imagenesAlternativas) return cotizacion.vehiculo.imagen;
    return cotizacion.vehiculo.imagenesAlternativas[cotizacion.imagenIndex] || cotizacion.vehiculo.imagen;
  };

  const calcularAhorro = () => {
    if (!cotizacion.vehiculo) return 0;
    const precioContado = cotizacion.vehiculo.precio;
    const totalFinanciado = cotizacion.enganche + (cotizacion.mensualidad * cotizacion.plazo);
    return totalFinanciado - precioContado;
  };

  return (
    <LayoutVendedor>
      <div> {/* Contenedor aislado */}
        <div className="fin-min-h-screen fin-bg-gradient-to-br from-blue-50 to-indigo-100 fin-p-4">
          <div className="fin-max-w-7xl fin-mx-auto">
            {/* Header */}
            <div className="fin-bg-white fin-rounded-xl fin-shadow-lg fin-p-6 fin-mb-6">
              <div className="fin-flex fin-items-center fin-justify-between">
                <div className="fin-flex fin-items-center fin-space-x-3">
                  <div className="fin-bg-blue-500 fin-p-3 fin-rounded-full">
                    <Calculator className="fin-w-6 fin-h-6 fin-text-white" />
                  </div>
                  <div>
                    <h1 className="fin-text-2xl fin-font-bold fin-text-gray-800">Calculadora de Financiamiento</h1>
                    <p className="fin-text-gray-600">Encuentra la mejor opción para tu vehículo</p>
                  </div>
                </div>
                <div className="fin-flex fin-space-x-2">
                  <button 
                    className="fin-px-4 fin-py-2 fin-rounded-lg fin-font-medium fin-transition-colors fin-bg-blue-500 fin-text-white"
                    onClick={() => setCotizacion(prev => ({...prev, vehiculo: null}))}
                  >
                    <Calculator className="fin-w-4 fin-h-4 fin-inline fin-mr-2" />
                    Nueva Cotización
                  </button>
                </div>
              </div>
            </div>

            {!cotizacion.vehiculo ? (
              <div className="fin-bg-white fin-rounded-xl fin-shadow-lg fin-p-6 fin-mb-6">
                {/* Filtros y búsqueda */}
                <div className="fin-mb-6 fin-space-y-4">
                  <div className="fin-flex fin-flex-wrap fin-gap-4 fin-items-center">
                    <div className="fin-flex-1 fin-min-w-64">
                      <div className="fin-relative">
                        <Search className="fin-absolute fin-left-3 fin-top-3 fin-w-4 fin-h-4 fin-text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar por marca o modelo..."
                          className="fin-w-full fin-pl-10 fin-pr-4 fin-py-2 fin-border fin-border-gray-300 fin-rounded-lg fin-focus:ring-2 fin-focus:ring-blue-500 fin-focus:border-transparent"
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                        />
                      </div>
                    </div>
                    <select
                      className="fin-px-4 fin-py-2 fin-border fin-border-gray-300 fin-rounded-lg fin-focus:ring-2 fin-focus:ring-blue-500 fin-focus:border-transparent"
                      value={filtroCategoria}
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map(categoria => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                      ))}
                    </select>
                    <select
                      className="fin-px-4 fin-py-2 fin-border fin-border-gray-300 fin-rounded-lg fin-focus:ring-2 fin-focus:ring-blue-500 fin-focus:border-transparent"
                      value={ordenamiento}
                      onChange={(e) => setOrdenamiento(e.target.value)}
                    >
                      <option value="precio">Ordenar por precio</option>
                      <option value="año">Ordenar por año</option>
                      <option value="marca">Ordenar por marca</option>
                    </select>
                  </div>
                </div>

                {/* Grid de vehículos */}
                <div className="fin-grid fin-grid-cols-1 fin-md:grid-cols-2 fin-lg:grid-cols-3 fin-gap-6">
                  {vehiculosFiltrados.map(vehiculo => (
                    <div 
                      key={vehiculo.id} 
                      className="fin-bg-white fin-border fin-border-gray-200 fin-rounded-xl fin-overflow-hidden fin-cursor-pointer group fin-group-hover:shadow-lg"
                      onClick={(e) => { e.stopPropagation(); seleccionarVehiculo(vehiculo); }}
                    >
                      <div className="fin-aspect-w-16 fin-aspect-h-9 fin-overflow-hidden">
                        <img 
                          src={vehiculo.imagen} 
                          alt={getNombreVehiculo(vehiculo)}
                          className="fin-w-full fin-h-48 fin-object-cover fin-group-hover:scale-105 fin-transition-transform fin-duration-300"
                        />
                      </div>
                      <div className="fin-p-4">
                        <h3 className="fin-font-semibold fin-text-lg fin-text-gray-800 fin-mb-2">
                          {getNombreVehiculo(vehiculo)}
                        </h3>
                        <div className="fin-space-y-2 fin-text-sm fin-text-gray-600 fin-mb-3">
                          <div className="fin-flex fin-justify-between">
                            <span>Categoría:</span>
                            <span className="fin-font-medium">{vehiculo.categoria}</span>
                          </div>
                          <div className="fin-flex fin-justify-between">
                            <span>Transmisión:</span>
                            <span className="fin-font-medium">{vehiculo.transmision}</span>
                          </div>
                        </div>
                        <div className="fin-flex fin-justify-between fin-items-center">
                          <div className="fin-text-2xl fin-font-bold fin-text-blue-600">
                            {formatPrice(vehiculo.precio)}
                          </div>
                          <div className="fin-text-sm fin-text-gray-500">
                            Desde {formatPrice(vehiculo.precio < 200000 ? 20000 : Math.round(vehiculo.precio * 0.10))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="fin-grid fin-grid-cols-1 fin-lg:grid-cols-3 fin-gap-6 fin-mb-6">
                {/* Vehículo seleccionado */}
                <div className="fin-bg-white fin-rounded-xl fin-shadow-lg fin-p-6">
                  <h3 className="fin-text-lg fin-font-semibold fin-mb-4 fin-flex fin-items-center">
                    <Car className="fin-w-5 fin-h-5 fin-mr-2 fin-text-blue-500" />
                    Vehículo Seleccionado
                  </h3>
                  <div className="fin-space-y-4">
                    <div className="fin-relative">
                      <img 
                        src={getImagenActual()} 
                        alt={getNombreVehiculo(cotizacion.vehiculo)}
                        className="fin-w-full fin-h-48 fin-object-cover fin-rounded-lg"
                      />
                      {cotizacion.vehiculo.imagenesAlternativas?.length > 1 && (
                        <button
                          className="fin-absolute fin-bottom-2 fin-right-2 fin-bg-white fin-bg-opacity-90 fin-hover:bg-opacity-100 fin-px-3 fin-py-1 fin-rounded-full fin-text-sm fin-font-medium fin-transition-colors"
                          onClick={cambiarImagen}
                        >
                          <ImagePlus className="fin-w-4 fin-h-4 fin-inline fin-mr-1" />
                          Cambiar vista
                        </button>
                      )}
                    </div>
                    <div>
                      <h4 className="fin-font-semibold fin-text-lg">{getNombreVehiculo(cotizacion.vehiculo)}</h4>
                      <div className="fin-text-2xl fin-font-bold fin-text-blue-600 fin-mt-2">
                        {formatPrice(cotizacion.vehiculo.precio)}
                      </div>
                      <div className="fin-text-sm fin-text-gray-600 fin-mt-2 fin-space-y-1">
                        <div>Categoría: {cotizacion.vehiculo.categoria}</div>
                        <div>Transmisión: {cotizacion.vehiculo.transmision}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuración de financiamiento */}
                <div className="fin-bg-white fin-rounded-xl fin-shadow-lg fin-p-6">
                  <h3 className="fin-text-lg fin-font-semibold fin-mb-4 fin-flex fin-items-center">
                    <CreditCard className="fin-w-5 fin-h-5 fin-mr-2 fin-text-green-500" />
                    Configuración
                  </h3>
                  <div className="fin-space-y-4">
                    <div>
                      <label className="fin-block fin-text-sm fin-font-medium fin-text-gray-700 fin-mb-2">
                        Enganche
                      </label>
                      <div className="fin-relative">
                        <DollarSign className="fin-absolute fin-left-3 fin-top-3 fin-w-4 fin-h-4 fin-text-gray-400" />
                        <input
                          type="number"
                          className="fin-w-full fin-pl-10 fin-pr-4 fin-py-2 fin-border fin-border-gray-300 fin-rounded-lg fin-focus:ring-2 fin-focus:ring-blue-500 fin-focus:border-transparent"
                          value={cotizacion.enganche}
                          onChange={handleEngancheChange}
                          min={cotizacion.vehiculo.precio < 200000 ? 20000 : cotizacion.vehiculo.precio * 0.10}
                          max={cotizacion.vehiculo.precio * 0.5}
                        />
                      </div>
                      <div className="fin-text-sm fin-text-gray-500 fin-mt-1">
                        Mínimo: {formatPrice(cotizacion.vehiculo.precio < 200000 ? 20000 : cotizacion.vehiculo.precio * 0.10)}
                      </div>
                    </div>

                    <div>
                      <label className="fin-block fin-text-sm fin-font-medium fin-text-gray-700 fin-mb-2">
                        Tasa de interés anual (%)
                      </label>
                      <div className="fin-relative">
                        <Percent className="fin-absolute fin-left-3 fin-top-3 fin-w-4 fin-h-4 fin-text-gray-400" />
                        <input
                          type="number"
                          className="fin-w-full fin-pl-10 fin-pr-4 fin-py-2 fin-border fin-border-gray-300 fin-rounded-lg fin-focus:ring-2 fin-focus:ring-blue-500 fin-focus:border-transparent"
                          value={cotizacion.tasaInteres}
                          onChange={handleTasaInteresChange}
                          min="0"
                          max="30"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="fin-block fin-text-sm fin-font-medium fin-text-gray-700 fin-mb-3">
                        Plazo de financiamiento
                      </label>
                      <div className="fin-grid fin-grid-cols-1 fin-gap-2">
                        {cotizacion.mensualidadesDisponibles.map((item, index) => (
                          <div 
                            key={index}
                            className={`fin-p-3 fin-rounded-lg fin-border-2 fin-cursor-pointer fin-transition-colors ${
                              cotizacion.plazo === item.plazo 
                                ? 'fin-border-blue-500 fin-bg-blue-50' 
                                : 'fin-border-gray-200 fin-hover:border-gray-300'
                            }`}
                            onClick={() => seleccionarMensualidad(item.plazo, item.mensualidad)}
                          >
                            <div className="fin-flex fin-justify-between fin-items-center">
                              <span className="fin-font-medium">{item.plazo} meses</span>
                              <span className="fin-text-blue-600 fin-font-semibold">
                                {formatPrice(item.mensualidad)}
                              </span>
                            </div>
                            <div className="fin-text-xs fin-text-gray-500 fin-mt-1">
                              Intereses: {formatPrice(item.totalIntereses)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen */}
                <div className="fin-bg-white fin-rounded-xl fin-shadow-lg fin-p-6">
                  <h3 className="fin-text-lg fin-font-semibold fin-mb-4 fin-flex fin-items-center">
                    <FileText className="fin-w-5 fin-h-5 fin-mr-2 fin-text-purple-500" />
                    Resumen de Cotización
                  </h3>
                  <div className="fin-space-y-3">
                    <div className="fin-flex fin-justify-between fin-py-2 fin-border-b fin-border-gray-100">
                      <span className="fin-text-gray-600">Precio del vehículo:</span>
                      <span className="fin-font-semibold">{formatPrice(cotizacion.vehiculo.precio)}</span>
                    </div>
                    <div className="fin-flex fin-justify-between fin-py-2 fin-border-b fin-border-gray-100">
                      <span className="fin-text-gray-600">Enganche:</span>
                      <span className="fin-font-semibold">{formatPrice(cotizacion.enganche)}</span>
                    </div>
                    <div className="fin-flex fin-justify-between fin-py-2 fin-border-b fin-border-gray-100">
                      <span className="fin-text-gray-600">Plazo:</span>
                      <span className="fin-font-semibold">{cotizacion.plazo} meses</span>
                    </div>
                    <div className="fin-flex fin-justify-between fin-py-2 fin-border-b fin-border-gray-100">
                      <span className="fin-text-gray-600">Tasa de interés:</span>
                      <span className="fin-font-semibold">{cotizacion.tasaInteres}%</span>
                    </div>
                    <div className="fin-flex fin-justify-between fin-py-2 fin-border-b fin-border-gray-100">
                      <span className="fin-text-gray-600">Mensualidad:</span>
                      <span className="fin-font-semibold fin-text-green-600 fin-text-lg">{formatPrice(cotizacion.mensualidad)}</span>
                    </div>
                    <div className="fin-flex fin-justify-between fin-py-2 fin-border-b fin-border-gray-100">
                      <span className="fin-text-gray-600">Comisión (5%):</span>
                      <span className="fin-font-semibold">{formatPrice(cotizacion.comision)}</span>
                    </div>
                    <div className="fin-flex fin-justify-between fin-py-2 fin-border-b fin-border-gray-100">
                      <span className="fin-text-gray-600">Total a pagar:</span>
                      <span className="fin-font-semibold">{formatPrice(cotizacion.enganche + (cotizacion.mensualidad * cotizacion.plazo))}</span>
                    </div>
                    <div className="fin-flex fin-justify-between fin-py-2">
                      <span className="fin-text-gray-600">Intereses totales:</span>
                      <span className="fin-font-semibold fin-text-red-600">{formatPrice(calcularAhorro())}</span>
                    </div>
                  </div>
                  
                  <div className="fin-mt-6 fin-space-y-2">
                    <button 
                      className="fin-w-full fin-bg-blue-500 fin-text-white fin-py-2 fin-px-4 fin-rounded-lg fin-font-medium fin-transition-colors"
                      onClick={calcularCotizacion}
                    >
                      Guardar Cotización
                    </button>
                    <div className="fin-flex fin-space-x-2">
                      <button 
                        className={`fin-flex-1 fin-bg-gray-100 fin-text-gray-700 fin-py-2 fin-px-4 fin-rounded-lg fin-font-medium fin-transition-colors fin-flex fin-items-center fin-justify-center ${
                          generatingPDF ? 'fin-disabled' : ''
                        }`}
                        onClick={exportarCotizacion}
                        disabled={generatingPDF}
                      >
                        {generatingPDF ? (
                          <span className="fin-pdf-generating">Generando PDF...</span>
                        ) : (
                          <>
                            <Download className="fin-w-4 fin-h-4 fin-mr-2" />
                            Exportar PDF
                          </>
                        )}
                      </button>
                      <button 
                        className="fin-flex-1 fin-bg-gray-100 fin-text-gray-700 fin-py-2 fin-px-4 fin-rounded-lg fin-font-medium fin-transition-colors fin-flex fin-items-center fin-justify-center"
                        onClick={compartirCotizacion}
                      >
                        <Share2 className="fin-w-4 fin-h-4 fin-mr-2" />
                        Compartir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Historial de cotizaciones */}
            <div className="fin-bg-white fin-rounded-xl fin-shadow-lg fin-p-6">
              <div 
                className="fin-flex fin-items-center fin-justify-between fin-cursor-pointer"
                onClick={() => setShowHistorial(!showHistorial)}
              >
                <h3 className="fin-text-lg fin-font-semibold fin-flex fin-items-center">
                  <History className="fin-w-5 fin-h-5 fin-mr-2 fin-text-orange-500" />
                  Historial de Cotizaciones ({historial.length})
                </h3>
                {showHistorial ? 
                  <ChevronUp className="fin-w-5 fin-h-5 fin-text-gray-400" /> : 
                  <ChevronDown className="fin-w-5 fin-h-5 fin-text-gray-400" />
                }
              </div>
              
              {showHistorial && (
                <div className="fin-mt-4">
                  {historial.length > 0 ? (
                    <div className="fin-space-y-4">
                      {historial.map((item, index) => (
                        <div key={item.id} className="fin-border fin-border-gray-200 fin-rounded-lg fin-p-4">
                          <div className="fin-flex fin-justify-between fin-items-start fin-mb-2">
                            <div>
                              <h4 className="fin-font-semibold fin-text-gray-800">
                                {getNombreVehiculo(item.vehiculo)}
                              </h4>
                              <p className="fin-text-sm fin-text-gray-500">{item.fecha}</p>
                            </div>
                            <div className="fin-flex fin-space-x-2">
                              <button 
                                className="fin-p-2 fin-text-blue-600 fin-hover:bg-blue-50 fin-rounded-lg fin-transition-colors"
                                onClick={() => copiarCotizacion(item)}
                                title="Usar esta cotización"
                              >
                                <Copy className="fin-w-4 fin-h-4" />
                              </button>
                              <button 
                                className="fin-p-2 fin-text-red-600 fin-hover:bg-red-50 fin-rounded-lg fin-transition-colors"
                                onClick={() => eliminarDelHistorial(item.id)}
                                title="Eliminar del historial"
                              >
                                <Trash2 className="fin-w-4 fin-h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="fin-grid fin-grid-cols-2 fin-md:grid-cols-4 fin-gap-4 fin-text-sm">
                            <div>
                              <span className="fin-text-gray-500">Precio:</span>
                              <div className="fin-font-semibold">{formatPrice(item.vehiculo.precio)}</div>
                            </div>
                            <div>
                              <span className="fin-text-gray-500">Enganche:</span>
                              <div className="fin-font-semibold">{formatPrice(item.enganche)}</div>
                            </div>
                            <div>
                              <span className="fin-text-gray-500">Mensualidad:</span>
                              <div className="fin-font-semibold fin-text-green-600">{formatPrice(item.mensualidad)}</div>
                            </div>
                            <div>
                              <span className="fin-text-gray-500">Plazo:</span>
                              <div className="fin-font-semibold">{item.plazo} meses</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="fin-text-center fin-py-8 fin-text-gray-500">
                      <History className="fin-w-12 fin-h-12 fin-mx-auto fin-mb-4 fin-text-gray-300" />
                      <p>No hay cotizaciones guardadas</p>
                      <p className="fin-text-sm">Las cotizaciones aparecerán aquí cuando las generes</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutVendedor>
  );
};

export default FinanciamientoView;