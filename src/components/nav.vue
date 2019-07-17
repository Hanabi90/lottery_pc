<template>
    <div class="nav">
        <div class="topBox">
            <div class="nav_top fixed_layout">
                <ul class="flag">
                    <li>
                        <i></i>
                        <span>中国-简体中文</span>
                    </li>
                </ul>
                <ul class="line_help">
                    <li>PC客户端</li>
                    <li>手机客户端</li>
                    <li>线路中心</li>
                    <li>
                        <Marquee />
                    </li>
                </ul>
                <ul class="nav_top_right">
                    <li v-if="this.$store.state.loginCode==0" class="login_content">
                        <button ref="loginPosition" @click="open('login','loginPosition')">登录</button>
                        <button
                            ref="registeredPosition"
                            @click="open('registered','registeredPosition')"
                        >注册</button>
                    </li>
                    <li v-else-if="this.$store.state.loginCode==1" class="money_content">
                        <div>
                            <div>
                                <span>账号:</span>
                                <span>{{this.$store.state.nickname}}</span>
                                <span>高级会员</span>
                                <Icon type="ios-arrow-down" />
                            </div>
                            <div>
                                <span>余额:</span>
                                <span>{{this.$store.state.money}}</span>
                                <Icon
                                    @click="refresh"
                                    style="font-size:20px;color:#d49815"
                                    type="md-refresh-circle"
                                />
                            </div>
                        </div>
                        <button @click="loginOut">退出</button>
                    </li>
                    <li class="border_style">
                        <span>充值</span>
                    </li>
                    <li class="border_style">
                        <span>提款</span>
                    </li>
                </ul>
            </div>
        </div>
        <div style="border-top: 1px solid #424141">
            <div class="nav_bottom fixed_layout">
                <div class="logo_left">
                    <img id="logo" src="../assets/images/page_logo.png" />
                    <img id="vwin-logo" src="../assets/images/vwin-logo-acmiland-cn.png" />
                </div>
                <ul class="nav_list">
                    <router-link tag="li" to="/">首页</router-link>
                    <li>时时彩</li>
                    <li>快乐彩</li>
                    <li>快3</li>
                    <li>低频彩</li>
                    <router-link tag="li" to="/activityList">最新优惠</router-link>
                    <li class="btn-sign">
                        <button @click="openCenter">
                            <i></i>
                            <span>个人中心</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <Login :style="{left:x+'px'}" ref="login" />
        <Registered :style="{left:x+'px'}" ref="registered" />
    </div>
</template>
<script>
import Login from '../components/home/login'
import Fast from '../components/home/fast'
import Registered from '../components/home/registered'
import Marquee from '@/components/home/marquee.vue'
import {
    getbalance,
    loginOut,
    getMenu,
    getunreadmessageamount
} from '@/api/index.js'
import { Icon } from 'iview'
export default {
    name: 'lobby_nav',
    data() {
        return {
            nickname: '',
            id: '',
            x: 0,
            y: 0
        }
    },
    mounted() {
        if (sessionStorage.getItem('token')) {
            this.$store.dispatch('handleLogin', 1)
            this.$store.dispatch(
                'handleNickName',
                sessionStorage.getItem('nickname')
            )
            getbalance().then(res => {
                this.$store.dispatch('handleMoney', res.data.money)
            })
            getMenu().then(res => {
                this.$store.dispatch('handleLotteryMenue', { ...res.data })
            })
        }
        this.$router.onReady(() => {
            this.$store.dispatch('handleMenuId', this.$route.query.menuId)
        })
    },
    methods: {
        //个人中心
        openCenter() {
            if (this.$store.state.loginCode) {
                let onOff = this.$store.state.userCenter
                this.$store.dispatch('handleUserCenter', !onOff)
                getunreadmessageamount().then(res => {
                    this.$store.dispatch(
                        'handleUnReadAmount',
                        res.data.unreadamount
                    )
                })
            } else {
                this.open('login', 'loginPosition')
            }
        },
        //跳转
        jump(lotteryId, menuId, group) {
            this.$store.dispatch('handleMenuId', menuId)
            this.$router.push({ path: 'lottery', query: { menuId: menuId } })
            sessionStorage.setItem('lotteryId', lotteryId)
            this.$store.dispatch('handleHackReset', false)
            this.$nextTick(() => {
                this.$store.dispatch('handleHackReset', true)
                this.$store.dispatch('handleOrderList', { type: 'clear' })
                this.$store.dispatch('handleTrace', false)
            })
            sessionStorage.setItem('group', group)
        },
        //刷新金额
        refresh() {
            getbalance().then(res => {
                this.$router.go()
            })
        },
        //退出登录
        loginOut() {
            loginOut().then(res => {
                if (res.code == 0) {
                    sessionStorage.clear()
                    this.$Message.success('退出成功')
                    this.$store.dispatch('handleReset')
                    this.$router.push('/')
                }
            })
        },
        //打开登录页面
        open(target, targetButn, $event) {
            let e = window.event || $event,
                domTarget = event.target || event.srcElement
            for (const iterator in this.$refs) {
                this.$refs[iterator].onOff = false
            }
            this.$refs[target].onOff = true
            this.$nextTick(() => {
                this.x =
                    this.getElementLeft(this.$refs[targetButn]) +
                    this.$refs[targetButn].offsetWidth / 2 -
                    this.$refs[target].$el.offsetWidth / 2
            })

            this.y =
                this.getElementTop(this.$refs[targetButn]) -
                this.$refs[targetButn].offsetTop * 2
        },
        getElementLeft(element) {
            var actualLeft = element.offsetLeft
            var current = element.offsetParent

            while (current !== null) {
                actualLeft += current.offsetLeft
                current = current.offsetParent
            }

            return actualLeft
        },

        getElementTop(element) {
            var actualTop = element.offsetTop
            var current = element.offsetParent

            while (current !== null) {
                actualTop += current.offsetTop
                current = current.offsetParent
            }

            return actualTop
        }
    },
    components: {
        Login,
        Registered,
        Icon,
        Marquee,
        Fast
    }
}
</script>

