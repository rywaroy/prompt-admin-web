<template>
    <a-config-provider :locale="zhCN">
        <router-view />
    </a-config-provider>
</template>
<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { getUserInfoApi } from '@/services/user';
import useUserStore from '@/stores/user';

dayjs.locale('zh-cn');

const token = window.localStorage.getItem('token');

if (token) {
    getUserInfoApi().then((res) => {
        const { account, admin } = res.data;
        const user = useUserStore();
        user.setUserInfo({
            name: account,
            permission: admin,
        });
    });
}

</script>
