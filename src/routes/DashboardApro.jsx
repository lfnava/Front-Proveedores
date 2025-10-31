function DashboardApro() {
  return (
    <div className="min-h-screen bg-beige flex flex-col items-center justify-center p-8">
      <h1 className="text-darkBlue text-4xl font-bold mb-4">
        Dashboard de Aprobaciones 📊
      </h1>
      <p className="text-midBlue text-lg mb-6">
        Resumen general de las solicitudes aprobadas y pendientes.
      </p>

      <div className="bg-lightBlue rounded-2xl shadow-md p-6 w-3/4">
        <h2 className="text-darkBlue text-2xl font-semibold mb-2">Resumen rápido</h2>
        <p className="text-darkBlue">Próximamente se mostrarán estadísticas aquí.</p>
      </div>
    </div>
  );
}

export default DashboardApro;
