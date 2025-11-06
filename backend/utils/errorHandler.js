
export const handleControllerError = (res, error) => {
    console.error('Error en controlador:', error);

    const status = error.status || 500;
    const message = error.message || 'Error interno del servidor';

    const response = { message }

    if (error.details && process.env.NODE_ENV === 'development') {
        response.details = error.details;
    }

    res.status(status).json(response);
};


export const createError = (status, message, details = null) => {
    const error = new Error(message);
    error.status = status;
    if (details) {
        error.details = details;
    }
    return error;
};