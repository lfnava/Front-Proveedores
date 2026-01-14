import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, XCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdenCompraPro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monto: '',
    fecha: '',
    numeroOrden: '',
    rfc: '',
    observaciones: '',
    ordenesFacturas: [] // Nuevo: array para múltiples documentos de órdenes y facturas
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [documentosSubidos, setDocumentosSubidos] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ 
    type: '', 
    title: '', 
    message: '', 
    showConfirm: false, 
    onConfirm: null 
  });

  // Validaciones
  const validations = {
    monto: (value) => {
      if (!value) return 'El monto es obligatorio';
      const montoRegex = /^\d+(\.\d{1,2})?$/;
      if (!montoRegex.test(value)) return 'Formato de monto inválido (ej: 1500.00)';
      if (parseFloat(value) <= 0) return 'El monto debe ser mayor a 0';
      return null;
    },
    
    fecha: (value) => {
      if (!value) return 'La fecha es obligatoria';
      const fechaSeleccionada = new Date(value);
      const hoy = new Date();
      if (fechaSeleccionada > hoy) return 'La fecha no puede ser futura';
      return null;
    },
    
    numeroOrden: (value) => {
      if (!value) return 'El número de orden es obligatorio';
      if (value.length < 3) return 'El número de orden debe tener al menos 3 caracteres';
      return null;
    },
    
    rfc: (value) => {
      if (!value) return 'El RFC es obligatorio';
      const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
      if (!rfcRegex.test(value)) return 'Formato de RFC inválido';
      return null;
    },
    
    observaciones: (value) => {
      if (value && value.length > 500) return 'Las observaciones no pueden exceder 500 caracteres';
      return null;
    },
    
    // Validación para órdenes y facturas
    ordenesFacturas: (value) => {
      if (!value || value.length === 0) return 'Debe subir al menos una orden de compra o factura (PDF o XML)';
      return null;
    }
  };

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
      }
    };

    const style = alertStyles[alertConfig.type] || alertStyles.success;

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                      if (alertConfig.type === 'success') {
                        // Limpiar formulario después de éxito
                        setFormData({
                          monto: '',
                          fecha: '',
                          numeroOrden: '',
                          rfc: '',
                          observaciones: '',
                          ordenesFacturas: []
                        });
                        setDocumentosSubidos([]);
                        setTouched({});
                      }
                    }}
                    className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 text-white rounded-lg transition ${style.button} font-medium text-sm sm:text-base`}
                  >
                    Aceptar
                  </button>
                </div>
                <button
                  onClick={() => {
                    setAlertOpen(false);
                    if (alertConfig.type === 'success') {
                      // Limpiar formulario después de éxito
                      setFormData({
                        monto: '',
                        fecha: '',
                        numeroOrden: '',
                        rfc: '',
                        observaciones: '',
                        ordenesFacturas: []
                      });
                      setDocumentosSubidos([]);
                      setTouched({});
                    }
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

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validar en tiempo real si el campo ya fue tocado
    if (touched[field]) {
      const error = validations[field](value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const error = validations[field](formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Función para agregar órdenes y facturas
  const handleOrdenesFacturas = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length > 0) {
      const nuevosDocumentos = [];
      const nuevosErrores = [];
      
      files.forEach((file, index) => {
        let isValidType = false;
        let errorMessage = '';
        
        // Validar tipo de archivo (PDF o XML)
        const isPDF = file.type === 'application/pdf';
        const isXML = file.type === 'text/xml' || 
                     file.type === 'application/xml' || 
                     file.name.toLowerCase().endsWith('.xml');
        
        if (isPDF || isXML) {
          isValidType = true;
        } else {
          errorMessage = `El archivo "${file.name}" no es PDF ni XML`;
        }

        // Validar tamaño (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
          errorMessage = `El archivo "${file.name}" excede 10MB`;
          isValidType = false;
        }

        if (isValidType) {
          nuevosDocumentos.push({
            id: Date.now() + index,
            file: file,
            info: {
              nombre: file.name,
              tamaño: (file.size / 1024 / 1024).toFixed(2) + ' MB',
              tipo: isPDF ? 'PDF' : 'XML',
              icono: isPDF ? '📄' : '📋'
            }
          });
        } else {
          nuevosErrores.push(errorMessage);
        }
      });

      // Actualizar documentos subidos
      if (nuevosDocumentos.length > 0) {
        setDocumentosSubidos(prev => [...prev, ...nuevosDocumentos]);
        
        // Actualizar formData
        setFormData(prev => ({
          ...prev,
          ordenesFacturas: [...prev.ordenesFacturas, ...nuevosDocumentos.map(d => d.file)]
        }));

        // Limpiar error si hay documentos válidos
        setErrors(prev => ({
          ...prev,
          ordenesFacturas: null
        }));
      }

      // Mostrar errores si los hay
      if (nuevosErrores.length > 0) {
        showAlert(
          'error',
          'Archivos rechazados',
          `Los siguientes archivos no fueron aceptados:\n${nuevosErrores.join('\n')}`
        );
      }

      // Marcar como tocado
      setTouched(prev => ({
        ...prev,
        ordenesFacturas: true
      }));
    }
  };

  // Función para eliminar un documento
  const handleRemoveDocumento = (id) => {
    const nuevosDocumentos = documentosSubidos.filter(doc => doc.id !== id);
    setDocumentosSubidos(nuevosDocumentos);
    
    // Actualizar formData
    setFormData(prev => ({
      ...prev,
      ordenesFacturas: nuevosDocumentos.map(doc => doc.file)
    }));

    // Validar si quedan documentos
    if (nuevosDocumentos.length === 0) {
      setErrors(prev => ({
        ...prev,
        ordenesFacturas: 'Debe subir al menos una orden de compra o factura (PDF o XML)'
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validar todos los campos
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validations[key](formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // Si no hay errores, proceder con el envío
    if (Object.keys(newErrors).length === 0) {
      console.log('Datos válidos:', formData);
      console.log('Órdenes y facturas:', documentosSubidos);
      
      // Aquí iría la lógica para enviar los datos
      const countPDF = documentosSubidos.filter(d => d.info.tipo === 'PDF').length;
      const countXML = documentosSubidos.filter(d => d.info.tipo === 'XML').length;
      
      showAlert(
        'success', 
        'Registro Completado', 
        `Se han registrado ${documentosSubidos.length} documento(s):\n` +
        `• ${countPDF} PDF(s)\n` +
        `• ${countXML} XML(s)\n\n` +
        `La información ha sido guardada correctamente.`
      );
    } else {
      // Mostrar alerta de error si hay campos inválidos
      const camposConError = Object.keys(newErrors).length;
      showAlert(
        'error', 
        'Error en el Formulario', 
        `Hay ${camposConError} campo(s) que requieren atención. Por favor, revisa la información ingresada.`
      );
    }
  };

  const getFieldStatus = (field) => {
    if (!touched[field]) return 'untouched';
    if (errors[field]) return 'error';
    return 'valid';
  };

  const renderFieldIcon = (field) => {
    const status = getFieldStatus(field);
    
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-beige p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-darkBlue">Registro de Órdenes de Compra y Facturas</h2>
              <p className="text-midBlue">Registra tus órdenes de compra y Facturas</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-lightBlue p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-6">
                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-darkBlue mb-1">
                    Monto en $ *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.monto}
                      onChange={(e) => handleChange('monto', e.target.value)}
                      onBlur={() => handleBlur('monto')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                        getFieldStatus('monto') === 'error' 
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('monto') === 'valid'
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-lightBlue focus:ring-midBlue'
                      }`}
                      placeholder="Ej: 1500.00"
                    />
                    <div className="absolute right-3 top-2">
                      {renderFieldIcon('monto')}
                    </div>
                  </div>
                  {errors.monto && (
                    <p className="text-red-500 text-xs mt-1">{errors.monto}</p>
                  )}
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-darkBlue mb-1">
                    Fecha *
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={formData.fecha}
                      onChange={(e) => handleChange('fecha', e.target.value)}
                      onBlur={() => handleBlur('fecha')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                        getFieldStatus('fecha') === 'error' 
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('fecha') === 'valid'
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-lightBlue focus:ring-midBlue'
                      }`}
                    />
                    <div className="absolute right-3 top-2">
                      {renderFieldIcon('fecha')}
                    </div>
                  </div>
                  {errors.fecha && (
                    <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>
                  )}
                </div>

                {/* Número de Orden */}
                <div>
                  <label className="block text-sm font-medium text-darkBlue mb-1">
                    Número de Orden *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.numeroOrden}
                      onChange={(e) => handleChange('numeroOrden', e.target.value)}
                      onBlur={() => handleBlur('numeroOrden')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                        getFieldStatus('numeroOrden') === 'error' 
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('numeroOrden') === 'valid'
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-lightBlue focus:ring-midBlue'
                      }`}
                      placeholder="Ej: OC-2024-001"
                    />
                    <div className="absolute right-3 top-2">
                      {renderFieldIcon('numeroOrden')}
                    </div>
                  </div>
                  {errors.numeroOrden && (
                    <p className="text-red-500 text-xs mt-1">{errors.numeroOrden}</p>
                  )}
                </div>

                {/* RFC */}
                <div>
                  <label className="block text-sm font-medium text-darkBlue mb-1">
                    RFC *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.rfc}
                      onChange={(e) => handleChange('rfc', e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('rfc')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                        getFieldStatus('rfc') === 'error' 
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('rfc') === 'valid'
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-lightBlue focus:ring-midBlue'
                      }`}
                      placeholder="Ej: ABC123456789"
                      maxLength={13}
                    />
                    <div className="absolute right-3 top-2">
                      {renderFieldIcon('rfc')}
                    </div>
                  </div>
                  {errors.rfc && (
                    <p className="text-red-500 text-xs mt-1">{errors.rfc}</p>
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-6">
                {/* Observaciones */}
                <div>
                  <label className="block text-sm font-medium text-darkBlue mb-1">
                    Observaciones
                  </label>
                  <div className="relative">
                    <textarea 
                      value={formData.observaciones}
                      onChange={(e) => handleChange('observaciones', e.target.value)}
                      onBlur={() => handleBlur('observaciones')}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                        getFieldStatus('observaciones') === 'error' 
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('observaciones') === 'valid'
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-lightBlue focus:ring-midBlue'
                      }`}
                      placeholder="Agregar Informacion de la Orden de Compra y Factura"
                    />
                    <div className="absolute right-3 top-2">
                      {renderFieldIcon('observaciones')}
                    </div>
                  </div>
                  {errors.observaciones && (
                    <p className="text-red-500 text-xs mt-1">{errors.observaciones}</p>
                  )}
                  <div className="text-right text-xs text-midBlue mt-1">
                    {formData.observaciones.length}/500 caracteres
                  </div>
                </div>

                {/* NUEVO: Ordenes de Compra y Facturas (múltiples) */}
                <div>
                  <label className="block text-sm font-medium text-darkBlue mb-1">
                    Ordenes de Compra y Facturas (PDF y/o XML) *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center transition ${
                    errors.ordenesFacturas && documentosSubidos.length === 0
                      ? 'border-red-500 bg-red-50' 
                      : documentosSubidos.length > 0
                      ? 'border-green-500 bg-green-50'
                      : 'border-lightBlue hover:border-midBlue'
                  }`}>
                    <div className="mb-4">
                      <Upload className="w-8 h-8 text-midBlue mx-auto mb-2" />
                      <p className="text-sm text-darkBlue mb-2">
                        Sube órdenes de compra y/o facturas
                      </p>
                      <p className="text-xs text-midBlue">
                        Máximo 10MB por archivo - Mínimo 1 documento
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="ordenes-facturas"
                        accept=".pdf,.xml"
                        multiple
                        onChange={handleOrdenesFacturas}
                      />
                      <label
                        htmlFor="ordenes-facturas"
                        className="inline-block mt-2 px-4 py-2 bg-midBlue text-white rounded-lg hover:bg-darkBlue transition cursor-pointer text-sm"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Agregar Documentos
                      </label>
                    </div>

                    {/* Lista de documentos subidos */}
                    {documentosSubidos.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium text-darkBlue mb-2">
                          Documentos subidos ({documentosSubidos.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {documentosSubidos.map((doc) => (
                            <div 
                              key={doc.id} 
                              className="flex items-center justify-between bg-gray-50 p-2 rounded hover:bg-gray-100 transition"
                            >
                              <div className="flex items-center flex-1 min-w-0">
                                <span className="mr-2 text-lg">{doc.info.icono}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-darkBlue truncate" title={doc.info.nombre}>
                                    {doc.info.nombre}
                                  </p>
                                  <div className="flex items-center text-xs text-midBlue">
                                    <span>{doc.info.tamaño}</span>
                                    <span className="mx-1">•</span>
                                    <span className={`px-1.5 py-0.5 rounded text-xs ${doc.info.tipo === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                      {doc.info.tipo}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocumento(doc.id)}
                                className="ml-2 text-red-500 hover:text-red-700 transition flex-shrink-0"
                                title="Eliminar documento"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.ordenesFacturas && (
                    <p className="text-red-500 text-xs mt-1">{errors.ordenesFacturas}</p>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-midBlue">
                      {documentosSubidos.length} documento(s) subido(s)
                    </div>
                    {documentosSubidos.length > 0 && (
                      <div className="text-xs text-midBlue">
                        {documentosSubidos.filter(d => d.info.tipo === 'PDF').length} PDF •{' '}
                        {documentosSubidos.filter(d => d.info.tipo === 'XML').length} XML
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-lightBlue">
              <button 
                type="submit"
                className="px-6 py-2 bg-midBlue text-white rounded-lg hover:bg-darkBlue transition"
              >
                Registrar Orden de Compra y Facturas
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Alertas */}
      <Alert />
    </div>
  );
};

export default OrdenCompraPro;