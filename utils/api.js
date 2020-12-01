import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:1337'
})

export const addAuth = token => {
    // instance.defaults.headers.common["Authorization"] = "Bearer " + token;
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const clearAuth = () => {
    delete instance.defaults.headers.common["Authorization"];
}

export default instance;