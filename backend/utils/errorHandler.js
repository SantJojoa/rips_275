export const handleControllerError = (res, error) => {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Error interno del servidor' });
}