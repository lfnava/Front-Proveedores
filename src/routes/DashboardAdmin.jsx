import React, { useState } from "react";
import {
  Users,
  FileText,
  Settings,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserCog,
  ClipboardList,
  FileCheck,
  FileMinus,
  FileEdit,
  FileSearch,
  LogOut,
  User,
  X,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Info
} from "lucide-react";

// Importar tus componentes (ajusta las rutas según tu estructura)
import ExpedientesDigitales from './ExpedientesDigitales';
import GestionProveedores from './GestionProveedores';
import Usuarios from './Usuarios';
import VerificacionR from './VerificacionR';

function DashboardAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("inicio");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: '', title: '', message: '', showConfirm: false, onConfirm: null });

  // Datos de ejemplo para las gráficas ACTUALIZADOS
  const chartData = {
    proveedores: {
      aprobado: 45,
      rechazado: 23,
    },
    facturas: {
      aprobadas: 89,
      rechazadas: 15,
      "pendientes por pagar": 32,
      pagadas: 156,
    },
    contratos: {
      nuevos: 12,
      "en aviso": 8,
      vencidos: 5,
    },
    ordenesCompra: {
      retrasadas: 7,
      aprobadas: 45,
      rechazadas: 10,
    },
  };

  // Datos de ejemplo para la tabla
  const [tableData, setTableData] = useState([
    {
      id: 1,
      proveedor: "Tecnología Avanzada SA",
      facturas: [{ id: 1, nombre: "factura_001.pdf", tamaño: "2.3 MB" }, { id: 2, nombre: "factura_002.pdf", tamaño: "1.8 MB" }],
      ordenesCompra: [{ id: 1, nombre: "oc_001.pdf", tamaño: "3.1 MB" }],
      documentosRespaldo: [{ id: 1, nombre: "contrato.pdf", tamaño: "4.2 MB" }, { id: 2, nombre: "certificado.pdf", tamaño: "1.5 MB" }],
      estatus: "Activo",
      categoria: "Tecnología",
      comentarios: ["Excelente servicio", "Entrega puntual"]
    },
    {
      id: 2,
      proveedor: "Suministros Industriales MX",
      facturas: [{ id: 1, nombre: "factura_003.pdf", tamaño: "2.1 MB" }],
      ordenesCompra: [{ id: 1, nombre: "oc_002.pdf", tamaño: "2.8 MB" }, { id: 2, nombre: "oc_003.pdf", tamaño: "3.0 MB" }],
      documentosRespaldo: [{ id: 1, nombre: "garantia.pdf", tamaño: "2.5 MB" }],
      estatus: "Activo",
      categoria: "Industrial",
      comentarios: ["Buen precio", "Atención rápida"]
    },
    {
      id: 3,
      proveedor: "Servicios Corporativos SC",
      facturas: [{ id: 1, nombre: "factura_004.pdf", tamaño: "2.4 MB" }, { id: 2, nombre: "factura_005.pdf", tamaño: "2.0 MB" }],
      ordenesCompra: [{ id: 1, nombre: "oc_004.pdf", tamaño: "3.2 MB" }],
      documentosRespaldo: [{ id: 1, nombre: "acuerdo.pdf", tamaño: "3.8 MB" }, { id: 2, nombre: "polizas.pdf", tamaño: "2.9 MB" }],
      estatus: "En revisión",
      categoria: "Servicios",
      comentarios: ["En proceso de evaluación"]
    }
  ]);

  // MENÚ ACTUALIZADO - Eliminadas las opciones de Órdenes de Compra, Aprobaciones y Facturas
  const menuItems = [
    {
      id: "gestion-proveedores",
      title: "Gestión de Proveedores",
      icon: <Users className="w-5 h-5" />,
      submenu: [
        { id: "altas", title: "Altas", icon: <FileCheck className="w-4 h-4" /> },
        { id: "bajas", title: "Bajas", icon: <FileMinus className="w-4 h-4" /> },
        { id: "modificaciones", title: "Modificaciones", icon: <FileEdit className="w-4 h-4" /> },
      ],
    },
    {
      id: "expedientes-digitales",
      title: "Expedientes Digitales",
      icon: <ClipboardList className="w-5 h-5" />,
      // SUBMENÚ ELIMINADO - Ahora es un solo elemento
    },
    {
      id: "usuarios",
      title: "Usuarios",
      icon: <UserCog className="w-5 h-5" />,
      submenu: [{ id: "administracion", title: "Administración", icon: <Settings className="w-4 h-4" /> }],
    },
    {
      id: "verificacion-rapida",
      title: "Verificación Rápida",
      icon: <FileSearch className="w-5 h-5" />,
    },
  ];

  // Mapeo de modales a componentes ACTUALIZADO
  const modalComponents = {
    // Gestión de Proveedores
    "altas": { component: GestionProveedores, title: "Altas de Proveedores", props: { mode: 'alta' } },
    "bajas": { component: GestionProveedores, title: "Bajas de Proveedores", props: { mode: 'baja' } },
    "modificaciones": { component: GestionProveedores, title: "Modificación de Proveedores", props: { mode: 'modificacion' } },
    
    // Expedientes Digitales - Ahora es un solo modal
    "expedientes-digitales": { component: ExpedientesDigitales, title: "Expedientes Digitales", props: {} },
    
    // Usuarios
    "administracion": { component: Usuarios, title: "Administración de Usuarios", props: {} },
    
    // Verificación Rápida
    "verificacion-rapida": { component: VerificacionR, title: "Verificación Rápida", props: {} }
  };

  // Función para mostrar alertas centradas
  const showAlert = (type, title, message, showConfirm = false, onConfirm = null) => {
    setAlertConfig({ type, title, message, showConfirm, onConfirm });
    setAlertOpen(true);
    
    if ((type === 'success' || type === 'info') && !showConfirm) {
      setTimeout(() => {
        setAlertOpen(false);
      }, 4000);
    }
  };

  // Función para abrir modal
  const openModal = (sectionId) => {
    setCurrentModal(sectionId);
    setModalOpen(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentModal("");
  };

  // FUNCIONES CRUD SIMPLIFICADAS
  const handleDelete = (id) => {
    const proveedor = tableData.find(p => p.id === id);
    showAlert('warning', 
      'Confirmar Eliminación', 
      `¿Estás seguro de que quieres eliminar a "${proveedor?.proveedor}"? Esta acción no se puede deshacer.`,
      true,
      () => {
        setTableData(tableData.filter(item => item.id !== id));
        showAlert('success', 'Eliminado', 'El proveedor ha sido eliminado correctamente');
      }
    );
  };

  const handleView = (id) => {
    const proveedor = tableData.find(p => p.id === id);
    showAlert('info', 'Detalles del Proveedor', 
      `Nombre: ${proveedor.proveedor}\nCategoría: ${proveedor.categoria}\nEstatus: ${proveedor.estatus}\nComentarios: ${proveedor.comentarios.length}`);
  };

  // Función CORREGIDA para descargar documentos
  const handleDownload = (documento, tipo) => {
    try {
      const contenido = `Documento: ${documento.nombre}\nTipo: ${tipo}\nTamaño: ${documento.tamaño}\nFecha: ${new Date().toLocaleDateString()}\n\nEste es un documento de ejemplo.`;
      
      const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = documento.nombre;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showAlert('success', 'Descarga Completada', `${documento.nombre} se ha descargado correctamente`);
    } catch (error) {
      console.error('Error al descargar:', error);
      showAlert('error', 'Error en Descarga', 'Hubo un problema al descargar el documento');
    }
  };

  // Funciones para comentarios
  const startEditingComment = (proveedorId, commentIndex = null) => {
    setEditingComment({ proveedorId, commentIndex });
    if (commentIndex !== null) {
      setCommentText(tableData.find(p => p.id === proveedorId)?.comentarios[commentIndex] || "");
    } else {
      setCommentText("");
    }
  };

  const saveComment = (proveedorId) => {
    if (commentText.trim()) {
      setTableData(prevData => 
        prevData.map(proveedor => 
          proveedor.id === proveedorId 
            ? {
                ...proveedor,
                comentarios: editingComment.commentIndex !== null 
                  ? proveedor.comentarios.map((comment, idx) => 
                      idx === editingComment.commentIndex ? commentText : comment
                    )
                  : [...proveedor.comentarios, commentText]
              }
            : proveedor
        )
      );
      setEditingComment(null);
      setCommentText("");
      showAlert('success', 'Comentario Guardado', 'El comentario se ha guardado correctamente');
    }
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setCommentText("");
  };

  const deleteComment = (proveedorId, commentIndex) => {
    const comentario = tableData.find(p => p.id === proveedorId)?.comentarios[commentIndex];
    showAlert('warning',
      'Eliminar Comentario',
      `¿Estás seguro de que quieres eliminar este comentario?`,
      true,
      () => {
        setTableData(prevData =>
          prevData.map(proveedor =>
            proveedor.id === proveedorId
              ? {
                  ...proveedor,
                  comentarios: proveedor.comentarios.filter((_, idx) => idx !== commentIndex)
                }
              : proveedor
          )
        );
        showAlert('success', 'Comentario Eliminado', 'El comentario ha sido eliminado');
      }
    );
  };

  // Componente de Alertas Centradas
  const Alert = ({ isOpen, onClose, type, title, message, showConfirm = false, onConfirm }) => {
    if (!isOpen) return null;

    const alertStyles = {
      success: { 
        bg: 'bg-green-50', 
        border: 'border-green-200', 
        icon: <CheckCircle2 className="w-6 h-6 text-green-600" />, 
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
        icon: <AlertCircle className="w-6 h-6 text-yellow-600" />, 
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

    const style = alertStyles[type] || alertStyles.info;

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
                  <h3 className={`text-lg font-semibold ${style.text} mb-2`}>{title}</h3>
                  <p className="text-gray-700 whitespace-pre-line">{message}</p>
                  
                  {showConfirm ? (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={onConfirm}
                        className={`px-6 py-2 text-white rounded-lg transition ${style.button} font-medium`}
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={onClose}
                      className={`mt-4 px-6 py-2 text-white rounded-lg transition ${style.button} font-medium`}
                    >
                      Aceptar
                    </button>
                  )}
                </div>
                {!showConfirm && (
                  <button
                    onClick={onClose}
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

  // Función para obtener colores según la categoría y estado
  const getChartColors = (chartType, labels) => {
    const colorMap = {
      verde: '#10b981',
      rojo: '#ef4444',
      amarillo: '#f59e0b',
      azul: '#3b82f6', 
      verdeo: '#045338ff'
    };

    const colorRules = {
      proveedores: {
        'aprobado': colorMap.verde,
        'rechazado': colorMap.rojo
      },
      facturas: {
        'aprobadas': colorMap.verde,
        'rechazadas': colorMap.rojo,
        'pendientes por pagar': colorMap.amarillo,
        'pagadas': colorMap.verdeo
      },
      contratos: {
        'nuevos': colorMap.azul,
        'en aviso': colorMap.amarillo,
        'vencidos': colorMap.rojo
      },
      ordenesCompra: {
        'retrasadas': colorMap.amarillo,
        'aprobadas': colorMap.verde,
        'rechazadas': colorMap.rojo
      }
    };

    return labels.map(label => colorRules[chartType]?.[label] || '#6b7280');
  };

  // Componente de gráfica de pastel ACTUALIZADO
  const PieChart = ({ data, title, chartType }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const labels = Object.keys(data);
    const colors = getChartColors(chartType, labels);
    
    return (
      <div className="bg-white p-6 rounded-xl border border-lightBlue shadow-lg">
        <h3 className="text-lg font-semibold text-darkBlue mb-4 text-center">{title}</h3>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative w-40 h-40 mx-auto">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              {Object.values(data).map((value, index) => {
                const percentage = (value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const previousPercentages = Object.values(data)
                  .slice(0, index)
                  .reduce((sum, val) => sum + (val / total) * 100, 0);
                const strokeDashoffset = 100 - previousPercentages;

                return (
                  <circle
                    key={index}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="transparent"
                    stroke={colors[index]}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-darkBlue">
                {total}
              </span>
              <span className="text-sm text-midBlue">Total</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            {Object.entries(data).map(([key, value], index) => {
              const percentage = ((value / total) * 100).toFixed(1);
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: colors[index] }}
                    ></div>
                    <span className="text-xs text-darkBlue capitalize">
                      {key}:
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-xs font-semibold text-midBlue block">
                      {value}
                    </span>
                    <span className="text-xs text-midBlue">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Componente del Modal MEJORADO que carga tus componentes
  const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const modalConfig = modalComponents[currentModal];
    
    const renderModalContent = () => {
      if (modalConfig) {
        const ModalComponent = modalConfig.component;
        return <ModalComponent {...modalConfig.props} onClose={onClose} />;
      }
      
      // Fallback para modales no configurados
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-lightBlue rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-midBlue" />
          </div>
          <p className="text-midBlue text-lg">
            Contenido de {currentModal}
          </p>
          <p className="text-darkBlue mt-2">
            Esta sección se cargará desde un archivo separado
          </p>
        </div>
      );
    };

    return (
      <>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-midBlue to-darkBlue px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {modalConfig?.title || currentModal}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-0 overflow-y-auto max-h-[80vh]">
              {renderModalContent()}
            </div>
          </div>
        </div>
      </>
    );
  };

  // Componente para mostrar documentos descargables
  const DocumentList = ({ documentos, tipo }) => (
    <div className="space-y-2">
      {documentos.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between group">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="w-4 h-4 text-midBlue flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-darkBlue truncate">{doc.nombre}</p>
              <p className="text-xs text-gray-500">{doc.tamaño}</p>
            </div>
          </div>
          <button
            onClick={() => handleDownload(doc, tipo)}
            className="p-2 text-midBlue hover:text-darkBlue hover:bg-lightBlue rounded transition ml-2 flex-shrink-0"
            title="Descargar"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ))}
      {documentos.length === 0 && (
        <span className="text-xs text-gray-400 italic">No hay documentos</span>
      )}
    </div>
  );

  // Componente para comentarios
  const CommentsSection = ({ proveedor }) => {
    const isEditing = editingComment?.proveedorId === proveedor.id;

    return (
      <div className="space-y-2">
        {proveedor.comentarios.map((comentario, index) => (
          <div key={index} className="flex items-start justify-between group">
            {isEditing && editingComment.commentIndex === index ? (
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full text-xs p-2 border border-lightBlue rounded resize-none focus:border-midBlue focus:outline-none"
                  rows="2"
                  placeholder="Escribe tu comentario..."
                />
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={() => saveComment(proveedor.id)}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                  >
                    ✓ Guardar
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-xs text-darkBlue bg-lightBlue p-2 rounded">
                    {comentario}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                  <button
                    onClick={() => startEditingComment(proveedor.id, index)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteComment(proveedor.id, index)}
                    className="p-1 text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {isEditing && editingComment.commentIndex === null ? (
          <div className="space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe un nuevo comentario..."
              className="w-full text-xs p-2 border border-lightBlue rounded resize-none focus:border-midBlue focus:outline-none"
              rows="2"
            />
            <div className="flex gap-2">
              <button
                onClick={() => saveComment(proveedor.id)}
                className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                ✓ Agregar
              </button>
              <button
                onClick={cancelEditing}
                className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
              >
                ✕ Cancelar
              </button>
            </div>
          </div>
        ) : (
          !isEditing && (
            <button
              onClick={() => startEditingComment(proveedor.id, null)}
              className="flex items-center gap-2 text-xs text-midBlue hover:text-darkBlue transition w-full justify-center py-1 border border-dashed border-lightBlue rounded hover:border-midBlue"
            >
              <Plus className="w-3 h-3" />
              Agregar comentario
            </button>
          )
        )}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-darkBlue mb-3">
            Resumen General del Sistema
          </h2>
          <p className="text-midBlue text-lg">
            Estadísticas y métricas clave en tiempo real
          </p>
        </div>

        {/* GRÁFICAS ACTUALIZADAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          <PieChart
            title="Proveedores"
            data={chartData.proveedores}
            chartType="proveedores"
          />
          <PieChart
            title="Facturas"
            data={chartData.facturas}
            chartType="facturas"
          />
          <PieChart
            title="Contratos"
            data={chartData.contratos}
            chartType="contratos"
          />
          <PieChart
            title="Órdenes de Compra"
            data={chartData.ordenesCompra}
            chartType="ordenesCompra"
          />
        </div>

        {/* TABLA SIMPLIFICADA */}
        <div className="bg-white rounded-xl border border-lightBlue shadow-lg overflow-hidden">
          <div className="p-6 border-b border-lightBlue">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-darkBlue">
                  Gestión de Proveedores
                </h3>
                <p className="text-sm text-midBlue mt-1">
                  Lista completa de proveedores registrados
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-lightBlue">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                    Facturas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                    Órdenes de Compra
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                    Documentos Respaldo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                    Acciones
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-darkBlue uppercase tracking-wider">
                    Comentarios
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBlue">
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-lightBlue hover:bg-opacity-30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-darkBlue">
                          {row.proveedor}
                        </div>
                        <div className="text-xs text-midBlue">
                          {row.categoria}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                          row.estatus === 'Activo' 
                            ? 'bg-green-100 text-green-800'
                            : row.estatus === 'En revisión'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.estatus}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <DocumentList documentos={row.facturas} tipo="facturas" />
                    </td>
                    
                    <td className="px-6 py-4">
                      <DocumentList documentos={row.ordenesCompra} tipo="ordenes-compra" />
                    </td>
                    
                    <td className="px-6 py-4">
                      <DocumentList documentos={row.documentosRespaldo} tipo="documentos-respaldo" />
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(row.id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <CommentsSection proveedor={row} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-beige">
      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-lightBlue shadow-lg transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/logo-relleno.png"
                alt="Logo"
                className="h-8 object-contain"
              />
              <span className="font-semibold text-darkBlue">Gestión de Proveedores</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-lightBlue transition"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-darkBlue" />
            ) : (
              <ChevronRight className="w-5 h-5 text-darkBlue" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.submenu) {
                    openModal(item.submenu[0].id);
                  } else {
                    openModal(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  currentModal === item.id ||
                  item.submenu?.some((s) => s.id === currentModal)
                    ? "bg-lightBlue text-darkBlue border border-midBlue"
                    : "text-darkBlue hover:bg-lightBlue"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  currentModal === item.id ||
                  item.submenu?.some((s) => s.id === currentModal)
                    ? "bg-midBlue text-white"
                    : "bg-lightBlue text-darkBlue"
                }`}>
                  {item.icon}
                </div>
                {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
              </button>

              {/* SUBMENÚ SOLO PARA ITEMS QUE LO TIENEN */}
              {sidebarOpen && item.submenu && (
                <div className="ml-4 mt-2 space-y-1 border-l border-lightBlue pl-4">
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => openModal(sub.id)}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                        currentModal === sub.id
                          ? "text-midBlue font-medium"
                          : "text-darkBlue hover:text-midBlue"
                      }`}
                    >
                      {sub.icon}
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-darkBlue">
              Panel de Administración
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:bg-lightBlue rounded-lg p-2 transition"
              >
                <div className="text-right">
                  <span className="text-sm font-medium text-darkBlue block">Administrador</span>
                </div>
                <div className="w-10 h-10 bg-midBlue text-white rounded-full flex items-center justify-center font-semibold shadow-lg">
                  A
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-lightBlue py-2 z-50">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-darkBlue hover:bg-lightBlue transition">
                    <User className="w-4 h-4" />
                    <span>Perfil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-darkBlue hover:bg-lightBlue transition">
                    <LogOut className="w-4 h-4" />
                    <span>Salir</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </section>
      </main>

      {/* MODAL MEJORADO que carga tus componentes */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
      />

      {/* ALERTAS CENTRADAS */}
      <Alert
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        showConfirm={alertConfig.showConfirm}
        onConfirm={alertConfig.onConfirm}
      />

      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardAdmin;