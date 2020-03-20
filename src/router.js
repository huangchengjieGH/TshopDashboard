// noinspection JSAnnotator
import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => {
        require(['./views/login.vue'], resolve);
    }

};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/order/list',
    component: Main,
    children: [
        {
            path: 'order/detail',
            title: '订单详情',
            name: 'order-detail',
            component: resolve => {
                require(['./yyt/order/detail.vue'], resolve);
            }
        },
        {
            path: 'classify/edit',
            title: '新增分类',
            name: 'classify-edit',
            component: resolve => {
                require(['./yyt/classify/edit.vue'], resolve);
            }
        },
        {
            path: 'ad/edit',
            title: '新增广告',
            name: 'ad-edit',
            component: resolve => {
                require(['./yyt/ad/edit.vue'], resolve);
            }
        },
        {
            path: 'adminproduct/edit',
            title: '新增商品',
            name: 'adminproduct-edit',
            component: resolve => {
                require(['./yyt/adminproduct/edit.vue'], resolve);
            }
        },
        {
            path: 'postage/edit',
            title: '新建运费模版',
            name: 'postage-edit',
            component: resolve => {
                require(['./yyt/postage/edit.vue'], resolve);
            }
        },
        {
            path: 'showcase/edit',
            title: '橱窗编辑',
            name: 'showcase-edit',
            component: resolve => {
                require(['./yyt/showcase/edit.vue'], resolve);
            }
        },
        {
            path: 'showcase/detail',
            title: '橱窗详情',
            name: 'showcase-detail',
            component: resolve => {
                require(['./yyt/showcase/detail.vue'], resolve);
            }
        },
        {
            path: 'distributor/detail',
            title: '分销商详情',
            name: 'distributor-detail',
            component: resolve => {
                require(['./yyt/distributor/detail.vue'], resolve);
            }
        },
        {
            path: 'evaluate/edit',
            title: '估价详情',
            name: 'evaluate-edit',
            component: resolve => {
                require(['./yyt/evaluate/edit.vue'], resolve);
            }
        },
        {
            path: 'article/edit',
            title: '文章详情',
            name: 'article-edit',
            component: resolve => {
                require(['./yyt/article/edit.vue'], resolve);
            }
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
// 如果想保持组件keep-alive，组件名和name字段保持一致
export const appRouter = [
    {
        path: '/ad',
        icon: 'android-folder',
        name: 'ad',
        title: '广告管理',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '广告列表',
                name: 'ad-list',
                component: resolve => {
                    require(['./yyt/ad/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/classify',
        icon: 'android-folder',
        name: 'classify',
        title: '分类管理',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '分类列表',
                name: 'classify-list',
                component: resolve => {
                    require(['./yyt/classify/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/article',
        icon: 'android-folder',
        name: 'article',
        title: '文章管理',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '分类列表',
                name: 'article-list',
                component: resolve => {
                    require(['./yyt/article/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/articleclassify',
        icon: 'android-folder',
        name: 'articleclassify',
        title: '文章分类',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '分类列表',
                name: 'articleclassify-list',
                component: resolve => {
                    require(['./yyt/articleclassify/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/order',
        icon: 'android-folder',
        name: 'order',
        title: '订单管理',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '订单列表',
                name: 'order-list',
                component: resolve => {
                    require(['./yyt/order/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/adminproduct',
        icon: 'android-folder',
        name: 'adminproduct',
        title: '商品管理',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '商品列表',
                name: 'adminproduct-list',
                component: resolve => {
                    require(['./yyt/adminproduct/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/postage',
        icon: 'android-folder',
        name: 'postage',
        title: '邮费',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: 'postage',
                name: 'postage-list',
                component: resolve => {
                    require(['./yyt/postage/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/showcase',
        icon: 'android-folder',
        name: 'showcase',
        title: '橱窗管理',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '橱窗管理',
                name: 'showcase-list',
                component: resolve => {
                    require(['./yyt/showcase/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/distributor',
        icon: 'android-folder',
        name: 'showcase',
        title: '分销商',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '橱窗管理',
                name: 'distributor-list',
                component: resolve => {
                    require(['./yyt/distributor/list.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/evaluate',
        icon: 'android-folder',
        name: 'evaluate',
        title: '估价管理',
        role: 'admin',
        show: true,
        component: Main,
        children: [
            {
                path: 'list',
                title: '估价管理',
                name: 'evaluate-list',
                component: resolve => {
                    require(['./yyt/evaluate/list.vue'], resolve);
                }
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter
];
