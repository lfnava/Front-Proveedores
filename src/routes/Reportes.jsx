function Reportes() {
  return (
    <div className="min-h-screen bg-beige p-10">
      {/* Título principal */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-darkBlue mb-3">📑 Reportes de Facturas</h1>
        <p className="text-midBlue text-lg">Consulta el estado de las facturas aprobadas y rechazadas</p>
      </div>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* 🟩 Facturas Aprobadas */}
        <div className="bg-white border border-lightBlue rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-3xl font-semibold text-darkBlue mb-6 flex items-center gap-2">
            ✅ Facturas Aprobadas
          </h2>
          <p className="text-midBlue mb-6">
            Estas son las facturas que han pasado el proceso de revisión y aprobación.
          </p>

          {/* Tabla simulada */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-lightBlue text-darkBlue">
                  <th className="p-4">#</th>
                  <th className="p-4">Proveedor</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-blue-50 transition">
                  <td className="p-4">001</td>
                  <td className="p-4">Proveedor A</td>
                  <td className="p-4">$12,000</td>
                  <td className="p-4">2025-10-01</td>
                </tr>
                <tr className="border-t hover:bg-blue-50 transition">
                  <td className="p-4">002</td>
                  <td className="p-4">Proveedor B</td>
                  <td className="p-4">$8,500</td>
                  <td className="p-4">2025-10-03</td>
                </tr>
                <tr className="border-t hover:bg-blue-50 transition">
                  <td className="p-4">003</td>
                  <td className="p-4">Proveedor C</td>
                  <td className="p-4">$15,250</td>
                  <td className="p-4">2025-10-08</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 🟥 Facturas Rechazadas */}
        <div className="bg-white border border-lightBlue rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-3xl font-semibold text-darkBlue mb-6 flex items-center gap-2">
            ❌ Facturas Rechazadas
          </h2>
          <p className="text-midBlue mb-6">
            Estas son las facturas que no cumplieron con los criterios de aprobación.
          </p>

          {/* Tabla simulada */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-lightBlue text-darkBlue">
                  <th className="p-4">#</th>
                  <th className="p-4">Proveedor</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Motivo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-red-50 transition">
                  <td className="p-4">004</td>
                  <td className="p-4">Proveedor D</td>
                  <td className="p-4">$5,700</td>
                  <td className="p-4">Factura duplicada</td>
                </tr>
                <tr className="border-t hover:bg-red-50 transition">
                  <td className="p-4">005</td>
                  <td className="p-4">Proveedor E</td>
                  <td className="p-4">$9,800</td>
                  <td className="p-4">Datos inconsistentes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
