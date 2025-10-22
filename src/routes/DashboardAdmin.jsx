function DashboardAdmin() {
  return (
    <div className="min-h-screen bg-beige flex flex-col items-center justify-center">
      <h1 className="text-darkBlue text-4xl font-bold mb-4">
        Panel de Administración 🧭
      </h1>
      <p className="text-midBlue text-lg mb-6">
        Bienvenido, admin. Aquí podrás gestionar todo el sistema.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-3/4">
        <div className="bg-lightBlue rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <h2 className="text-darkBlue text-xl font-semibold mb-2">Usuarios</h2>
          <p className="text-darkBlue">Gestiona los usuarios registrados en el sistema.</p>
        </div>

        <div className="bg-lightBlue rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <h2 className="text-darkBlue text-xl font-semibold mb-2">Solicitudes</h2>
          <p className="text-darkBlue">Revisa y aprueba las solicitudes recientes.</p>
        </div>

        <div className="bg-lightBlue rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <h2 className="text-darkBlue text-xl font-semibold mb-2">Configuración</h2>
          <p className="text-darkBlue">Administra las preferencias del sistema.</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
