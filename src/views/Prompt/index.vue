<template>
    <page-container>
        <div class="flex p-3 bg-white">
            <div class="w-[450px]">
                <a-input v-model:value="searchValue" class="mb-4 w-[300px]" placeholder="Search" />
                <a-tree
                    v-model:selectedKeys="keys"
                    :expanded-keys="expandedKeys"
                    :tree-data="dataSource"
                    :auto-expand-parent="autoExpandParent"
                    :field-names="{ children: 'children', title: 'name', key: 'id' }"
                    @select="selectGroup"
                    @expand="onExpand"
                >
                    <template #title="{ name }">
                        <span v-if="name.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1">
                            {{ name.substr(0, name.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase())) }}<span class="text-rose-500">{{ name.substr(name.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()), searchValue.length) }}</span>{{ name.substr(name.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) + searchValue.length) }}
                        </span>
                        <span v-else>{{ name }}</span>
                    </template>
                </a-tree>
            </div>
            <div class="flex-1">
                <div class="mb-5">
                    <a-select v-model:value="currentPromptId" class="w-[300px] mr-2" @change="selectPrompt">
                        <a-select-option v-for="item in promptList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                    <plus-outlined class="text-base mr-2 text-primary" @click="addPrompt" />
                    <edit-outlined class="text-base mr-2 text-amber-600" @click="editPrompt" />
                    <save-outlined class="text-base mr-2 text-green-500" @click="savePrompt" />
                    <delete-outlined class="text-base mr-2 text-rose-500" @click="deletePrompt" />
                    <copy-outlined class="text-base mr-2 text-yellow-500" @click="copyPrompt" />
                </div>
                <div v-if="currentPrompt.id">
                    <div v-for="(item, index) in currentPrompt.fragments" :key="item.id" class="flex mb-2 w-full">
                        <check-circle-outlined :class="{ 'active': item.selected }" class="prompt-checked text-2xl text-gray-400 mr-2 mt-1 cursor-pointer" @click="selectFragment(index)" />
                        <a-textarea v-model:value="item.content" :auto-size="{ minRows: 1, maxRows: 10 }" />
                        <plus-outlined class="text-xl text-primary mt-2 ml-2 cursor-pointer" @click="addFragment(index)" />
                        <minus-outlined class="text-xl text-rose-500 mt-2 ml-2 cursor-pointer" @click="deleteFragment(index)" />
                    </div>
                    <a-button class="mr-2" type="primary" @click="addFragment()">添加</a-button>
                    <a-button class="mr-2" type="primary" @click="preview()">预览</a-button>
                    <a-button class="mr-2" type="primary" @click="submit()">提交</a-button>
                </div>
            </div>
        </div>
        <UpdatePrompt
            v-model:visible="updateVisible"
            :form-state="formState"
            @submit="updatePrompt" />

        <a-modal
            v-model:visible="previewVisible"
            title="预览"
            :footer="null"
            :width="800"
            :body-style="{ height: 'calc(100vh - 200px)', overflow: 'auto' }">
            <div class="whitespace-pre-wrap rounded-lg border border-gray-300 p-3 ml-5">{{ promptText }}</div>
        </a-modal>
    </page-container>
</template>
<script>
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Group',
});
</script>
<script setup>
import { Modal, message } from 'ant-design-vue';
import { CheckCircleOutlined, PlusOutlined, MinusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CopyOutlined } from '@ant-design/icons-vue';
import { getGroupListApi } from '@/services/group';
import { getPromptListApi, getPromptDetailApi, updatePromptApi, createPromptApi, deletePromptApi } from '@/services/prompt';
import { buildTree } from '@/utils';
import UpdatePrompt from './components/UpdatePrompt/index.vue';

const router = useRouter();

let groupId;
const dataSource = ref([]);
const promptList = ref([]);
const currentPromptId = ref(null);
const currentPrompt = ref({});
const keys = ref([]);
const updateVisible = ref(false);
const formState = reactive({});
const previewVisible = ref(false);
const searchValue = ref('');
const expandedKeys = ref([]);
const autoExpandParent = ref(true);
let dataList = [];

const promptText = computed(() => {
    if (!currentPrompt.value.fragments) {
        return '';
    }
    return currentPrompt.value.fragments.filter((item) => item.selected).map((item) => item.content).join('\n');
});

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.id === key)) {
                parentKey = node.id;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};

watch(searchValue, (value) => {
    const expanded = dataList.map((item) => {
        if (item.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1) {
            return getParentKey(item.id, dataSource.value);
        }
        return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    expandedKeys.value = expanded;
    searchValue.value = value;
    autoExpandParent.value = true;
});

const onExpand = (keys) => {
    expandedKeys.value = keys;
    autoExpandParent.value = false;
};

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
        dataList = res.data;
        const data = buildTree(res.data);
        dataSource.value = data;
        if (data.length > 0) {
            keys.value = [data[0].id];
            selectGroup(keys.value);
        }
    });
};

const preview = () => {
    previewVisible.value = true;
};

const submit = () => {
    window.localStorage.setItem('prompt', promptText.value);
    router.push('/chat');
};

const copyPrompt = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(promptText.value).then(() => {
            message.success('复制成功');
        });
    }
};

onMounted(() => {
    getGroupList();
});

</script>
<style scoped lang="less">
.prompt-checked.active {
    color: #52c41a;
}
</style>
