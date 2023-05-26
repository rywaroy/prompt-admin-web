import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import routes, { homeName } from './routes';
import useUserStore from '@/stores/user';
import usePageTabStore from '@/stores/pageTab';
import setting from '@/config/defaultSettings';
import { getUserInfoApi } from '@/services/mock';
import '@/assets/styles/nprogress.css';

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

const setDocumentTitle = (to) => {
    if (to.meta && to.meta.title) {
        window.document.title = `${to.meta.title} - ${setting.title}`;
    } else {
        window.document.title = setting.title;
    }
};

const whiteList = [];

const filterWhiteList = (routeList) => {
    for (let i = 0; i < routeList.length; i++) {
        if (routeList[i].name) {
            whiteList.push(routeList[i].name);
        }
        if (routeList[i].children) {
            filterWhiteList(routeList[i].children);
        }
    }
};

filterWhiteList(routes.slice(1));

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    setDocumentTitle(to);
    const pageTab = usePageTabStore();

    const key = to.name === homeName ? 1 : Math.random();
    pageTab.addTab({
        ...to,
        key,
    });
    next();
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
