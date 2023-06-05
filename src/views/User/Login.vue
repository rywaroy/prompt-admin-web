<template>
    <div class="login">
        <a-form>
            <a-form-item v-bind="validateInfos.account">
                <a-input
                    v-model:value="formState.account" size="large" type="text" placeholder="账号"
                    allow-clear>
                    <template #prefix>
                        <user-outlined />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item v-bind="validateInfos.password">
                <a-input-password v-model:value="formState.password" size="large" placeholder="密码" @keydown.enter="login">
                    <template #prefix>
                        <lock-outlined />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item>
                <a-checkbox v-model:checked="remember" style="float: left">记住密码</a-checkbox>
            </a-form-item>
            <a-form-item style="margin-top:24px">
                <a-button
                    size="large"
                    block
                    type="primary"
                    class="login-button"
                    :loading="loading"
                    @click="login">
                    登录
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { Form } from 'ant-design-vue';
import useUserStore from '@/stores/user';
import { loginApi } from '@/services/user';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const remember = ref(false);

const formState = reactive({
    account: '',
    password: '',
});

const rules = reactive({
    account: [{ required: true, message: '请输入账号' }],
    password: [{ required: true, message: '请输入密码' }],
});

const { validate, validateInfos } = Form.useForm(formState, rules);

if (window.localStorage.getItem('remember')) {
    remember.value = true;
    formState.account = window.localStorage.getItem('account');
    formState.password = window.localStorage.getItem('password');
}

const login = () => {
    if (loading.value) {
        return;
    }

    validate().then((values) => {
        loading.value = true;
        loginApi(values).then((res) => {
            loading.value = false;
            const { account, admin, token } = res.data;
            const user = useUserStore();
            user.setUserInfo({
                name: account,
                permission: admin,
            });
            window.localStorage.setItem('token', token);
            if (remember.value) {
                window.localStorage.setItem('remember', true);
                window.localStorage.setItem('account', values.account);
                window.localStorage.setItem('password', values.password);
            } else {
                window.localStorage.removeItem('remember');
                window.localStorage.removeItem('account');
                window.localStorage.removeItem('password');
            }
            if (route.query.redirect) {
                router.push(route.query.redirect);
            } else {
                router.push('/');
            }
        }).catch(() => {
            loading.value = false;
        });
    });
};
</script>
<style lang="less" scoped>
.login {
    min-width: 260px;
    width: 368px;
    margin: 0 auto;
}
</style>
