<template>
    <page-container>
        <div class="prompt-container">
            <div class="prompt-group">
                <a-tree
                    v-model:selectedKeys="keys"
                    :tree-data="dataSource"
                    :field-names="{ children: 'children', title: 'name', key: 'id' }"
                    @select="selectGroup"
                />
            </div>
            <div class="prompt-content">
                <div class="prompt-content-top">
                    <a-select v-model:value="currentPromptId" class="prompt-content-name" @change="selectPrompt">
                        <a-select-option v-for="item in promptList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                    <plus-outlined class="prompt-icon-add" @click="addPrompt" />
                    <edit-outlined class="prompt-icon-edit" @click="editPrompt" />
                    <save-outlined class="prompt-icon-save" @click="savePrompt" />
                    <delete-outlined class="prompt-icon-delete" @click="deletePrompt" />
                </div>
                <div v-if="currentPrompt.id" class="prompt-list">
                    <div v-for="(item, index) in currentPrompt.fragments" :key="item.id" class="prompt-item">
                        <check-circle-outlined class="prompt-checked" :class="{ active: item.selected }" @click="selectFragment(index)" />
                        <a-textarea v-model:value="item.content" :auto-size="{ minRows: 1 }" class="prompt-text" />
                        <plus-outlined class="prompt-plus" @click="addFragment(index)" />
                        <minus-outlined class="prompt-minus" @click="deleteFragment(index)" />
                    </div>
                    <a-button type="primary" @click="addFragment()">添加</a-button>
                </div>
            </div>
            <div class="prompt-result">
                {{ promptText }}
            </div>
        </div>
        <UpdatePrompt
            v-model:visible="updateVisible"
            :form-state="formState"
            @submit="updatePrompt" />
    </page-container>
</template>
<script>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue';

export default defineComponent({
    name: 'Group',
});
</script>
<script setup>
import { Modal, message } from 'ant-design-vue';
import { CheckCircleOutlined, PlusOutlined, MinusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { getGroupListApi } from '@/services/group';
import { getPromptListApi, getPromptDetailApi, updatePromptApi, createPromptApi, deletePromptApi } from '@/services/prompt';
import { buildTree } from '@/utils';
import UpdatePrompt from './components/UpdatePrompt/index.vue';

let groupId;
const dataSource = ref([]);
const promptList = ref([]);
const currentPromptId = ref(null);
const currentPrompt = ref({});
const keys = ref([]);
const updateVisible = ref(false);
const formState = reactive({});

const promptText = computed(() => {
    if (!currentPrompt.value.fragments) {
        return '';
    }
    return currentPrompt.value.fragments.filter((item) => item.selected).map((item) => item.content).join('\n');
});

const selectFragment = (index) => {
    currentPrompt.value.fragments[index].selected = !currentPrompt.value.fragments[index].selected;
};

const addFragment = (index) => {
    if (index === undefined) {
        currentPrompt.value.fragments.push({
            content: '',
            selected: false,
        });
    } else {
        currentPrompt.value.fragments.splice(index + 1, 0, {
            content: '',
            selected: false,
        });
    }
};

const deleteFragment = (index) => {
    currentPrompt.value.fragments.splice(index, 1);
};

const selectPrompt = (id) => {
    getPromptDetailApi(id).then((res) => {
        currentPrompt.value = res.data;
    });
};

const savePrompt = () => {
    Modal.confirm({
        title: '提示',
        content: '确定保存吗？',
        onOk() {
            currentPrompt.value.fragments.forEach((item, index) => {
                item.orderIndex = index;
            });
            updatePromptApi(currentPrompt.value).then(() => {
                message.success('保存成功');
            });
        },
    });
};

const updatePrompt = (propmt) => {
    const { id, name, model } = propmt;
    if (id) {
        updatePromptApi({ id, name, model, fragments: currentPrompt.value.fragments }).then(() => {
            message.success('更新成功');
            updateVisible.value = false;
            getPromptListApi(groupId).then((res) => {
                promptList.value = res.data;
            });
        });
    } else {
        createPromptApi({ name, model, groupId })
            .then(() => {
                message.success('创建成功');
                updateVisible.value = false;
                getPromptListApi(groupId).then((res) => {
                    promptList.value = res.data;
                });
            });
    }
};

const addPrompt = () => {
    formState.id = null;
    formState.name = '';
    formState.model = 'gpt-3.5-turbo';
    updateVisible.value = true;
};

const editPrompt = () => {
    const { id, name, model } = currentPrompt.value;
    formState.id = id;
    formState.name = name;
    formState.model = model;
    updateVisible.value = true;
};

const selectGroup = (selectedKeys) => {
    groupId = selectedKeys[0];
    getPromptListApi(groupId).then((res) => {
        const list = res.data;
        if (list.length) {
            currentPromptId.value = list[0].id;
            selectPrompt(list[0].id);
        } else {
            currentPromptId.value = null;
            currentPrompt.value = {};
        }
        promptList.value = list;
    });
};

const deletePrompt = () => {
    Modal.confirm({
        title: '提示',
        content: `确定删除${currentPrompt.value.name}吗？`,
        onOk() {
            deletePromptApi(currentPrompt.value.id).then(() => {
                message.success('删除成功');
                selectGroup([groupId]);
            });
        },
    });
};

const getGroupList = () => {
    getGroupListApi().then((res) => {
        const data = buildTree(res.data);
        dataSource.value = data;
        keys.value = [data[0].id];
        selectGroup(keys.value);
    });
};

onMounted(() => {
    getGroupList();
});

</script>
<style scoped src="./index.less" lang="less"></style>
