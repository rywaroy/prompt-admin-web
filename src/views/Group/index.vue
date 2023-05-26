<template>
    <page-container>
        <div class="table-page-wrapper">
            <div class="table-page-toolbar">
                <div class="table-title">查询表格</div>
                <div class="table-operation">
                    <a-button type="primary" @click="addGroup()">新建</a-button>
                </div>
            </div>
            <a-table
                row-key="id"
                :loading="loading"
                :data-source="dataSource"
                :columns="columns"
                :pagination="pagination"
                :row-selection="rowSelection"
                @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'action'">
                        <a-button type="link" @click="addGroup(record)">新增</a-button>
                        <a-button type="link" @click="editGroup(record)">编辑</a-button>
                        <a-button type="link" danger @click="deleteGroup(record)">删除</a-button>
                    </template>
                </template>
            </a-table>
        </div>

        <UpdateGroup
            v-model:visible="updateVisible"
            :form-state="currentGroup"
            @submit="updateGroup" />
    </page-container>
</template>
<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';

export default defineComponent({
    name: 'Group',
});
</script>
<script setup>
import { Modal } from 'ant-design-vue';
import { getGroupListApi, createGroupApi, updateGroupApi, deleteGroupApi } from '@/services/group';
import UpdateGroup from './components/UpdateGroup/index.vue';
import { buildTree } from '@/utils';

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '排序',
        dataIndex: 'orderIndex',
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: '220px',
    },
];

const dataSource = ref([]);
let groupList;
const currentGroup = reactive({});
const updateVisible = ref(false);

const getGroupList = () => {
    getGroupListApi().then((res) => {
        groupList = res.data;
        const data = buildTree(res.data);
        dataSource.value = data;
    });
};

const addGroup = (group) => {
    currentGroup.id = null;
    currentGroup.name = '';
    currentGroup.orderIndex = 10;
    if (group) {
        currentGroup.parentId = group.id;
        currentGroup.parentName = group.name;
    }
    updateVisible.value = true;
};

const editGroup = (group) => {
    currentGroup.id = group.id;
    currentGroup.name = group.name;
    currentGroup.orderIndex = group.orderIndex;
    currentGroup.parentId = group.parentId;
    if (group.parentId) {
        const parent = groupList.find((item) => item.id === group.parentId);
        currentGroup.parentName = parent ? parent.name : null;
    }
    updateVisible.value = true;
};

const updateGroup = (group) => {
    const { id, name, orderIndex, parentId } = group;
    if (id) {
        updateGroupApi({ id, name, orderIndex, parentId }).then((res) => {
            updateVisible.value = false;
            getGroupList();
        });
    } else {
        createGroupApi({ name, orderIndex, parentId }).then((res) => {
            updateVisible.value = false;
            getGroupList();
        });
    }
};

const deleteGroup = (group) => {
    Modal.confirm({
        title: '确认删除',
        content: `确认删除分组${group.name}吗？`,
        onOk() {
            deleteGroupApi({ id: group.id }).then((res) => {
                getGroupList();
            });
        },
    });
};

onMounted(() => {
    getGroupList();
});

</script>
