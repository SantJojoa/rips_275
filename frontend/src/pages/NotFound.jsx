import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-100 px-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md"
            >
                {/* Icono animado */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-green-100 p-4 rounded-full shadow-inner"
                    >
                        <AlertTriangle className="text-green-600 w-12 h-12" />
                    </motion.div>
                </div>

                {/* Título */}
                <h1 className="text-6xl font-extrabold text-slate-800 tracking-tight">
                    404
                </h1>
                <p className="mt-3 text-lg text-slate-600 font-medium">
                    Página no encontrada en FEV RIPS
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    Es posible que la ruta haya cambiado o el enlace sea incorrecto.
                </p>

                {/* Botón */}
                <motion.button
                    onClick={() => navigate("/dashboard")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer mt-8 px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold"
                >
                    Ir al Dashboard
                </motion.button>
            </motion.div>

            {/* Footer */}
            <footer className="mt-10 text-xs text-slate-400">
                © {new Date().getFullYear()} Sistema FEV RIPS
            </footer>
        </div>
    );
}
