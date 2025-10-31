
export const handleControllerError = (res, error) => {
    console.error('Error en controlador:', error);

    const status = error.status || 500;
    const message = error.message || 'Error interno del servidor';

    res.status(status).json({ message });
};


export const createError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};
