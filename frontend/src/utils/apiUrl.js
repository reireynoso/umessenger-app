const apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PRODUCTION_URL : process.env.REACT_APP_DEV_URL

export default apiUrl