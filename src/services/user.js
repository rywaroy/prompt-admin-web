import axios from '@/utils/axios';

export const loginApi = (data) => axios.post('/login', data);

export const getUserInfoApi = () => axios.get('/user');
