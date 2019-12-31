import axios from 'axios';
import baseUrl from './baseUrl';

const api = axios.create({
    baseURL: baseUrl,
});

export default api;