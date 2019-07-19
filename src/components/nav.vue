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
                    <li class="marquee_container">
                        <Marquee />
                    </li>
                </ul>
                <ul class="nav_top_right">
                    <li v-if="this.$store.state.loginCode==1" class="money_content">
                        <div>
                            <div class="money_content_div">
                                <span>账号:</span>
                                <span
                                    ref="dropDownPosition"
                                    style="padding: 0;"
                                    @mouseenter="open('dropDown','dropDownPosition')"
                                >{{this.$store.state.nickname}}</span>
                                <Icon
                                    type="md-arrow-dropdown"
                                    style="font-size:16px;color:#ecc04a;height: 25px;"
                                />
                                <span class="member"></span>
                            </div>
                            <div class="money_content_div">
                                <span>余额:</span>
                                <span>{{this.$store.state.money}}</span>
                                <Icon
                                    @click="refresh"
                                    style="font-size:16px;color:#ecc04a"
                                    type="ios-sync"
                                />
                            </div>
                        </div>
                    </li>
                    <li v-if="this.$store.state.loginCode==0" class="btns login_box">
                        <div class="btns_box">
                            <button
                                ref="loginPosition"
                                class="border_style login"
                                @click="open('login','loginPosition')"
                            >登录</button>
                        </div>
                        <div class="btns_box">
                            <button
                                class="border_style register"
                                ref="registeredPosition"
                                @click="open('registered','registeredPosition')"
                            >注册</button>
                        </div>
                    </li>
                    <li class="btns login_box" v-else>
                        <div class="btns_box">
                            <button class="border_style">
                                <span>充值</span>
                            </button>
                        </div>
                        <div class="btns_box">
                            <button class="border_style tikuan">
                                <span>提款</span>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div style="border-top: 1px solid #424141">
            <div class="nav_bottom fixed_layout">
                <div class="logo_left">
                    <img id="logo" src="../assets/images/page_logo.png" />
                </div>
                <!-- <ul class="nav_list">
                    <router-link tag="li" to="/">首页</router-link>
                    <li>时时彩</li>
                    <li>快乐彩</li>
                    <li>快3</li>
                    <li>低频彩</li>
                    <li class="btn-sign">
                        <button @click="openCenter">
                            <i></i>
                            <span>最新优惠</span>
                        </button>
                    </li>
                </ul> -->
                <div class="nav_list">
                    <router-link class="home" to="/">首页</router-link>
                    <Dropdown>
                        <a href="javascript:void(0)">
                            时时彩
                        </a>
                        <ul slot="list">
                            <li>asd</li>
                            <li>asd</li>
                            <li>asd</li>
                        </ul>
                    </Dropdown>
                    <Dropdown>
                        <a href="javascript:void(0)">
                            快乐彩
                        </a>
                        <ul slot="list">
                            <li>asd</li>
                            <li>asd</li>
                            <li>asd</li>
                        </ul>
                    </Dropdown>
                    <Dropdown>
                        <a href="javascript:void(0)">
                            快3
                        </a>
                        <ul slot="list">
                            <li>asd</li>
                            <li>asd</li>
                            <li>asd</li>
                        </ul>
                    </Dropdown>
                    <Dropdown>
                        <a href="javascript:void(0)">
                            低频彩
                        </a>
                        <ul slot="list">
                            <li>asd</li>
                            <li>asd</li>
                            <li>asd</li>
                        </ul>
                    </Dropdown>
                    <div class="btn-sign">
                        <button @click="openCenter">
                            <i></i>
                            <span>最新优惠</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Login :style="{left:x+'px'}" ref="login" />
        <Registered :style="{left:x+'px'}" ref="registered" />
        <PersonalManagement :style="{left:x+'px'}" ref="dropDown" />
    </div>
</template>
<script>
import Login from '../components/home/login'
import Registered from '../components/home/registered'
import PersonalManagement from '../components/home/personalManagement'
import Marquee from '@/components/home/marquee.vue'
import { Dropdown, DropdownMenu, DropdownItem, Icon } from 'iview'
import {
    getbalance,
    loginOut,
    getMenu,
    getunreadmessageamount
} from '@/api/index.js'
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

        //打开登录页面
        open(target, targetButn, $event) {
            let e = window.event || $event,
                domTarget = event.target || event.srcElement
            //把所有弹窗都关掉
            this.$refs.login.onOff = false //登录
            this.$refs.registered.onOff = false //注册
            this.$refs.dropDown.onOff = false //
            //打开目标弹窗
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
        Dropdown,
        DropdownMenu,
        DropdownItem,
        PersonalManagement
    }
}
</script>

<style lang="stylus" scoped>
.nav
    position fixed
    background #242424
    cursor pointer
    top 0
    width 100%
    z-index 99
.topBox
    height 50px
    background #1a1a1a
    .nav_top
        width 1200px
        margin auto
        overflow hidden
        display flex
        height 100%
        .marquee_container
            max-width 460px
            overflow hidden
        .nav_top_right
            float right
            overflow hidden
            width 394px
            .border_style
                border-left 1px solid #424141
                padding 0 10px
                background linear-gradient(#3ee2ea, #5959ab)
                border-radius 4px
                height 30px
                line-height 30px
                width 68px
                text-align center
                &>span
                    color #fff
                &.tikuan
                    background linear-gradient(#fbc434, #f56250)
                &.login
                    background linear-gradient(rgb(255, 106, 129) 0%, rgb(234, 47, 76) 100%)
                &.register
                    background linear-gradient(rgb(251, 196, 52) 0%, rgb(245, 96, 81) 100%)
            li
                float left
                color #fff
                font-size 12px
                white-space nowrap
                span
                    padding 0 6px
                    color #ecc04a
            .money_content
                overflow hidden
                height 100%
                .member
                    background-image url('../assets/images/member_1.png')
                    width 70px
                    display inline-block
                    height 20px
                    float right
                    margin-top 4px
                    background-repeat no-repeat
                &>div
                    float left
                    line-height 25px
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
    border-radius 4px
    padding 0 20px
    margin 0 6px
    outline none
    height 26px
    line-height 26px
.btns
    display flex
    float left
    align-items center
    height 100%
    &.login_box
        float right !important
    .btns_box
        display flex
        align-items center
        border-left 1px solid #444444
        height 100%
.nav_bottom
    color #fff
    font-size 14px
    overflow hidden
    width 1200px
    margin auto
    line-height 60px
    >>>.ivu-select-dropdown
        border-radius 0
        padding 0
        margin 0
        ul
            li
                background: #222222;
                border-bottom: 2px dotted #444444;
                color: #fff;
                text-align: center;
                width 150px
                &:hover
                    background #444444
                    color #f7c858
    .nav_list
        float right
        display flex
        text-align center
        a.home
            color #fff
            width 82px
            &:hover
                background #ea2f4c
        &>div
            white-space nowrap
            padding 0 20px
            &>>>.ivu-dropdown-rel>a
                color #fff
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
    height 60px
    #logo
        width 140px
        height auto
        margin-top 6px
        margin-right 20px
.is-active
    background #ea2f4c
.login_content
    position relative
    line-height 50px
</style>
