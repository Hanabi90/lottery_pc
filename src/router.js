import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkExactActiveClass: 'is-active',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/lottery',
            name: 'lottery',
            component: () =>
                import(/* webpackChunkName: "lottery" */ './views/lottery.vue')
        },
        {
            path: '/test',
            name: 'test',
            component: () =>
                import(/* webpackChunkName: "test" */ './views/test.vue')
        },
        {
            path: '/activityList',
            name: 'activityList',
            component: () =>
                import(/* webpackChunkName: "activityList" */ './views/activityList.vue')
        },
        {
            path: '/registered',
            name: 'registered',
            component: () =>
                import(/* webpackChunkName: "registered" */ './views/registered.vue')
        },
        {
            path: '/userCenter',
            name: 'userCenter',
            component: () =>
                import(/* webpackChunkName: "userCenter" */ './views/userCenter.vue'),
            children: [
                {
                    path: 'agentManagement',
                    name: 'agentManagement',
                    component: () =>
                        import(/* webpackChunkName: "openAccountLine" */ '@/components/userCenter/agentManagement.vue')
                },
                {
                    path: 'noGameHistory',
                    name: 'noGameHistory',
                    component: () =>
                        import(/* webpackChunkName: "noGameHistory" */ '@/components/userCenter/noGameHistory.vue')
                },
                {
                    path: 'gameHistory',
                    name: 'gameHistory',
                    component: () =>
                        import(/* webpackChunkName: "noGameHistory" */ '@/components/userCenter/gameHistory.vue')
                },
                {
                    path: 'traceHistory',
                    name: 'traceHistory',
                    component: () =>
                        import(/* webpackChunkName: "noGameHistory" */ '@/components/userCenter/traceHistory.vue')
                },
                {
                    path: 'bettingRecord',
                    name: 'bettingRecord',
                    component: () =>
                        import(/* webpackChunkName: "noGameHistory" */ '@/components/userCenter/bettingRecord.vue')
                },
                {
                    path: 'personalManagement',
                    name: 'personalManagement',
                    component: () =>
                        import(/* webpackChunkName: "noGameHistory" */ '@/components/userCenter/personalManagement.vue')
                }
            ]
        }
    ]
})
