<template>
    <div class="nav">
        <div class="topBox">
            <div class="nav_top fixed_layout">
                <ul class="line_help">
                    <router-link tag="li" to="/speedTest?id=listContent">PC客户端</router-link>
                    <router-link tag="li" to="/speedTest?id=listContent">手机客户端</router-link>
                    <router-link tag="li" to="/speedTest">线路中心</router-link>
                    <li class="marquee_container">
                        <Marquee />
                    </li>
                </ul>
                <ul class="nav_top_right">
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
                         <div class="btns_box">
                            <button @click="openService" class="border_style kefu">线上客服</button>
                        </div>
                    </li>
                    <li class="btns login_box" v-else>
                        <div class="btns_box">
                            <button @click="handleRecharge('recharge')" class="border_style">
                                <span>充值</span>
                            </button>
                        </div>
                        <div class="btns_box">
                            <button
                                @click="handleRecharge('withdrawal')"
                                class="border_style tikuan"
                            >
                                <span>提款</span>
                            </button>
                        </div>
                        <div class="btns_box">
                            <button
                                @click="handleRecharge('transfer')"
                                class="border_style zhuanzhang"
                            >
                                <span>转账</span>
                            </button>
                        </div>
                        <div class="btns_box">
                            <button @click="openService" class="border_style kefu">线上客服</button>
                        </div>
                    </li>
                    <li
                        v-if="this.$store.state.loginCode==1"
                        class="money_content"
                        style="float:right"
                    >
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

                                <router-link
                                    tag="span"
                                    class="member"
                                    to="/userCenter/personalManagement"
                                >
                                    未读
                                    <i>{{this.$store.state.unReadAmount}}</i>
                                </router-link>
                            </div>
                            <div class="money_content_div">
                                <span>余额:</span>
                                <span>{{this.$store.state.money}}</span>
                                <Icon
                                    @click="refresh"
                                    style="font-size:16px;color:#ecc04a"
                                    type="ios-refresh"
                                />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div style="border-top: 1px solid #424141">
            <div class="nav_bottom fixed_layout">
                <div @click="goBack" class="logo_left">
                    <img id="logo" src="../assets/images/page_logo.png" />
                </div>
                <div class="nav_list" ref="navList">
                    <Menu
                        ref="navMenu"
                        mode="horizontal"
                        style="height:70px;line-height:70px"
                        :active-name="active"
                        @on-select="changeActive"
                    >
                        <MenuItem to="/" name="1">首页</MenuItem>
                        <Submenu name="2">
                            <template slot="title">彩票</template>
                            <MenuGroup title="IG">
                                <MenuItem @click.native="jump('ig_ssc')" name="2-1">IG时时彩</MenuItem>
                                <MenuItem @click.native="jump('ig_hk')" name="2-2">IG香港彩</MenuItem>
                            </MenuGroup>
                        </Submenu>
                        <MenuItem name="3">体育</MenuItem>
                        <MenuItem name="7">真人</MenuItem>
                        <MenuItem name="4">电子</MenuItem>
                        <MenuItem to="/activityList" name="6">最新优惠</MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
        <Login :style="{left:x+'px'}" style="z-index:2" ref="login" v-if="login" />
        <Registered :style="{left:x+'px'}" style="z-index:2" ref="registered" v-if="registered" />
        <PersonalManagement
            :style="{left:x+'px'}"
            style="z-index:901"
            ref="dropDown"
            v-if="dropDown"
        />
        <Modal :width="modalWidth" v-model="alert">
            <p slot="header" class="alertHeader">
                <span>{{handleAlertName()}}</span>
            </p>
            <div>
                <Recharge v-if="alert&&alertName=='recharge'" />
                <Withdrawal v-if="alert&&alertName=='withdrawal'" />
                <Transfer v-if="alert&&alertName=='transfer'" />
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import Login from '../components/home/login'
import Registered from '../components/home/registered'
import PersonalManagement from '../components/home/personalManagement'
import Marquee from '@/components/home/marquee.vue'
import Recharge from '@/components/userCenter/recharge'
import Withdrawal from '@/components/userCenter/withdrawal'
import Transfer from '@/components/userCenter/transfer'
import { Menu, MenuItem, MenuGroup, Submenu, Icon, Modal } from 'iview'
import {
    getbalance,
    loginOut,
    getMenu,
    getunreadmessageamount,
    igLogin
} from '@/api/index.js'
import { EventBus } from '@/api/eventBus.js'
export default {
    name: 'lobby_nav',
    data() {
        return {
            nickname: '',
            id: '',
            x: 0,
            y: 0,
            alert: false,
            alertName: '',
            active: '1',
            modalWidth: '1200px',
            login: false,
            registered: false,
            dropDown: false
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
            getunreadmessageamount().then(res => {
                this.$store.dispatch(
                    'handleUnReadAmount',
                    res.data.unreadamount
                )
            })
        }
        if (sessionStorage.getItem('navActive')) {
            this.$refs[
                'navMenu'
            ].currentActiveName = this.active = sessionStorage.getItem(
                'navActive'
            )
        }
        EventBus.$on('updateNaveIndex', () => {
            this.$refs[
                'navMenu'
            ].currentActiveName = this.active = sessionStorage.getItem(
                'navActive'
            )
        })
    },
    methods: {
        goBack() {
            this.$router.push('/')
            this.$refs['navMenu'].currentActiveName = this.active = '1'
            sessionStorage.setItem('navActive', '1')
            this.$nextTick(() => {
                this.$refs['navMenu'].updateActiveName()
            })
        },
        openService() {
            window.globalVisitHandle.openInitiatedChat(!1)
        },
        handleAlertName() {
            switch (this.alertName) {
                case 'recharge':
                    return '充值'
                    break
                case 'withdrawal':
                    return '提款'
                    break
                default:
                    return '转账'
                    break
            }
        },
        jump(value) {
            if (sessionStorage.getItem('token')) {
                igLogin({
                    gamecode: value,
                    device: 'PC'
                }).then(res => {
                    window.open(res.data.data_code, '_black')
                })
            } else {
                this.$Message.success('请先登录')
            }
        },
        //保存navActive
        changeActive(name) {
            if (name == 1 || name == '2-1' || name == '2-2' || name == 6) {
                sessionStorage.setItem('navActive', name)
            } else {
                this.$Message.success('即将开放')
                this.$refs['navMenu'].currentActiveName = this.active = '1'
                sessionStorage.setItem('navActive', '1')
            }
        },
        //验证是否登录，再打开充值界面
        handleRecharge(value) {
            if (!sessionStorage.getItem('token')) {
                this.$Message.error('请先登录')
                this.open('login', 'loginPosition')
            } else {
                if (value == 'transfer') {
                    this.modalWidth = '820px'
                }
                if (value == 'recharge') {
                    this.modalWidth = '800px'
                }
                this.alert = true
                this.alertName = value
            }
        },
        //验证是否登录，是否跳转投注页面
        checkToken(value) {
            if (!sessionStorage.getItem('token')) {
                this.$Message.error('请先登录')
                this.open('login', 'loginPosition')
            } else {
                window.open(sessionStorage.getItem('igUrl'), '_black')
            }
        },

        //刷新金额
        refresh() {
            getbalance().then(res => {
                this.$router.go()
            })
        },

        //打开登录页面
        open(target, targetButn, $event) {
            let e = window.event || $event,
                domTarget = event.target || event.srcElement
            //把所有弹窗都关掉
            this.login = false //登录
            this.registered = false //注册
            this.dropDown = false //
            //打开目标弹窗
            switch (target) {
                case 'login':
                    this.login = true
                    break
                case 'registered':
                    this.registered = true
                    break
                case 'dropDown':
                    this.dropDown = true
                    break
                default:
                    break
            }

            this.$nextTick(() => {
                this.x =
                    this.getElementLeft(this.$refs[targetButn]) +
                    this.$refs[targetButn].offsetWidth / 2 -
                    this.$refs[target].$el.offsetWidth / 2

                if (
                    this.x + this.$refs[target].$el.offsetWidth + 20 >
                    window.innerWidth
                ) {
                    this.x =
                        window.innerWidth -
                        this.$refs[target].$el.offsetWidth -
                        20
                }
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
        Menu,
        MenuItem,
        MenuGroup,
        Submenu,
        PersonalManagement,
        Modal,
        Recharge,
        Withdrawal,
        Transfer
    }
}
</script>

<style lang="stylus" scoped>
>>>.ivu-modal-content
    border-radius 0
>>>.ivu-modal-header
    background #000
    p
        color #fff
        text-align center
.nav
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
            width 534px
            .border_style
                border-left 1px solid #424141
                padding 0 10px
                background-image linear-gradient(rgb(234, 47, 76) 0%, rgb(255, 106, 129) 100%)
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
                &.zhuanzhang
                    background-image linear-gradient(rgb(91, 47, 234) 0%, rgb(106, 141, 255) 100%)
                &.kefu
                    background-image linear-gradient(rgb(111, 135, 250) 0%, rgb(95, 245, 233) 100%)
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
                    width 70px
                    display inline-block
                    height 20px
                    float right
                    background-repeat no-repeat
                    i
                        display inline-block
                        color #ff0000
                        background #ecc04a
                        border-radius 30px
                        height 14px
                        width 14px
                        line-height 12px
                        text-indent 2px
                        font-style normal
                &>div
                    float left
                    line-height 25px
                button
                    margin-top 6px
                    &.refresh
                        background #d49815
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
    height 70px
    width 1200px
    margin auto
    line-height 70px
    >>>.ivu-menu
        z-index 2
    >>>.ivu-select-dropdown
        border-radius 0
        padding 0
        margin 0
        ul
            li
                background #222222
                border-bottom 2px dotted #444444
                color #fff
                text-align center
                width 150px
                &:hover
                    background #444444
                    color #f7c858
    >>>.ivu-menu-light
        background #242424
    >>>.ivu-menu-item-selected, .ivu-menu-opened, .ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item:hover, .ivu-menu-child-item-active
        background #ff0000
        color #fff !important
        border none !important
    >>>.ivu-menu-item, .ivu-menu-submenu
        color #fff !important
        border none !important
        &:hover
            background #ff0000
            color #fff !important
            border none !important
    >>>.ivu-menu-light:after
        width 0
    .nav_list
        float right
        display flex
        text-align center
.logo_left
    float left
    height 60px
    margin 5px 0 0 0
    #logo
        height auto
        margin-top 6px
        margin-right 20px
</style>
