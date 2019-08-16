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
            path: '/activityList',
            name: 'activityList',
            props: true,
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
            path: '/speedTest',
            name: 'speedTest',
            component: () =>
                import(/* webpackChunkName: "speedTest" */ './views/speedTest.vue')
        },
        {
            path: '/history',
            name: 'history',
            component: () =>
                import(/* webpackChunkName: "history" */ './views/history.vue')
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
                        import(/* webpackChunkName: "agentManagement" */ '@/components/userCenter/agentManagement.vue')
                },
                {
                    path: 'bettingRecord',
                    name: 'bettingRecord',
                    component: () =>
                        import(/* webpackChunkName: "bettingRecord" */ '@/components/userCenter/bettingRecord.vue')
                },
                {
                    path: 'personalManagement',
                    name: 'personalManagement',
                    props: true,
                    component: () =>
                        import(/* webpackChunkName: "personalManagement" */ '@/components/userCenter/personalManagement.vue')
                },
                {
                    path: 'daySalary',
                    name: 'daySalary',
                    component: () =>
                        import(/* webpackChunkName: "daySalary" */ '@/components/userCenter/daySalary.vue')
                },
                {
                    path: 'lotteryShare',
                    name: 'lotteryShare',
                    component: () =>
                        import(/* webpackChunkName: "lotteryShare" */ '@/components/userCenter/lotteryShare.vue')
                },
                {
                    path: 'transaction',
                    name: 'transaction',
                    component: () =>
                        import(/* webpackChunkName: "lotteryShare" */ '@/components/userCenter/transaction.vue')
                }
            ]
        }
    ]
})
