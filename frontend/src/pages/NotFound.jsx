import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center"
            style={{ backgroundColor: '#FBFBFA' }}>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-sm"
            >
                <p className="text-[96px] font-bold text-[#EAEAEA] leading-none tracking-tight select-none">
                    404
                </p>
                <h1 className="mt-4 text-lg font-semibold text-[#111111] tracking-tight">
                    Pagina no encontrada
                </h1>
                <p className="mt-2 text-sm text-[#787774]">
                    La ruta solicitada no existe en el sistema FEV-RIPS.
                </p>

                <motion.button
                    onClick={() => navigate('/dashboard')}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        backgroundColor: '#111111',
                        borderRadius: '6px',
                        marginTop: '24px',
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-white cursor-pointer"
                >
                    Ir al panel
                </motion.button>
            </motion.div>
        </div>
    );
}
