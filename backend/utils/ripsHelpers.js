export function pick(...options) {
    for (const fn of options) {
        const v = typeof fn === 'function' ? fn() : undefined;
        if (v !== undefined && v !== null) return v;
    }
    return undefined;
}

export function resolveUserDocFromItem(item) {
    const tipo = pick(
        () => item?.tipoDocumentoIdentificacion,
        () => item?.tipoDocUsuario,
        () => item?.usuario?.tipoDocumentoIdentificacion,
        () => item?.tipoDoc,
        () => item?.tipo_documento,
        () => item?.usuario?.tipoDoc
    );

    const num = pick(
        () => item?.numDocumentoIdentificacion,
        () => item?.numDocUsuario,
        () => item?.usuario?.numDocumentoIdentificacion,
        () => item?.numDoc,
        () => item?.numero_documento,
        () => item?.usuario?.numDoc
    );

    return { tipo_doc: tipo, num_doc: num };
}

export function normalizeStatus(status) {
    const validStatuses = ['ACT', 'INACT', 'ERROR'];
    const normalized = String(status || 'ACT').toUpperCase();
    return validStatuses.includes(normalized) ? normalized : 'ACT';
}

export function parseIntSafe(value, defaultValue = null) {
    if (value == null) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}