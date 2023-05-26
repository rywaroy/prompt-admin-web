<template>
    <div class="chat">
        <div class="out">
            <div id="chat-c" class="chat-c">
                <div v-for="(item, index) in chatData" :key="index" class="item-c">
                    <div v-if="item.type === 'chat'" class="avatar">
                        <!-- <img :src="chat" alt="chat"> -->
                    </div>
                    <div v-else class="avatar">
                        {{ item.identity }}
                    </div>
                    <div :class="{ text: true, error: error }">{{ item.text }}</div>
                </div>
            </div>
            <div class="chat-bottom">
                <div class="chat-bottom-btns">
                    <button class="btn" @click="regenerateThrottle"><sync-outlined class="icon" /> Regenerate response</button>
                    <!-- <button class="btn" @click="clear">Clear</button> -->
                </div>
                <div class="chat-operation">
                    <textarea
                        v-model="chatValue"
                        class="input"
                        type="text"
                    />
                    <!-- <button class="send" @click="sendChatThrottle">
                        <img :src="send" alt="send">
                    </button> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Chat',
});
</script>
<script setup>
import { message } from 'ant-design-vue';
import { SyncOutlined } from '@ant-design/icons-vue';

import throttle from 'lodash/throttle';
// import send from './images/send.svg';
// import chat from './images/chatgpt.png';

// import { getChatContent } from '@/api/chat';

// 聊天数据
const chatData = ref([
    {
        identity: 'chat',
        type: 'chat',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'zzh',
        type: 'user',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'chat',
        type: 'chat',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'zzh',
        type: 'user',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'chat',
        type: 'chat',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'zzh',
        type: 'user',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'chat',
        type: 'chat',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'zzh',
        type: 'user',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'chat',
        type: 'chat',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'zzh',
        type: 'user',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'chat',
        type: 'chat',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'zzh',
        type: 'user',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'chat',
        type: 'chat',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
    {
        identity: 'zzh',
        type: 'user',
        text: "Hi, I'm GPT-3. I'm a language model trained on a very large dataset of internet text. I can answer questions, generate stories, and even translate between languages. I'm a work in progress, so I'm not perfect yet. But I'm getting better all the time. I'm excited to see what we can do together.",
    },
]);
// 输入内容
const chatValue = ref('');
// 重发内容
const reChatValue = '';
// error
const error = ref(false);
const loading = ref(false);

// 发送内容
function sendChatHandle() {
    if (chatValue.value === '') {
        message.error('请输入内容');
        return;
    }
    sendChat(chatValue.value);
}

const sendChatThrottle = throttle(sendChatHandle, 1000);

async function sendChat(value) {
    chatData.value.push({ identity: '', text: value });
    loading.value = true;

    // // 发送请求
    // const res = await getChatContent({
    //     conversationId: '',
    //     text: value,
    // });

    // error.value = res.code !== 200;

    // loading.value = false;
    // chatData.value.push({ identity: 'chat', text: res.message });
    // nextTick(() => {
    //     const element = document.getElementById('chat-c');
    //     element.scrollTop = element.scrollHeight;
    // });
    // reChatValue = value;
    // chatValue.value = '';
}

// 清除输入内容
function reset() {
    chatValue.value = '';
}

// 重新发送请求
function regenerate() {
    if (reChatValue === '') {
        return;
    }
    sendChat(reChatValue);
}
const regenerateThrottle = throttle(regenerate, 1000);

// 清除聊天内容
function clear() {
    chatData.value = [];
}
</script>
<style scoped src="./index.css"></style>