<style lang="stylus" scoped>
.nav
    position fixed
    background mainColor
    cursor pointer
    top 0
    width 100%
    z-index 99
.topBox
    background #1a1a1a
    .nav_top
        width 1200px
        margin auto
        overflow hidden
        .nav_top_right
            float right
            overflow hidden
            li
                float left
                color #fff
                font-size 12px
                white-space nowrap
                span
                    padding 0 6px
                    color #f7e6b0
            .money_content
                overflow hidden
                &>div
                    float left
                button
                    margin-top 6px
                    &.refresh
                        background #d49815
        .flag
            color #aaa
            line-height 50px
            font-size 13px
            float left
            margin-right 10px
            i
                background url('../assets/images/flag.png')
                display inline-block
                height 17px
                width 17px
                margin-bottom -4px
                margin-right 10px
                background-position -17px 0
        .line_help
            float left
            color #aaa
            line-height 50px
            display flex
            li
                white-space nowrap
                padding 0 7px
                font-size 12px
                border-right 1px solid #444444
                &:first-child
                    border-left 1px solid #444444
                &:last-child
                    border-right none
button
    background #d83f41
    border none
    color #fff
    border-radius 16px
    padding 0 20px
    margin 0 6px
    outline none
    height 26px
    line-height 26px
.border_style
    line-height 40px
    border-left 1px solid #424141
    padding 0 10px
.nav_bottom
    color #fff
    font-size 14px
    overflow hidden
    width 1200px
    margin auto
    line-height 75px
    .nav_list
        float right
        display flex
        &>li
            white-space nowrap
            padding 0 20px
            &:hover
                background #ea2f4c
                color #fff
            &:last-child:hover
                background none
            &[data-lottery='ture']:hover
                div
                    display block
            &[data-lottery='ture']
                div
                    position absolute
                    background #000000
                    overflow hidden
                    line-height 26px
                    left 50%
                    display none
                    ul
                        float left
                        margin 10px
                        h5
                            font-size 14px
                            margin-bottom 10px
                        li
                            font-size 12px
                            color #e8e8e8
                            span
                                padding 6px 10px
                                border-radius 6px
                            &:hover
                                span
                                    background #ea2f4c
                                    color #fff
.btn-sign
    button:hover
        i
            background url('../assets/images/ic-nav-gift-2.png') bottom no-repeat
            background-size 16px auto
        span
            color #ff0000
    button
        background #fff
        color #000
        padding 10px 14px
        height 36px
        line-height 0
        i
            display inline-block
            background url('../assets/images/ic-nav-gift.png') bottom no-repeat
            background-size 16px auto
            width 16px
            height 14px
            margin-right 4px
            margin-bottom -2px
.logo_left
    float left
    height 70px
    #logo
        width 140px
        height auto
        margin-top 6px
        margin-right 20px
    #vwin-logo
        width 182px
        height auto
.is-active
    background #ea2f4c
.login_content
    position relative
    line-height 40px
</style>
