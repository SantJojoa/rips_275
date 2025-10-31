class Logger {
    log(message, data = {}) {
        console.log(`[${new Date().toISOString()}] ${message}`, data);
    }

    error(message, error = {}) {
        console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
    }

    info(message, data = {}) {
        console.log(`[${new Date().toISOString()}] INFO: ${message}`, data);
    }

    warn(message, data = {}) {
        console.warn(`[${new Date().toISOString()}] WARN: ${message}`, data);
    }
}

export default new Logger();