import React, { useState } from "react";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle, Eye, EyeOff, Clock, User } from "lucide-react";

function GestionProveedores({ mode, onClose }) {
  // Estados para los formularios
  const [formAlta, setFormAlta] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccionFiscal: "",
    rfc: "",
    cuentaClabe: "",
    banco: "",
    observaciones: "",
    tipoUsuario: "proveedor",
    area: "",
    password: ""
  });

  const [formModificacion, setFormModificacion] = useState({
    busqueda: "",
    // Todos los campos del alta
    nombre: "",
    correo: "",
    telefono: "",
    direccionFiscal: "",
    rfc: "",
    cuentaClabe: "",
    banco: "",
    observaciones: "",
    tipoUsuario: "proveedor",
    area: "",
    password: "",
    // Campos para el historial de cambios
    cambiosRealizados: [],
    ultimaModificacion: null
  });

  const [formBaja, setFormBaja] = useState({
    busqueda: "",
    fechaBaja: "",
    motivoBaja: "",
    motivoOtros: "" // Nuevo campo para "otros" motivos
  });

  // Estado para alertas internas
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ 
    type: '', 
    title: '', 
    message: '', 
    showConfirm: false, 
    onConfirm: null 
  });

  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [proveedorEncontrado, setProveedorEncontrado] = useState(false);

  // Datos de ejemplo para proveedores (simulando base de datos)
  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      nombre: "Tecnología Avanzada SA",
      correo: "contacto@tecnologia-avanzada.com",
      telefono: "+52 55 1234 5678",
      direccionFiscal: "Av. Reforma 123, CDMX",
      rfc: "TASA123456789",
      cuentaClabe: "012180001234567890",
      banco: "Banco Nacional",
      observaciones: "Excelente servicio, entrega puntual",
      tipoUsuario: "proveedor",
      area: "",
      password: "password123",
      versiones: [
        {
          version: 1,
          fecha: "2024-01-15",
          usuario: "admin",
          cambios: "Registro inicial"
        }
      ]
    },
    {
      id: 2,
      nombre: "Suministros Industriales MX",
      correo: "ventas@suministros-industrial.com",
      telefono: "+52 81 2345 6789",
      direccionFiscal: "Blvd. Constitución 456, Monterrey",
      rfc: "SIMX987654321",
      cuentaClabe: "012180009876543210",
      banco: "Banco Comercial",
      observaciones: "Buen precio, atención rápida",
      tipoUsuario: "proveedor",
      area: "",
      password: "password456",
      versiones: [
        {
          version: 1,
          fecha: "2024-01-10",
          usuario: "admin",
          cambios: "Registro inicial"
        }
      ]
    }
  ]);

  // Función para mostrar alertas
  const showAlert = (type, title, message, showConfirm = false, onConfirm = null) => {
    setAlertConfig({ type, title, message, showConfirm, onConfirm });
    setAlertOpen(true);
    
    if ((type === 'success' || type === 'info') && !showConfirm) {
      setTimeout(() => {
        setAlertOpen(false);
      }, 4000);
    }
  };

  // Componente de Alertas Interno
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
        icon: <AlertCircle className="w-6 h-6 text-red-600" />, 
        button: 'bg-red-600 hover:bg-red-700',
        text: 'text-red-800'
      },
      warning: { 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200', 
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />, 
        button: 'bg-yellow-600 hover:bg-yellow-700',
        text: 'text-yellow-800'
      },
      info: { 
        bg: 'bg-blue-50', 
        border: 'border-blue-200', 
        icon: <Info className="w-6 h-6 text-blue-600" />, 
        button: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-800'
      }
    };

    const style = alertStyles[alertConfig.type] || alertStyles.info;

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className={`rounded-xl shadow-2xl border-2 ${style.bg} ${style.border} w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100`}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {style.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${style.text} mb-2`}>
                    {alertConfig.title}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {alertConfig.message}
                  </p>
                  
                  {alertConfig.showConfirm ? (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={alertConfig.onConfirm}
                        className={`px-6 py-2 text-white rounded-lg transition ${style.button} font-medium`}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setAlertOpen(false)}
                        className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAlertOpen(false)}
                      className={`mt-4 px-6 py-2 text-white rounded-lg transition ${style.button} font-medium`}
                    >
                      Aceptar
                    </button>
                  )}
                </div>
                {!alertConfig.showConfirm && (
                  <button
                    onClick={() => setAlertOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Función para buscar proveedor en modificación
  const buscarProveedor = () => {
    if (!formModificacion.busqueda.trim()) {
      showAlert('error', 'Búsqueda Requerida', 'Por favor ingrese un nombre o RFC para buscar el proveedor');
      return;
    }

    const proveedor = proveedores.find(p => 
      p.nombre.toLowerCase().includes(formModificacion.busqueda.toLowerCase()) ||
      p.rfc.toLowerCase().includes(formModificacion.busqueda.toLowerCase())
    );

    if (proveedor) {
      setFormModificacion(prev => ({
        ...prev,
        nombre: proveedor.nombre,
        correo: proveedor.correo,
        telefono: proveedor.telefono,
        direccionFiscal: proveedor.direccionFiscal,
        rfc: proveedor.rfc,
        cuentaClabe: proveedor.cuentaClabe,
        banco: proveedor.banco,
        observaciones: proveedor.observaciones,
        tipoUsuario: proveedor.tipoUsuario,
        area: proveedor.area,
        password: proveedor.password,
        ultimaModificacion: proveedor.versiones[proveedor.versiones.length - 1]
      }));
      setProveedorEncontrado(true);
      showAlert('success', 'Proveedor Encontrado', `Se encontró el proveedor: ${proveedor.nombre}`);
    } else {
      showAlert('error', 'Proveedor No Encontrado', 'No se encontró ningún proveedor con los criterios de búsqueda');
      setProveedorEncontrado(false);
    }
  };

  // Handlers para Alta
  const handleAltaChange = (e) => {
    const { name, value } = e.target;
    setFormAlta(prev => ({ ...prev, [name]: value }));
  };

  const handleAltaSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formAlta.nombre || !formAlta.correo || !formAlta.telefono || !formAlta.password) {
      showAlert('error', 'Campos Requeridos', 'Por favor complete todos los campos obligatorios marcados con *');
      return;
    }

    if (formAlta.tipoUsuario === 'interno' && !formAlta.area) {
      showAlert('error', 'Campo Requerido', 'El campo Área es obligatorio para usuarios internos');
      return;
    }

    console.log("Datos de alta:", formAlta);
    
    showAlert('success', 'Proveedor Registrado', 'El proveedor ha sido dado de alta exitosamente en el sistema.');
    
    // Limpiar formulario después del éxito
    setFormAlta({
      nombre: "",
      correo: "",
      telefono: "",
      direccionFiscal: "",
      rfc: "",
      cuentaClabe: "",
      banco: "",
      observaciones: "",
      tipoUsuario: "proveedor",
      area: "",
      password: ""
    });
  };

  // Handlers para Modificación
  const handleModificacionChange = (e) => {
    const { name, value } = e.target;
    setFormModificacion(prev => ({ ...prev, [name]: value }));
  };

  const handleModificacionSubmit = (e) => {
    e.preventDefault();
    
    if (!proveedorEncontrado) {
      showAlert('error', 'Proveedor No Encontrado', 'Primero debe buscar y cargar un proveedor para modificarlo');
      return;
    }

    // Generar descripción de cambios
    const cambios = [];
    if (formModificacion.nombre !== proveedores.find(p => p.rfc === formModificacion.rfc)?.nombre) {
      cambios.push("Nombre actualizado");
    }
    if (formModificacion.correo !== proveedores.find(p => p.rfc === formModificacion.rfc)?.correo) {
      cambios.push("Correo actualizado");
    }
    if (formModificacion.telefono !== proveedores.find(p => p.rfc === formModificacion.rfc)?.telefono) {
      cambios.push("Teléfono actualizado");
    }
    if (formModificacion.observaciones !== proveedores.find(p => p.rfc === formModificacion.rfc)?.observaciones) {
      cambios.push("Observaciones actualizadas");
    }

    const nuevaVersion = {
      version: (formModificacion.ultimaModificacion?.version || 0) + 1,
      fecha: new Date().toISOString().split('T')[0],
      usuario: "admin", // En un sistema real, esto vendría del usuario autenticado
      cambios: cambios.length > 0 ? cambios.join(", ") : "Sin cambios específicos registrados"
    };

    console.log("Datos de modificación:", formModificacion);
    console.log("Nueva versión:", nuevaVersion);
    
    showAlert('success', 'Proveedor Actualizado', `Los datos del proveedor han sido actualizados correctamente. Se registró la versión ${nuevaVersion.version}.`);
    
    // En un sistema real, aquí actualizarías la base de datos
    setFormModificacion({
      busqueda: "",
      nombre: "",
      correo: "",
      telefono: "",
      direccionFiscal: "",
      rfc: "",
      cuentaClabe: "",
      banco: "",
      observaciones: "",
      tipoUsuario: "proveedor",
      area: "",
      password: "",
      cambiosRealizados: [],
      ultimaModificacion: null
    });
    setProveedorEncontrado(false);
  };

  // Handlers para Baja
  const handleBajaChange = (e) => {
    const { name, value } = e.target;
    setFormBaja(prev => ({ 
      ...prev, 
      [name]: value,
      // Si se cambia el motivo y no es "otros", limpiar el campo motivoOtros
      ...(name === 'motivoBaja' && value !== 'otros' && { motivoOtros: '' })
    }));
  };

  const handleBajaSubmit = (e) => {
    e.preventDefault();
    
    if (!formBaja.busqueda || !formBaja.fechaBaja || !formBaja.motivoBaja) {
      showAlert('error', 'Campos Incompletos', 'Por favor complete todos los campos obligatorios');
      return;
    }

    // Validar que si el motivo es "otros", se complete el campo motivoOtros
    if (formBaja.motivoBaja === 'otros' && !formBaja.motivoOtros.trim()) {
      showAlert('error', 'Motivo Requerido', 'Por favor especifique el motivo de la baja');
      return;
    }

    console.log("Datos de baja:", formBaja);
    
    const motivoCompleto = formBaja.motivoBaja === 'otros' 
      ? formBaja.motivoOtros 
      : formBaja.motivoBaja;
    
    showAlert('warning', 
      'Confirmar Baja', 
      `¿Está seguro de dar de baja al proveedor "${formBaja.busqueda}"?\n\nMotivo: ${motivoCompleto}\nFecha: ${formBaja.fechaBaja}\n\nEsta acción cambiará el estatus del proveedor en el sistema.`,
      true,
      () => {
        showAlert('success', 'Proveedor Dado de Baja', 'El proveedor ha sido dado de baja exitosamente del sistema.');
        setFormBaja({
          busqueda: "",
          fechaBaja: "",
          motivoBaja: "",
          motivoOtros: ""
        });
      }
    );
  };

  // Componente para mostrar el historial de versiones
  const HistorialVersiones = ({ ultimaModificacion }) => {
    if (!ultimaModificacion) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Última Modificación
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Versión:</span>
            <span className="font-medium">v{ultimaModificacion.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">{ultimaModificacion.fecha}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Usuario:</span>
            <span className="font-medium flex items-center gap-1">
              <User className="w-3 h-3" />
              {ultimaModificacion.usuario}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Cambios:</span>
            <p className="font-medium mt-1 text-blue-600">{ultimaModificacion.cambios}</p>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar el formulario según el modo
  const renderFormulario = () => {
    switch (mode) {
      case "alta":
        return (
          <form onSubmit={handleAltaSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre o Razón Social *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formAlta.nombre}
                  onChange={handleAltaChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingrese nombre o razón social"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formAlta.correo}
                  onChange={handleAltaChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formAlta.telefono}
                  onChange={handleAltaChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+52 123 456 7890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Usuario *
                </label>
                <select
                  name="tipoUsuario"
                  value={formAlta.tipoUsuario}
                  onChange={handleAltaChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="proveedor">Proveedor Externo</option>
                  <option value="interno">Usuario Interno</option>
                </select>
              </div>

              {formAlta.tipoUsuario === "proveedor" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección Fiscal
                    </label>
                    <input
                      type="text"
                      name="direccionFiscal"
                      value={formAlta.direccionFiscal}
                      onChange={handleAltaChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dirección completa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RFC
                    </label>
                    <input
                      type="text"
                      name="rfc"
                      value={formAlta.rfc}
                      onChange={handleAltaChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ABCD123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuenta CLABE
                    </label>
                    <input
                      type="text"
                      name="cuentaClabe"
                      value={formAlta.cuentaClabe}
                      onChange={handleAltaChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="18 dígitos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banco
                    </label>
                    <input
                      type="text"
                      name="banco"
                      value={formAlta.banco}
                      onChange={handleAltaChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre del banco"
                    />
                  </div>
                </>
              )}

              {formAlta.tipoUsuario === "interno" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área o Departamento *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formAlta.area}
                    onChange={handleAltaChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Recursos Humanos, TI, etc."
                    required
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={formAlta.observaciones}
                  onChange={handleAltaChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formAlta.password}
                  onChange={handleAltaChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 p-1 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                Registrar Proveedor
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        );

      case "modificacion":
        return (
          <form onSubmit={handleModificacionSubmit} className="space-y-6">
            {/* Búsqueda */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Proveedor por Nombre o RFC *
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  name="busqueda"
                  value={formModificacion.busqueda}
                  onChange={handleModificacionChange}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingrese nombre o RFC del proveedor"
                />
                <button
                  type="button"
                  onClick={buscarProveedor}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Buscar
                </button>
              </div>
            </div>

            {proveedorEncontrado && (
              <>
                {/* Historial de versiones */}
                <HistorialVersiones ultimaModificacion={formModificacion.ultimaModificacion} />

                {/* Campos editables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre o Razón Social *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formModificacion.nombre}
                      onChange={handleModificacionChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formModificacion.correo}
                      onChange={handleModificacionChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formModificacion.telefono}
                      onChange={handleModificacionChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Usuario *
                    </label>
                    <select
                      name="tipoUsuario"
                      value={formModificacion.tipoUsuario}
                      onChange={handleModificacionChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="proveedor">Proveedor Externo</option>
                      <option value="interno">Usuario Interno</option>
                    </select>
                  </div>

                  {formModificacion.tipoUsuario === "proveedor" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección Fiscal
                        </label>
                        <input
                          type="text"
                          name="direccionFiscal"
                          value={formModificacion.direccionFiscal}
                          onChange={handleModificacionChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          RFC
                        </label>
                        <input
                          type="text"
                          name="rfc"
                          value={formModificacion.rfc}
                          onChange={handleModificacionChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cuenta CLABE
                        </label>
                        <input
                          type="text"
                          name="cuentaClabe"
                          value={formModificacion.cuentaClabe}
                          onChange={handleModificacionChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banco
                        </label>
                        <input
                          type="text"
                          name="banco"
                          value={formModificacion.banco}
                          onChange={handleModificacionChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {formModificacion.tipoUsuario === "interno" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Área o Departamento *
                      </label>
                      <input
                        type="text"
                        name="area"
                        value={formModificacion.area}
                        onChange={handleModificacionChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      name="observaciones"
                      value={formModificacion.observaciones}
                      onChange={handleModificacionChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Observaciones adicionales..."
                    />
                  </div>

                  {/* Campo de contraseña NO editable - solo lectura */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña (No editable)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value="••••••••"
                        readOnly
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                      <div className="absolute right-3 top-3">
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Protegido
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      La contraseña no puede ser modificada desde este formulario
                    </p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </form>
        );

      case "baja":
        return (
          <form onSubmit={handleBajaSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por Nombre o RFC *
                </label>
                <input
                  type="text"
                  name="busqueda"
                  value={formBaja.busqueda}
                  onChange={handleBajaChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingrese nombre o RFC del proveedor"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Baja *
                </label>
                <input
                  type="date"
                  name="fechaBaja"
                  value={formBaja.fechaBaja}
                  onChange={handleBajaChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de Baja *
                </label>
                <select
                  name="motivoBaja"
                  value={formBaja.motivoBaja}
                  onChange={handleBajaChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccione un motivo</option>
                  <option value="incumplimiento">Incumplimiento de contrato</option>
                  <option value="calidad">Problemas de calidad</option>
                  <option value="financiero">Problemas financieros</option>
                  <option value="mutuo-acuerdo">Mutuo acuerdo</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              {/* Campo para "otros" motivos - solo visible cuando se selecciona "otros" */}
              {formBaja.motivoBaja === 'otros' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especifique el motivo *
                  </label>
                  <textarea
                    name="motivoOtros"
                    value={formBaja.motivoOtros}
                    onChange={handleBajaChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describa el motivo de la baja..."
                    required={formBaja.motivoBaja === 'otros'}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
              >
                Dar de Baja
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600 text-lg">
              Modo no especificado
            </p>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "alta": return "Alta de Proveedores";
      case "modificacion": return "Modificación de Proveedores";
      case "baja": return "Baja de Proveedores";
      default: return "Gestión de Proveedores";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "alta": return "Complete el formulario para registrar un nuevo proveedor o usuario interno en el sistema.";
      case "modificacion": return "Busque un proveedor existente y modifique sus datos. Se registrará un historial de cambios.";
      case "baja": return "Busque un proveedor y complete la información requerida para darle de baja del sistema.";
      default: return "Seleccione una operación para gestionar proveedores.";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>
        <p className="text-gray-600 mt-2">
          {getDescription()}
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        {renderFormulario()}
      </div>

      {/* Alertas Internas */}
      <Alert />
    </div>
  );
}

export default GestionProveedores;