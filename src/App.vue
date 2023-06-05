<template>
    <a-config-provider :locale="zhCN">
        <router-view />
    </a-config-provider>
</template>
<script setup>
import { message } from 'ant-design-vue';
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

const codeBlockCopyEvent = (e) => {
    const target = e.target;
    const isCopyActionClassName = target.className === 'copy-action';
    const isCodeBlockParent = target.parentElement?.parentElement?.className === 'code-block-wrapper';

    // check is copy action button
    if (!(isCopyActionClassName && isCodeBlockParent)) {
        return;
    }

    // got codes
    const content = target?.parentNode?.parentNode?.querySelector('code')?.innerText ?? '';

    // do copy
    // * thats lines copy from copy block content action
    navigator.clipboard.writeText(content);
    message.success('代码已复制到剪贴板');
}; // 输出一段js，判断奇偶数，用markdown格式

document.addEventListener('click', codeBlockCopyEvent);

</script>
