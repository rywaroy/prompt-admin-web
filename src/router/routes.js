import { BasicLayout, UserLayout } from '@/layouts';

const homeRoute = {
    path: '/',
    name: 'Prompt',
    component: () => import('@/views/Prompt/index.vue'),
    meta: {
        title: 'prompt',
        icon: 'home',
        keepAlive: true,
    },
    key: 1,
};

const homeName = homeRoute.name;

const routes = [
    homeRoute,
    {
        path: '/group',
        name: 'Group',
        component: () => import('@/views/Group/index.vue'),
        meta: {
            title: 'group',
            icon: 'home',
            keepAlive: true,
        },
    },
    {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/Chat/index.vue'),
        meta: {
            title: 'chat',
            icon: 'home',
            keepAlive: true,
        },
    },
];

const baseRoutes = [
    {
        path: '/',
        component: BasicLayout,
        redirect: { name: 'Prompt' },
        children: routes,
    },
    {
        path: '/user',
        component: UserLayout,
        redirect: { name: 'login' },
        children: [
            {
                path: '/user/login',
                name: 'login',
                component: () => import('@/views/User/Login.vue'),
                meta: {
                    title: '登录',
                },
            },
        ],
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/exception/403.vue'),
    },
    {
        path: '/500',
        name: '500',
        component: () => import('@/views/exception/500.vue'),
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/exception/404.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
];

const menu = [
    {
        name: 'Prompt',
    },
    {
        name: 'Group',
    },
    {
        name: 'Chat',
    },
];

const routeMap = {};
routes.forEach((route) => {
    routeMap[route.name] = route;
});

function setMenus(menus) {
    menus.forEach((child) => {
        if (child.children) {
            setMenus(child.children);
        } else {
            const route = routeMap[child.name];
            if (route) {
                Object.keys(route).forEach((key) => {
                    if (key !== 'component') {
                        child[key] = route[key];
                    }
                });
            }
        }
    });
}

setMenus(menu);

export { menu, homeRoute, homeName };

export default baseRoutes;
