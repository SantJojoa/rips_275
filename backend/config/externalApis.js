export const externalApiConfig = {
    cuvApi: {
        baseUrl: process.env.CUV_API_URL,
        endpoint: '/api/ConsultasFevRips/ConsultarCUV',
        timeout: Number(process.env.CUV_API_TIMEOUT) || 30000,
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
};

export const getCuvApiURL = () => {
    const { baseUrl, endpoint } = externalApiConfig.cuvApi;
    return `${baseUrl}${endpoint}`;
}
