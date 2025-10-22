import { Routes, Route } from "react-router-dom";
import Login from "./routes/Login.jsx";
import Autentificacion from "./routes/Autentificacion.jsx";
import CambioPass from "./routes/CambioPass.jsx";
import DashboardAdmin from "./routes/DashboardAdmin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/autentificacion" element={<Autentificacion />} />
        <Route path="/cambio-pass" element={<CambioPass />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />

    </Routes>
  );
}

export default App;
