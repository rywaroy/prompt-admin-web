<template>
    <div class="chat">
        <div class="out">
            <div ref="chatRef" class="chat-content">
                <template v-if="messageList.length > 0">
                    <div v-for="(item, index) in messageList" :key="index" class="chat-item">
                        <div v-if="item.role === 'assistant'" class="avatar">
                            <div class="chat-icon" />
                        </div>
                        <div v-else class="avatar">
                            {{ name[0] }}
                        </div>
                        <div class="text">{{ item.content }}</div>
                    </div>
                </template>
                <div v-else class="chat-empty">ChatGPT</div>
            </div>
            <div class="chat-bottom">
                <div class="chat-operation">
                    <textarea
                        v-model="prompt" class="input" type="text" :placeholder="promptPlaceholder"
                        @keydown="promptKeydown" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref, nextTick } from 'vue';

export default defineComponent({
    name: 'Chat',
});
</script>
<script setup>
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import SSE from '@/utils/sse';
import useUserStore from '@/stores/user';

const user = useUserStore();

const { name } = storeToRefs(user);

const messageList = ref([]);
const prompt = ref('');
const loading = ref(false);
const chatRef = ref(null);
let promptPlaceholder = '';
if (navigator.platform.indexOf('Win') !== -1) {
    promptPlaceholder = '按下Ctrl+Enter发送消息';
} else if (navigator.platform.indexOf('Mac') !== -1) {
    promptPlaceholder = '按下Command+Enter发送消息';
}

let timer;
let texts = [];
let source;
let isEnd = true;

const setCharacter = (text) => {
    const message = messageList.value[messageList.value.length - 1];
    if (message.role === 'assistant') {
        message.content += text;
    }
};

const stop = () => {
    if (timer) {
        clearInterval(timer);
    }
    loading.value = false;
    isEnd = true;
    if (texts.length > 0) {
        setCharacter(texts.join(''));
    }
    texts = [];
    source.close();
};

const scrollToBottom = (force) => {
    const listDom = chatRef.value;
    let isBottom = false;
    if (listDom.scrollTop + listDom.clientHeight + 10 >= listDom.scrollHeight) {
        isBottom = true;
    }
    nextTick(() => {
        // 判断是否在底部
        if (isBottom || force) {
            listDom.scrollTop = listDom.scrollHeight;
        }
    });
};

const submit = () => {
    if (loading.value) {
        return;
    }
    if (prompt.value) {
        messageList.value.push({
            role: 'user',
            content: prompt.value,
            html: prompt.value,
        });
    } else if (messageList.value.length === 0) {
        message.error('请输入内容');
        return;
    }
    if (messageList.value[messageList.value.length - 1].role !== 'assistant') {
        messageList.value.push({
            role: 'assistant',
            content: '',
            html: '',
        });
    }
    scrollToBottom(true);
    const params = {
        messages: messageList.value.filter((item) => item.content).map((item) => ({ role: item.role, content: item.content })),
    };
    prompt.value = '';
    isEnd = false;
    timer = setInterval(() => {
        if (texts.length > 0) {
            let text = '';
            if (texts.length > 50) {
                text = texts.splice(0, 25).join('');
            } else if (texts.length > 25) {
                text = texts.splice(0, 10).join('');
            } else if (texts.length > 10) {
                text = texts.splice(0, 3).join('');
            } else {
                text = texts.shift();
            }
            setCharacter(text);
            scrollToBottom();
        } else if (isEnd) {
            loading.value = false;
            clearInterval(timer);
        }
    }, 60);

    source = new SSE('/api/chat', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        payload: JSON.stringify(params),
        method: 'POST',
    });
    source.addEventListener('message', (event) => {
        const value = event.data;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === '[DONE]') {
                isEnd = true;
                source.close();
                return;
            }
            const { choices } = JSON.parse(value[i]);
            choices.forEach((item) => {
                if (item.delta.content) {
                    texts.push(item.delta.content);
                }
            });
        }
    }, false);
    source.addEventListener('err', (err) => {
        stop();
    }, false);
    source.addEventListener('error', (err) => {
        stop();
    });
    loading.value = true;
    source.stream();
};

const promptKeydown = (e) => {
    // ctrl + entry 提交，command + entry 提交，shift + entry 换行
    if (e.keyCode === 13) {
        if (e.ctrlKey || e.metaKey) {
            submit();
        } else if (e.shiftKey) {
            // prompt.value += '\n';
        }
    }
};

</script>
<style scoped src="./index.css"></style>
