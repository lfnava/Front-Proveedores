import React, { useState } from 'react';
import { Search, Filter, Upload, Eye, XCircle, CheckCircle, AlertCircle, RefreshCw, X, FileText } from 'lucide-react';

const ExpedientesDigitalesPro = () => {
  // Estado para datos de ejemplo (solo documentos del usuario actual)
  const [expedientes, setExpedientes] = useState([
    {
      id: 1,
      fecha: '2024-01-15',
      documento: 'Orden_Compra_001.pdf',
      tipo: 'PDF',
      estatus: 'aprobado',
      comentario: '',
      ultimaActualizacion: '2024-01-16 10:30'
    },
    {
      id: 2,
      fecha: '2024-01-16',
      documento: 'Factura_Electrónica.xml',
      tipo: 'XML',
      estatus: 'rechazado',
      comentario: 'El RFC no coincide con el proveedor registrado. Favor de verificar.',
      ultimaActualizacion: '2024-01-17 14:20'
    },
    {
      id: 3,
      fecha: '2024-01-17',
      documento: 'Orden_Compra_045.pdf',
      tipo: 'PDF',
      estatus: 'pendiente',
      comentario: '',
      ultimaActualizacion: '2024-01-17 09:15'
    },
    {
      id: 4,
      fecha: '2024-01-18',
      documento: 'Factura_789.xml',
      tipo: 'XML',
      estatus: 'pendiente',
      comentario: '',
      ultimaActualizacion: '2024-01-18 16:45'
    }
  ]);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  
  // Estado para los modales
  const [modalReemplazarAbierto, setModalReemplazarAbierto] = useState(false);
  const [modalVisualizarAbierto, setModalVisualizarAbierto] = useState(false);
  const [modalComentarioAbierto, setModalComentarioAbierto] = useState(false);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);
  const [nuevoArchivo, setNuevoArchivo] = useState(null);
  const [archivoSubido, setArchivoSubido] = useState(null);
  
  // Estado para notificaciones
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ 
    type: '', 
    title: '', 
    message: '', 
    showConfirm: false, 
    onConfirm: null 
  });

  // Función para mostrar alertas
  const showAlert = (type, title, message, showConfirm = false, onConfirm = null) => {
    setAlertConfig({ type, title, message, showConfirm, onConfirm });
    setAlertOpen(true);
  };

  // Componente de Alertas
  const Alert = () => {
    if (!alertOpen) return null;

    const alertStyles = {
      success: { 
        bg: 'bg-green-50', 
        border: 'border-green-200', 
        icon: <CheckCircle className="w-6 h-6 text-green-600" />, 
        button: 'bg-green-600 hover:bg-green-700',
        text: 'text-green-800'
      },
      error: { 
        bg: 'bg-red-50', 
        border: 'border-red-200', 
        icon: <XCircle className="w-6 h-6 text-red-600" />, 
        button: 'bg-red-600 hover:bg-red-700',
        text: 'text-red-800'
      },
      info: { 
        bg: 'bg-blue-50', 
        border: 'border-blue-200', 
        icon: <AlertCircle className="w-6 h-6 text-blue-600" />, 
        button: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-800'
      }
    };

    const style = alertStyles[alertConfig.type] || alertStyles.info;

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity backdrop-blur-sm" />
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className={`rounded-xl shadow-2xl border-2 ${style.bg} ${style.border} w-full max-w-sm sm:max-w-md transform transition-all duration-300 scale-95 hover:scale-100`}>
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base sm:text-lg font-semibold ${style.text} mb-2`}>
                    {alertConfig.title}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
                    {alertConfig.message}
                  </p>
                  <button
                    onClick={() => {
                      setAlertOpen(false);
                    }}
                    className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 text-white rounded-lg transition ${style.button} font-medium text-sm sm:text-base`}
                  >
                    Aceptar
                  </button>
                </div>
                <button
                  onClick={() => {
                    setAlertOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition flex-shrink-0 mt-1"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Filtrar expedientes
  const expedientesFiltrados = expedientes.filter(exp => {
    // Filtro por búsqueda
    const coincideBusqueda = exp.documento.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por estatus
    const coincideEstatus = filtroEstatus === 'todos' || exp.estatus === filtroEstatus;
    
    // Filtro por tipo
    const coincideTipo = filtroTipo === 'todos' || exp.tipo === filtroTipo;
    
    return coincideBusqueda && coincideEstatus && coincideTipo;
  });

  // Función para obtener el color del estatus
  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'aprobado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el icono del estatus
  const getEstatusIcon = (estatus) => {
    switch (estatus) {
      case 'aprobado':
        return <CheckCircle className="w-4 h-4" />;
      case 'rechazado':
        return <XCircle className="w-4 h-4" />;
      case 'pendiente':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Función para formatear la fecha
  const formatFecha = (fechaStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', options);
  };

  // Función para abrir modal de reemplazar archivo
  const abrirModalReemplazar = (expediente) => {
    // Solo permitir si está pendiente
    if (expediente.estatus === 'pendiente') {
      setExpedienteSeleccionado(expediente);
      setModalReemplazarAbierto(true);
    }
  };

  // Función para abrir modal de visualizar
  const abrirModalVisualizar = (expediente) => {
    setExpedienteSeleccionado(expediente);
    setModalVisualizarAbierto(true);
  };

  // Función para abrir modal de comentario (al hacer clic en el estatus rechazado)
  const abrirModalComentario = (expediente) => {
    if (expediente.estatus === 'rechazado' && expediente.comentario) {
      setExpedienteSeleccionado(expediente);
      setModalComentarioAbierto(true);
    }
  };

  // Función para manejar subida de nuevo archivo
  const handleNuevoArchivo = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      const tipoPermitido = expedienteSeleccionado?.tipo === 'PDF' 
        ? 'application/pdf' 
        : ['text/xml', 'application/xml'];
      
      let esValido = false;
      
      if (expedienteSeleccionado?.tipo === 'PDF') {
        esValido = file.type === 'application/pdf';
      } else {
        esValido = file.type === 'text/xml' || 
                  file.type === 'application/xml' || 
                  file.name.toLowerCase().endsWith('.xml');
      }

      if (!esValido) {
        showAlert(
          'error',
          'Formato Incorrecto',
          `Por favor, suba un archivo ${expedienteSeleccionado?.tipo}`
        );
        return;
      }

      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showAlert(
          'error',
          'Archivo Muy Grande',
          'El archivo no puede ser mayor a 10MB'
        );
        return;
      }

      setNuevoArchivo(file);
      setArchivoSubido({
        nombre: file.name,
        tipo: file.type.includes('pdf') ? 'PDF' : 'XML'
      });
    }
  };

  // Función para reemplazar el archivo
  const handleReemplazarArchivo = () => {
    if (!nuevoArchivo || !expedienteSeleccionado) return;

    // Actualizar el expediente
    const expedientesActualizados = expedientes.map(exp => {
      if (exp.id === expedienteSeleccionado.id) {
        return {
          ...exp,
          documento: nuevoArchivo.name,
          ultimaActualizacion: new Date().toLocaleString('es-ES')
        };
      }
      return exp;
    });

    setExpedientes(expedientesActualizados);
    
    // Cerrar modal y resetear estados
    setModalReemplazarAbierto(false);
    setExpedienteSeleccionado(null);
    setNuevoArchivo(null);
    setArchivoSubido(null);
    
    // Mostrar notificación de éxito
    showAlert(
      'success', 
      'Documento Reemplazado', 
      'El documento ha sido reemplazado exitosamente.'
    );
  };

  return (
    <div className="min-h-screen bg-beige p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-darkBlue">Expedientes Digitales</h2>
            <p className="text-midBlue">Gestión de documentos de órdenes de compra y facturas</p>
          </div>
          
          {/* Contador de expedientes */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg border border-lightBlue px-4 py-2">
              <span className="text-sm text-midBlue">Total: </span>
              <span className="font-bold text-darkBlue">{expedientesFiltrados.length}</span>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-lg border border-lightBlue p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-darkBlue mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-midBlue" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre de documento..."
                  className="w-full pl-10 pr-3 py-2 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-midBlue"
                />
              </div>
            </div>

            {/* Filtro por Estatus */}
            <div>
              <label className="block text-sm font-medium text-darkBlue mb-1">
                Estatus
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-midBlue" />
                <select
                  value={filtroEstatus}
                  onChange={(e) => setFiltroEstatus(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-midBlue appearance-none"
                >
                  <option value="todos">Todos los estatus</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-darkBlue mb-1">
                Tipo de Documento
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-midBlue" />
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-lightBlue rounded-lg focus:outline-none focus:ring-2 focus:ring-midBlue appearance-none"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="PDF">PDF</option>
                  <option value="XML">XML</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Expedientes */}
        <div className="bg-white rounded-lg border border-lightBlue overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-midBlue text-white">
                  <th className="py-3 px-4 text-left font-semibold">Fecha</th>
                  <th className="py-3 px-4 text-left font-semibold">Documento</th>
                  <th className="py-3 px-4 text-left font-semibold">Estatus</th>
                  <th className="py-3 px-4 text-left font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBlue">
                {expedientesFiltrados.length > 0 ? (
                  expedientesFiltrados.map((expediente) => (
                    <tr key={expediente.id} className="hover:bg-beige transition">
                      {/* Columna Fecha */}
                      <td className="py-3 px-4">
                        <div className="text-darkBlue font-medium">
                          {formatFecha(expediente.fecha)}
                        </div>
                        <div className="text-xs text-midBlue">
                          {expediente.ultimaActualizacion}
                        </div>
                      </td>

                      {/* Columna Documento */}
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-darkBlue">
                            {expediente.documento}
                          </div>
                          <div className="text-sm text-midBlue">
                            <span className={`px-2 py-0.5 rounded text-xs ${expediente.tipo === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                              {expediente.tipo}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Columna Estatus */}
                      <td className="py-3 px-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div 
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${getEstatusColor(expediente.estatus)} ${expediente.estatus === 'rechazado' ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
                              onClick={expediente.estatus === 'rechazado' ? () => abrirModalComentario(expediente) : undefined}
                            >
                              {getEstatusIcon(expediente.estatus)}
                              <span className="text-sm font-medium capitalize">
                                {expediente.estatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Columna Acción */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {/* Botón Visualizar */}
                          <button
                            onClick={() => abrirModalVisualizar(expediente)}
                            className="p-2 text-midBlue hover:text-darkBlue hover:bg-lightBlue rounded-lg transition"
                            title="Visualizar documento"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Botón Reemplazar (solo si está pendiente) */}
                          {expediente.estatus === 'pendiente' && (
                            <button
                              onClick={() => abrirModalReemplazar(expediente)}
                              className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition"
                              title="Reemplazar documento"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 px-4 text-center">
                      <div className="text-midBlue">
                        No se encontraron expedientes con los filtros aplicados.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie de tabla simplificado */}
        <div className="mt-4 flex justify-end items-center text-sm text-midBlue">
          <div>
            Mostrando {expedientesFiltrados.length} de {expedientes.length} expedientes
          </div>
        </div>
      </div>

      {/* Modal para Visualizar Documento */}
      {modalVisualizarAbierto && expedienteSeleccionado && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-lightBlue w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="p-6">
                {/* Header del Modal */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-darkBlue">
                    Visualizar Documento
                  </h3>
                  <button
                    onClick={() => {
                      setModalVisualizarAbierto(false);
                      setExpedienteSeleccionado(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Información del documento */}
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 rounded-full ${expedienteSeleccionado.tipo === 'PDF' ? 'bg-red-100' : 'bg-blue-100'}`}>
                      {expedienteSeleccionado.tipo === 'PDF' ? '📄' : '📋'}
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="font-bold text-lg text-darkBlue mb-2">
                      {expedienteSeleccionado.documento}
                    </div>
                    <div className="text-midBlue">
                      <span className={`px-3 py-1 rounded-full text-sm ${expedienteSeleccionado.tipo === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {expedienteSeleccionado.tipo}
                      </span>
                    </div>
                  </div>

                  {/* Mensaje de visualización */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-blue-800 font-medium">
                      Se mostrará el documento
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      El documento se abrirá en una nueva ventana o visor
                    </p>
                  </div>
                </div>

                {/* Botón del Modal */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      // En una aplicación real, aquí se abriría el documento
                      setModalVisualizarAbierto(false);
                      setExpedienteSeleccionado(null);
                    }}
                    className="px-6 py-2 bg-midBlue text-white rounded-lg hover:bg-darkBlue transition"
                  >
                    Cerrar Vista Previa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal para Comentario de Rechazo */}
      {modalComentarioAbierto && expedienteSeleccionado && expedienteSeleccionado.estatus === 'rechazado' && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-lightBlue w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="p-6">
                {/* Header del Modal */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-darkBlue">
                    Comentario del Rechazo
                  </h3>
                  <button
                    onClick={() => {
                      setModalComentarioAbierto(false);
                      setExpedienteSeleccionado(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Información del documento */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${expedienteSeleccionado.tipo === 'PDF' ? 'bg-red-50' : 'bg-blue-50'}`}>
                      {expedienteSeleccionado.tipo === 'PDF' ? '📄' : '📋'}
                    </div>
                    <div>
                      <div className="font-medium text-darkBlue">
                        {expedienteSeleccionado.documento}
                      </div>
                      <div className="text-sm text-midBlue">
                        {expedienteSeleccionado.tipo}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div className="mb-4 text-center">
                  <div className="text-lg font-bold text-red-700 mb-1">DOCUMENTO RECHAZADO</div>
                  <div className="text-sm text-red-600">Motivo del rechazo:</div>
                </div>

                {/* Comentario */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute left-3 top-3">
                      <FileText className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 pl-12 min-h-[120px]">
                      <p className="text-red-800 whitespace-pre-line">
                        {expedienteSeleccionado.comentario}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="text-sm text-gray-600 mb-6">
                  <div className="text-center">
                    <span className="font-medium">Fecha de revisión:</span> {expedienteSeleccionado.ultimaActualizacion}
                  </div>
                </div>

                {/* Botón del Modal */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setModalComentarioAbierto(false);
                      setExpedienteSeleccionado(null);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal para Reemplazar Archivo */}
      {modalReemplazarAbierto && expedienteSeleccionado && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-lightBlue w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="p-6">
                {/* Header del Modal */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-darkBlue">
                    Reemplazar Documento
                  </h3>
                  <button
                    onClick={() => {
                      setModalReemplazarAbierto(false);
                      setExpedienteSeleccionado(null);
                      setNuevoArchivo(null);
                      setArchivoSubido(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Información del documento actual */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-darkBlue mb-2">Documento Actual:</h4>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${expedienteSeleccionado.tipo === 'PDF' ? 'bg-red-50' : 'bg-blue-50'}`}>
                      {expedienteSeleccionado.tipo === 'PDF' ? '📄' : '📋'}
                    </div>
                    <div>
                      <div className="font-medium text-darkBlue">
                        {expedienteSeleccionado.documento}
                      </div>
                      <div className="text-sm text-midBlue">
                        {expedienteSeleccionado.tipo}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subir nuevo archivo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-darkBlue mb-2">
                    Seleccionar Nuevo Archivo *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center transition ${
                    archivoSubido
                      ? 'border-green-500 bg-green-50'
                      : 'border-lightBlue hover:border-midBlue'
                  }`}>
                    {!archivoSubido ? (
                      <div>
                        <Upload className="w-8 h-8 text-midBlue mx-auto mb-2" />
                        <p className="text-sm text-darkBlue mb-2">
                          Haz clic para seleccionar el nuevo archivo
                        </p>
                        <p className="text-xs text-midBlue mb-3">
                          Formato: {expedienteSeleccionado.tipo} • Máximo 10MB
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          id="nuevo-archivo"
                          accept={expedienteSeleccionado.tipo === 'PDF' ? '.pdf' : '.xml'}
                          onChange={handleNuevoArchivo}
                        />
                        <label
                          htmlFor="nuevo-archivo"
                          className="inline-block px-4 py-2 bg-midBlue text-white rounded-lg hover:bg-darkBlue transition cursor-pointer text-sm"
                        >
                          Seleccionar Archivo
                        </label>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-darkBlue">{archivoSubido.nombre}</p>
                        <p className="text-xs text-midBlue">{archivoSubido.tipo}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setNuevoArchivo(null);
                            setArchivoSubido(null);
                          }}
                          className="mt-2 px-3 py-1 text-red-500 hover:text-red-700 transition text-sm"
                        >
                          Cambiar archivo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones del Modal */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setModalReemplazarAbierto(false);
                      setExpedienteSeleccionado(null);
                      setNuevoArchivo(null);
                      setArchivoSubido(null);
                    }}
                    className="px-4 py-2 border border-lightBlue text-darkBlue rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReemplazarArchivo}
                    disabled={!nuevoArchivo}
                    className={`px-4 py-2 rounded-lg transition ${
                      nuevoArchivo
                        ? 'bg-midBlue text-white hover:bg-darkBlue'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Reemplazar Documento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Alertas/Notificaciones */}
      <Alert />
    </div>
  );
};

export default ExpedientesDigitalesPro;