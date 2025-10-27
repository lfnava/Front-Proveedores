import { Routes, Route } from "react-router-dom";
import Login from "./routes/Login.jsx";
import Autentificacion from "./routes/Autentificacion.jsx";
import CambioPass from "./routes/CambioPass.jsx";
import DashboardAdmin from "./routes/DashboardAdmin.jsx";
import ExpedientesDigitales from "./routes/ExpedientesDigitales.jsx";
import GestionProveedores from "./routes/GestionProveedores.jsx";
import Usuarios from "./routes/Usuarios.jsx";
import VerificacionR from "./routes/VerificacionR.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/autentificacion" element={<Autentificacion />} />
        <Route path="/cambio-pass" element={<CambioPass />} />
        <Route path="/dashboarda" element={<DashboardAdmin />} />
        <Route path="/expedientes" element={<ExpedientesDigitales />} />
        <Route path="/gestionpro" element={<GestionProveedores />} />
        <Route path="/usarios" element={<Usuarios />} />
        <Route path="/verificacior" element={<VerificacionR />} />
    </Routes>
  );
}

export default App;
 