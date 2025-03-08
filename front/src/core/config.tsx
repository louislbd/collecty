const env = process.env.REACT_APP_ENV || "development";
const apiUrl = env === 'development' ? 'http://localhost:8080/' : 'URL_PROD_???';

const config = {
    env,
    apiUrl,
};

export default config;