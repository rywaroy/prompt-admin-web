<template>
    <a-modal
        :title="formState.id ? '编辑' : '新增'"
        :visible="visible"
        @cancel="cancel"
        @ok="submit">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="父级">
                {{ formState.parentName }}
            </a-form-item>
            <a-form-item label="名称" v-bind="validateInfos.name">
                <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item label="排序" v-bind="validateInfos.orderIndex">
                <a-input-number v-model:value="formState.orderIndex" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script>
import { defineComponent, reactive, toRaw } from 'vue';

export default defineComponent({
    name: 'UpdateGroup',
});
</script>
<script setup>
import { Form } from 'ant-design-vue';

const props = defineProps({
    visible: Boolean,
    formState: Object,
});

const emits = defineEmits(['update:visible', 'submit']);

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

const rulesRef = reactive({
    name: [{ required: true, message: '请输入名称' }],
    orderIndex: [{ required: true, message: '请输入排序' }],
});

const { resetFields, validate, validateInfos } = Form.useForm(props.formState, rulesRef);

const cancel = () => {
    emits('update:visible', false);
};

const submit = () => {
    validate()
        .then(() => {
            emits('submit', toRaw(props.formState));
        });
};
</script>
