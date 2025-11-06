export const externalApiConfig = {
    cuvApi: {
        baseUrl: process.env.CUV_API_URL || 'https://localhost:9443',
        endpoint: '/api/ConsultasFevRips/ConsultarCUV',
        timeout: process.env.CUV_API_TIMEOUT || 30000,
        rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
};

export const getCuvApiURL = () => {
    const { baseUrl, endpoint } = externalApiConfig.cuvApi;
    return `${baseUrl}${endpoint}`;
}