import { message } from 'ant-design-vue';
import axios from 'axios';

const service = axios.create({
    baseURL: '/api',
    timeout: 15000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    (config) => {
        if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
            if (config.type === 'form') {
                config.headers['Content-Type'] = 'multipart/form-data';
            } else {
                config.headers['Content-Type'] = 'application/json';
                config.data = JSON.stringify(config.data);
            }
        }
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

// respone拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        if (res && res.code !== '200') {
            message.error(res.message);
            return Promise.reject(res);
        }
        return res;
    },
    (error) => Promise.reject({
        type: 'error',
        data: error,
    }),
);

export default service;
