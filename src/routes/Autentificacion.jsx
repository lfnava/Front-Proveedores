import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Autentificacion() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }

      const verificationCode = newCode.join("");
      if (verificationCode.length === 6) {
        handleAutoSubmit(verificationCode);
      }
    }
  };

  const handleAutoSubmit = async (verificationCode) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/cambio-pass");
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numbers = pastedData.replace(/\D/g, "").slice(0, 6);
    
    if (numbers.length === 6) {
      const newCode = numbers.split("");
      setCode(newCode);
      handleAutoSubmit(numbers);
    }
  };

  const handleResendCode = () => {
    setShowAlert(true);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  // Cerrar alert con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowAlert(false);
    };
    
    if (showAlert) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [showAlert]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-lightBlue">
        
        {/* Contenido principal */}
        <div className="p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-darkBlue mb-4">Verificación de Código</h1>
            <p className="text-xl text-midBlue">
              Ingresa el código de 6 dígitos que te enviamos
            </p>
          </div>

          <div className="space-y-12">
            {/* Inputs del código - MARCOS SUTILES */}
            <div className="flex justify-center gap-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="w-20 h-20 text-center text-3xl font-bold border-2 border-gray-400 rounded-xl focus:outline-none focus:border-midBlue focus:ring-2 focus:ring-midBlue focus:ring-opacity-30 transition-all bg-white"
                />
              ))}
            </div>

            {/* Estado de carga */}
            {isLoading && (
              <div className="text-center">
                <div className="inline-flex items-center gap-4 text-midBlue text-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-midBlue"></div>
                  <span>Verificando código...</span>
                </div>
              </div>
            )}

            {/* Botón reenviar */}
            <div className="text-center pt-8 border-t border-lightBlue">
              <button 
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-midBlue hover:text-darkBlue font-semibold text-lg transition-colors disabled:opacity-50 px-6 py-3 rounded-lg hover:bg-lightBlue hover:bg-opacity-30"
              >
                Reenviar código de verificación
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de alerta centrado */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
          <div 
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-lightBlue animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
             
              
              {/* Texto */}
              <h3 className="text-2xl font-bold text-darkBlue mb-4">
                Código Enviado
              </h3>
              <p className="text-midBlue text-lg mb-8">
                Se ha enviado un nuevo código de verificación a tu correo electrónico.
              </p>
              
              {/* Botón */}
              <button 
                onClick={() => setShowAlert(false)}
                className="w-full py-4 bg-midBlue text-white rounded-xl font-semibold text-lg hover:bg-darkBlue transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Autentificacion;