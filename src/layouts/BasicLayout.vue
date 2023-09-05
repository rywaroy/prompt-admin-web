<template>
    <a-layout class="h-screen overflow-hidden">
        <a-layout-header class="h-12 px-4 flex justify-between items-center">
            <div class="font-bold text-lg leading-[48px] text-white">
                {{ setting.title }}
            </div>
            <right-content />
        </a-layout-header>
        <a-layout>
            <a-layout-sider theme="light" class="basic-sider" :collapsed="collapsed" :collapsed-width="48">
                <div class="flex-1 scroll-bar">
                    <base-menu />
                </div>
                <div class="basic-menu-fold">
                    <div @click="collapsed = !collapsed">
                        <menu-unfold-outlined v-if="collapsed" />
                        <menu-fold-outlined v-else />
                    </div>
                    <div v-if="user.name && !collapsed" class="setting" @click="showSettingModal = true">
                        <setting-outlined class="setting-icon" />
                    </div>
                </div>
            </a-layout-sider>
            <a-layout-content ref="container" class="scroll-bar">
                <base-page-tab />
                <router-view v-slot="{ Component, route }">
                    <keep-alive :include="include">
                        <component :is="Component" v-if="isRouteActive" :key="route.fullPath" />
                    </keep-alive>
                </router-view>
            </a-layout-content>
            <a-back-top :target="containerTaget" :visibility-height="200" />
        </a-layout>

        <a-modal v-model:visible="showSettingModal" title="设置" @ok="setModel">
            <a-form>
                <a-form-item label="Model">
                    <a-select v-model:value="model">
                        <a-select-option value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</a-select-option>
                        <a-select-option value="gpt-4-0613">gpt-4-0613</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-layout>
</template>
<script>
import { defineComponent, computed, ref, nextTick, provide } from 'vue';

export default defineComponent({
    name: 'BasicLayout',
});
</script>
<script setup>
import { storeToRefs } from 'pinia';
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons-vue';
import setting from '@/config/defaultSettings';
import BaseMenu from '@/components/BaseMenu/index.vue';
import RightContent from '@/components/RightContent/index.vue';
import BasePageTab from '@/components/BasePageTab/index.vue';
import usePageTabStore from '@/stores/pageTab';
import useUserStore from '@/stores/user';

const pageTab = usePageTabStore();
const { tabs, active } = storeToRefs(pageTab);

const include = computed(() => tabs.value.filter((tab) => tab.meta.keepAlive).map((tab) => tab.name));

const collapsed = ref(false);
const isRouteActive = ref(true);
const container = ref(null);

const reload = () => {
    isRouteActive.value = false;
    const activeTab = tabs.value.find((tab) => tab.key === active.value);
    let keepAlive = false;
    if (activeTab.meta.keepAlive) {
        activeTab.meta.keepAlive = false;
        keepAlive = true;
    }
    nextTick(() => {
        isRouteActive.value = true;
        if (keepAlive) {
            activeTab.meta.keepAlive = true;
        }
    });
};

const containerTaget = () => container.value.$el;

const showSettingModal = ref(false);
const model = ref(window.localStorage.getItem('model') || '');
const setModel = () => {
    if (model.value) {
        window.localStorage.setItem('model', model.value);
        showSettingModal.value = false;
    }
};

const user = useUserStore();

provide('reload', reload);

</script>
<style scoped lang="less">

.basic-sider {
    :deep(.ant-layout-sider-children) {
        display: flex;
        flex-direction: column;
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        position: relative;
        z-index: 10;
    }
}

.basic-menu-fold {
    position: relative;
    height: 48px;
    line-height: 48px;
    color: rgba(0, 0, 0, .85);
    font-size: 16px;
    padding-left: 16px;
    border-top: 1px solid rgba(0, 0, 0, .06);

    :deep(.anticon) {
        cursor: pointer;

        &:hover {
            color: #1890ff;
        }
    }

    .setting {
        position: absolute;
        right: 10px;
        top: 0;
    }
}
</style>
