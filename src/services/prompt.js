import axios from '@/utils/axios';

export const getPromptListApi = (id) => axios.get(`/prompt?id=${id}`);

export const getPromptDetailApi = (id) => axios.get(`/prompt/${id}`);

export const createPromptApi = (params) => axios.post('/prompt', params);

export const updatePromptApi = (params) => axios.put(`/prompt/${params.id}`, params);

export const deletePromptApi = (id) => axios.delete(`/prompt/${id}`);
