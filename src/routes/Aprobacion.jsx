import React, { useState } from "react";
import { Search, Check, X, Clock, AlertCircle, Info, AlertTriangle, CheckCircle } from "lucide-react";

function Aprobacion({ aprobaciones, onAprobacionChange, showAlert }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [aprobacionSeleccionada, setAprobacionSeleccionada] = useState(null);
  const [comentarioRechazo, setComentarioRechazo] = useState("");

  // Función para manejar aprobación
  const manejarAprobacion = (id, accion) => {
    const nuevasAprobaciones = aprobaciones.map(aprobacion => 
      aprobacion.id === id 
        ? { 
            ...aprobacion, 
            estado: accion === 'aprobar' ? 'Aprobado' : 'Rechazado',
            fecha: new Date().toISOString().split('T')[0],
            comentario: accion === 'rechazar' ? comentarioRechazo : aprobacion.comentario
          } 
        : aprobacion
    );
    
    onAprobacionChange(nuevasAprobaciones);
    setModalConfirmacion(false);
    setAprobacionSeleccionada(null);
    setComentarioRechazo("");
    
    const accionTexto = accion === 'aprobar' ? 'aprobada' : 'rechazada';
    showAlert('success', 'Acción Completada', `La solicitud ha sido ${accionTexto} exitosamente.`);
  };

  // Función para abrir modal de confirmación de APROBACIÓN
  const abrirConfirmacionAprobacion = (aprobacion) => {
    setAprobacionSeleccionada(aprobacion);
    
    showAlert(
      'warning', 
      'Confirmar Aprobación',
      `¿Está seguro de aprobar esta solicitud?\n\nProveedor: ${aprobacion.proveedorNombre}\nSolicitud: ${aprobacion.solicitud}\nID: #${aprobacion.id}`,
      true,
      () => manejarAprobacion(aprobacion.id, 'aprobar')
    );
  };

  // Función para abrir modal de confirmación de RECHAZO
  const abrirConfirmacionRechazo = (aprobacion) => {
    setAprobacionSeleccionada(aprobacion);
    setComentarioRechazo("");
    setModalConfirmacion(true);
  };

  // Función para confirmar rechazo con comentario
  const confirmarRechazo = () => {
    if (!comentarioRechazo.trim()) {
      showAlert('error', 'Comentario Requerido', 'Por favor ingrese un comentario explicando el motivo del rechazo.');
      return;
    }

    manejarAprobacion(aprobacionSeleccionada.id, 'rechazar');
    setModalConfirmacion(false);
  };

  // Función para obtener el color del estado de aprobación
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Aprobado":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rechazado":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Función para obtener el icono del estado
  const getEstadoIcono = (estado) => {
    switch (estado) {
      case "Aprobado":
        return <Check className="w-3 h-3" />;
      case "Rechazado":
        return <X className="w-3 h-3" />;
      case "Pendiente":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  // Filtrar aprobaciones
  const aprobacionesFiltradas = aprobaciones.filter(aprobacion => {
    const coincideBusqueda = 
      aprobacion.proveedorNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      aprobacion.solicitud.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = !filtroEstatus || aprobacion.estado === filtroEstatus;
    return coincideBusqueda && coincideEstado;
  });

  return (
    <div>
      {/* Barra de herramientas para Aprobaciones */}
      <div className="bg-white rounded-lg border border-lightBlue p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Búsqueda */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midBlue w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por proveedor o solicitud..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-lightBlue rounded-lg focus:ring-2 focus:ring-midBlue focus:border-midBlue text-darkBlue"
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filtroEstatus}
              onChange={(e) => setFiltroEstatus(e.target.value)}
              className="px-3 py-2 border border-lightBlue rounded-lg focus:ring-2 focus:ring-midBlue focus:border-midBlue text-darkBlue"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Aprobaciones */}
      <div className="bg-white rounded-lg border border-lightBlue overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-lightBlue border-b border-midBlue">
                <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                  Nombre del Proveedor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                  Solicitud
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                  Comentario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lightBlue">
              {aprobacionesFiltradas.map((aprobacion) => (
                <tr key={aprobacion.id} className="hover:bg-beige transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-darkBlue">
                      #{aprobacion.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-darkBlue">
                      {aprobacion.proveedorNombre}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-midBlue">
                    {aprobacion.solicitud}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(aprobacion.estado)}`}>
                      {getEstadoIcono(aprobacion.estado)}
                      {aprobacion.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-midBlue">
                    {new Date(aprobacion.fecha).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4 text-sm text-midBlue max-w-xs">
                    {aprobacion.comentario ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-xs">{aprobacion.comentario}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Sin comentarios</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {aprobacion.estado === "Pendiente" && (
                        <>
                          <button
                            onClick={() => abrirConfirmacionAprobacion(aprobacion)}
                            className="text-green-600 hover:text-green-800 transition p-1"
                            title="Aprobar solicitud"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => abrirConfirmacionRechazo(aprobacion)}
                            className="text-red-600 hover:text-red-800 transition p-1"
                            title="Rechazar solicitud"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {(aprobacion.estado === "Aprobado" || aprobacion.estado === "Rechazado") && (
                        <span className="text-xs text-gray-500 italic">
                          Resuelto
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensaje cuando no hay resultados */}
        {aprobacionesFiltradas.length === 0 && (
          <div className="text-center py-8">
            <div className="text-midBlue mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-darkBlue text-lg">No se encontraron aprobaciones</p>
            <p className="text-midBlue">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal de confirmación para rechazo con comentario */}
      {modalConfirmacion && aprobacionSeleccionada && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity backdrop-blur-sm"
            onClick={() => setModalConfirmacion(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-xl shadow-2xl border-2 border-red-300 w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-red-500 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
                <h3 className="text-lg font-semibold">Motivo del Rechazo</h3>
                <button
                  onClick={() => setModalConfirmacion(false)}
                  className="text-white hover:text-red-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-gray-700 mb-4">
                    Por favor, especifique el motivo del rechazo para la solicitud:
                  </p>
                  <p className="font-medium text-darkBlue mb-2">
                    {aprobacionSeleccionada.proveedorNombre} - {aprobacionSeleccionada.solicitud}
                  </p>
                  
                  <label className="block text-sm font-medium text-darkBlue mb-2">
                    Comentario del rechazo *
                  </label>
                  <textarea
                    value={comentarioRechazo}
                    onChange={(e) => setComentarioRechazo(e.target.value)}
                    className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-darkBlue"
                    rows="4"
                    placeholder="Describa el motivo del rechazo..."
                    required
                  />
                  <p className="text-red-500 text-xs mt-1">
                    Este comentario será visible para el proveedor.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={confirmarRechazo}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200 font-medium flex-1"
                    disabled={!comentarioRechazo.trim()}
                  >
                    Confirmar Rechazo
                  </button>
                  <button
                    onClick={() => setModalConfirmacion(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-medium flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Aprobacion;