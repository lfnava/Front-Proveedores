import React, { useState } from "react";
import { FileText, Download, Eye, Trash2, Plus, Edit, AlertCircle, CheckCircle2, Info, X } from "lucide-react";

// Componente de gráficas y tabla para usar directamente en el dashboard
function Graficas({ showAlert }) {
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

  const [editingComment, setEditingComment] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Datos de ejemplo para las gráficas
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

  // FUNCIONES CRUD
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

  // Función para descargar documentos
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

  // Componente de gráfica de pastel
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

      {/* GRÁFICAS */}
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

      {/* TABLA */}
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
}

export default Graficas;