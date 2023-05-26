import axios from '@/utils/axios';

export const getGroupListApi = (params) => axios.get('/group');

export const createGroupApi = (params) => axios.post('/group', params);

export const updateGroupApi = (params) => axios.put(`/group/${params.id}`, params);

export const deleteGroupApi = (params) => axios.delete(`/group/${params.id}`, params);
