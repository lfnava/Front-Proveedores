import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);
  const [showRequestAccess, setShowRequestAccess] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [requestAccessData, setRequestAccessData] = useState({
    nombre: "",
    correo: "",
    tipo: "usuario",
    subtipo: "",
    area: "",
    empresa: "",
    rfc: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validaciones
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateRFC = (rfc) => /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/.test(rfc);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "El correo es requerido";
    else if (!validateEmail(formData.email)) newErrors.email = "Correo no válido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular autenticación (aquí iría tu API real)
      console.log("Login exitoso:", formData);
      
      // Navegar a Autentificacion después del login exitoso
      setTimeout(() => {
        navigate("/autentificacion");
      }, 1000);
      
    } catch (error) {
      console.error("Error en login:", error);
      setErrors({ general: "Error al iniciar sesión" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!forgotEmail) newErrors.forgotEmail = "El correo es requerido";
    else if (!validateEmail(forgotEmail)) newErrors.forgotEmail = "Correo no válido";

    if (Object.keys(newErrors).length === 0) {
      alert(`Se ha enviado un enlace de recuperación a ${forgotEmail}`);
      setShowForgot(false);
      setForgotEmail("");
    } else setErrors(newErrors);
  };

  const handleRequestAccessChange = (e) => {
    const { name, value } = e.target;
    setRequestAccessData(prev => ({ 
      ...prev, 
      [name]: value,
      // Limpiar campos cuando cambia el tipo o subtipo
      ...(name === 'tipo' && value !== 'proveedor' && { subtipo: '', empresa: '', rfc: '', correo: '' }),
      ...(name === 'subtipo' && { nombre: '', empresa: '', rfc: '', correo: '' })
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRequestAccessSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones por tipo de usuario
    if (requestAccessData.tipo === "usuario") {
      if (!requestAccessData.nombre.trim()) newErrors.nombre = "Nombre requerido";
      if (!requestAccessData.area) newErrors.area = "Área requerida";
      if (!requestAccessData.correo.trim()) newErrors.correo = "Correo requerido";
      else if (!validateEmail(requestAccessData.correo)) newErrors.correo = "Correo no válido";
    } 
    else if (requestAccessData.tipo === "proveedor") {
      if (!requestAccessData.subtipo) newErrors.subtipo = "Selecciona el tipo de proveedor";
      else {
        if (!requestAccessData.correo.trim()) newErrors.correo = "Correo requerido";
        else if (!validateEmail(requestAccessData.correo)) newErrors.correo = "Correo no válido";
        
        if (requestAccessData.subtipo === "fisica") {
          if (!requestAccessData.nombre.trim()) newErrors.nombre = "Nombre requerido";
          if (!requestAccessData.rfc.trim()) newErrors.rfc = "RFC requerido";
          else if (!validateRFC(requestAccessData.rfc)) newErrors.rfc = "RFC inválido";
        } 
        else if (requestAccessData.subtipo === "moral") {
          if (!requestAccessData.empresa.trim()) newErrors.empresa = "Empresa requerida";
          if (!requestAccessData.rfc.trim()) newErrors.rfc = "RFC requerido";
          else if (!validateRFC(requestAccessData.rfc)) newErrors.rfc = "RFC inválido";
        }
      }
    }

    if (Object.keys(newErrors).length === 0) {
      alert("Solicitud de acceso enviada correctamente");
      setShowRequestAccess(false);
      setRequestAccessData({ 
        nombre: "", 
        correo: "", 
        tipo: "usuario", 
        subtipo: "", 
        area: "", 
        empresa: "", 
        rfc: "" 
      });
    } else setErrors(newErrors);
  };

  const closeModal = (modalType) => {
    if (modalType === "forgot") {
      setShowForgot(false);
      setForgotEmail("");
    } else if (modalType === "request") {
      setShowRequestAccess(false);
    }
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-lightBlue p-8">
        {/* Logo arriba del todo */}
        <div className="text-center mb-8">
          <img 
            src="/src/assets/logo-relleno.png" 
            alt="Logo" 
            className="w-24 h-24 object-contain mx-auto mb-4"
            onError={(e) => {
              console.log("Error cargando imagen");
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-2xl font-bold text-darkBlue mb-2">Iniciar Sesión</h1>
          <p className="text-midBlue text-sm">Sistema de Gestión de Proveedores</p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleLoginSubmit} className="space-y-5 mb-6">
          <div className="space-y-2">
            <label className="block text-darkBlue font-semibold text-sm">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleLoginChange}
              placeholder="tu@correo.com"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                errors.email ? "border-red-500 bg-red-50" : "border-lightBlue hover:border-midBlue"
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-darkBlue font-semibold text-sm">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleLoginChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                errors.password ? "border-red-500 bg-red-50" : "border-lightBlue hover:border-midBlue"
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {errors.general && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
              {errors.general}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
              isLoading 
                ? "bg-midBlue opacity-70 cursor-not-allowed" 
                : "bg-midBlue hover:bg-darkBlue text-white"
            }`}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Enlaces en la misma línea */}
        <div className="flex justify-between text-center">
          <button 
            onClick={() => setShowForgot(true)} 
            className="text-midBlue hover:text-darkBlue font-medium text-sm transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
          <button 
            onClick={() => setShowRequestAccess(true)} 
            className="text-midBlue hover:text-darkBlue font-medium text-sm transition-colors"
          >
            Solicitar acceso
          </button>
        </div>
      </div>

      {/* Modal Olvidé contraseña */}
      {showForgot && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-lightBlue">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-darkBlue">Recuperar Contraseña</h2>
              <p className="text-midBlue text-sm mt-1">Te enviaremos un enlace de recuperación</p>
            </div>
            
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    if (errors.forgotEmail) setErrors(prev => ({ ...prev, forgotEmail: "" }));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                    errors.forgotEmail ? "border-red-500 bg-red-50" : "border-lightBlue"
                  }`}
                />
                {errors.forgotEmail && <p className="text-red-500 text-xs mt-1">{errors.forgotEmail}</p>}
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-lg bg-midBlue text-white font-semibold hover:bg-darkBlue transition-colors"
                >
                  Enviar enlace
                </button>
                <button 
                  onClick={() => closeModal("forgot")} 
                  className="flex-1 py-3 rounded-lg bg-lightBlue text-darkBlue font-semibold hover:bg-midBlue hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Solicitar Acceso */}
      {showRequestAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto border border-lightBlue">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-darkBlue">Solicitar Acceso</h2>
              <p className="text-midBlue text-sm mt-1">Completa la información para solicitar tu cuenta</p>
            </div>
            
            <form onSubmit={handleRequestAccessSubmit} className="space-y-4">
              {/* Tipo de usuario */}
              <div>
                <select
                  name="tipo"
                  value={requestAccessData.tipo}
                  onChange={handleRequestAccessChange}
                  className="w-full px-4 py-3 border border-lightBlue rounded-lg focus:outline-none focus:ring-1 focus:ring-midBlue transition"
                >
                  <option value="usuario">Usuario Interno</option>
                  <option value="proveedor">Proveedor</option>
                </select>
              </div>

              {/* Campos para Usuario Interno */}
              {requestAccessData.tipo === "usuario" && (
                <>
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre completo *"
                      name="nombre"
                      value={requestAccessData.nombre}
                      onChange={handleRequestAccessChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                        errors.nombre ? "border-red-500 bg-red-50" : "border-lightBlue"
                      }`}
                    />
                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                  </div>

                  <div>
                    <select
                      name="area"
                      value={requestAccessData.area}
                      onChange={handleRequestAccessChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                        errors.area ? "border-red-500 bg-red-50" : "border-lightBlue"
                      }`}
                    >
                      <option value="">Selecciona tu área *</option>
                      <option value="ventas">Ventas</option>
                      <option value="marketing">Marketing</option>
                      <option value="ti">TI</option>
                      <option value="rh">Recursos Humanos</option>
                      <option value="finanzas">Finanzas</option>
                      <option value="operaciones">Operaciones</option>
                    </select>
                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                  </div>

                  {/* Correo para Usuario Interno */}
                  <div>
                    <input
                      type="email"
                      placeholder="Correo electrónico *"
                      name="correo"
                      value={requestAccessData.correo}
                      onChange={handleRequestAccessChange}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                        errors.correo ? "border-red-500 bg-red-50" : "border-lightBlue"
                      }`}
                    />
                    {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                  </div>
                </>
              )}

              {/* Campos para Proveedor */}
              {requestAccessData.tipo === "proveedor" && (
                <>
                  <div>
                    <select
                      name="subtipo"
                      value={requestAccessData.subtipo}
                      onChange={handleRequestAccessChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                        errors.subtipo ? "border-red-500 bg-red-50" : "border-lightBlue"
                      }`}
                    >
                      <option value="">Selecciona tipo de proveedor *</option>
                      <option value="fisica">Persona Física</option>
                      <option value="moral">Persona Moral</option>
                    </select>
                    {errors.subtipo && <p className="text-red-500 text-xs mt-1">{errors.subtipo}</p>}
                  </div>

                  {/* Campos para Persona Física - Solo se muestran cuando se selecciona */}
                  {requestAccessData.subtipo === "fisica" && (
                    <>
                      <div>
                        <input
                          type="text"
                          placeholder="Nombre completo *"
                          name="nombre"
                          value={requestAccessData.nombre}
                          onChange={handleRequestAccessChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                            errors.nombre ? "border-red-500 bg-red-50" : "border-lightBlue"
                          }`}
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="RFC *"
                          name="rfc"
                          value={requestAccessData.rfc}
                          onChange={handleRequestAccessChange}
                          style={{ textTransform: "uppercase" }}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                            errors.rfc ? "border-red-500 bg-red-50" : "border-lightBlue"
                          }`}
                        />
                        {errors.rfc && <p className="text-red-500 text-xs mt-1">{errors.rfc}</p>}
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Correo electrónico *"
                          name="correo"
                          value={requestAccessData.correo}
                          onChange={handleRequestAccessChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                            errors.correo ? "border-red-500 bg-red-50" : "border-lightBlue"
                          }`}
                        />
                        {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                      </div>
                    </>
                  )}

                  {/* Campos para Persona Moral - Solo se muestran cuando se selecciona */}
                  {requestAccessData.subtipo === "moral" && (
                    <>
                      <div>
                        <input
                          type="text"
                          placeholder="Empresa *"
                          name="empresa"
                          value={requestAccessData.empresa}
                          onChange={handleRequestAccessChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                            errors.empresa ? "border-red-500 bg-red-50" : "border-lightBlue"
                          }`}
                        />
                        {errors.empresa && <p className="text-red-500 text-xs mt-1">{errors.empresa}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="RFC *"
                          name="rfc"
                          value={requestAccessData.rfc}
                          onChange={handleRequestAccessChange}
                          style={{ textTransform: "uppercase" }}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                            errors.rfc ? "border-red-500 bg-red-50" : "border-lightBlue"
                          }`}
                        />
                        {errors.rfc && <p className="text-red-500 text-xs mt-1">{errors.rfc}</p>}
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Correo electrónico *"
                          name="correo"
                          value={requestAccessData.correo}
                          onChange={handleRequestAccessChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-midBlue transition ${
                            errors.correo ? "border-red-500 bg-red-50" : "border-lightBlue"
                          }`}
                        />
                        {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-lg bg-midBlue text-white font-semibold hover:bg-darkBlue transition-colors"
                >
                  Enviar solicitud
                </button>
                <button 
                  onClick={() => closeModal("request")} 
                  className="flex-1 py-3 rounded-lg bg-lightBlue text-darkBlue font-semibold hover:bg-midBlue hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;