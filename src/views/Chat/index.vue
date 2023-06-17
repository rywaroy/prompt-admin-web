<template>
    <div class="overflow-y-hidden overflow-x-auto" style="height: calc(100vh - 110px);">
        <div class="h-full min-w-[1000px] flex flex-col bg-white relative">
            <div ref="chatRef" class="chat-content flex-1 overflow-y-auto pb-[124px]">
                <template v-if="messageList.length > 0">
                    <div v-for="(item, index) in messageList" :key="index" class="py-6 flex justify-center" :class="{'bg-gray-100': item.role === 'assistant' }">
                        <div v-if="item.role === 'assistant'" class="avatar">
                            <div class="chat-icon w-full h-full" />
                        </div>
                        <div v-else class="avatar">
                            {{ name[0] }}
                        </div>
                        <div class="w-[750px] text-base" :class="{ '': item.role === 'user' }" v-html="item.html" />
                    </div>
                </template>
                <div v-else class="h-full flex items-center justify-center text-5xl font-bold text-gray-400">ChatGPT</div>
            </div>
            <div class="chat-bottom bg-transparent backdrop-blur-sm flex flex-col justify-center items-center py-6 absolute w-full left-0 bottom-0">
                <div class="p-3 w-[768px] relative shadow-lg border border-gray-100 rounded-lg overflow-hidden bg-white">
                    <textarea
                        v-model="prompt" class="chat-operation-input" type="text" :placeholder="promptPlaceholder"
                        @keydown="promptKeydown" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref, nextTick, onUnmounted, onActivated, onDeactivated } from 'vue';

export default defineComponent({
    name: 'Chat',
});
</script>
<script setup>
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import escape from 'lodash/escape';
import MarkdownIt from 'markdown-it';
import mila from 'markdown-it-link-attributes';
import hljs from 'highlight.js';
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
    promptPlaceholder = '按下 Ctrl + Enter 发送消息';
} else if (navigator.platform.indexOf('Mac') !== -1) {
    promptPlaceholder = '按下 Command + Enter 发送消息';
}

let timer;
let texts = [];
let source;
let isEnd = true;
const md = new MarkdownIt({
    linkify: true,
    breaks: true,
    highlight: (str, lang, attrs) => {
        let content = str;
        if (lang && hljs.getLanguage(lang)) {
            try {
                content = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
            } catch (e) {
                return str;
            }
        } else {
            content = md.utils.escapeHtml(str);
        }

        // join actions html string
        lang = (lang || 'txt').toUpperCase();
        return [
            '<div class="code-block-wrapper">',
            `<div class="code-header"><span class="code-lang">${lang}</span><div class="copy-action">copy</div></div>`,
            '<pre class="hljs code-block">',
            `<code>${content}</code>`,
            '</pre>',
            '</div>',
        ].join('');
    },
});
md.use(mila, { attrs: { target: '_blank', rel: 'noopener' } });

const setCharacter = (text) => {
    const message = messageList.value[messageList.value.length - 1];
    if (message.role === 'assistant') {
        message.content += text;
        message.html = md.render(message.content);
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
    if (source) {
        source.close();
    }
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

const submit = (config = {}) => {
    if (loading.value) {
        return;
    }
    if (prompt.value) {
        messageList.value.push({
            role: 'user',
            content: prompt.value,
            html: escape(prompt.value),
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
        ...config,
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
    if (e.keyCode === 13) {
        if (e.ctrlKey || e.metaKey) {
            submit();
        }
    }
};

onActivated(() => {
    const promptText = window.localStorage.getItem('prompt');
    if (promptText) {
        prompt.value = promptText;
        messageList.value = [];
        submit({ temperature: 0 });
        window.localStorage.removeItem('prompt');
    }
});

onDeactivated(() => {
    stop();
});

onUnmounted(() => {
    stop();
});

</script>
<style scoped src="./index.css"></style>
