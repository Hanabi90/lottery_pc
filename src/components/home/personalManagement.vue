<template>
    <div v-if="this.onOff" class="personalManagement" @mouseleave="close">
        <div class="box"></div>
        <div class="title">你好，{{$store.state.nickname}}</div>
        <ul>
            <router-link tag="li" to="/userCenter/agentManagement">个人中心</router-link>
            <li>代理管理</li>
            <li>我的消息</li>
        </ul>
        <div class="logout" @click="loginOut">
            <Icon type="md-power" />
            <span>退出游戏</span>
        </div>

        <div class="login_history">
            <span>上次登录</span>
            <span>2019-07-11 13:50:50</span>
        </div>
    </div>
</template>

<script>
import { loginOut } from '@/api/index.js'
import { Icon } from 'iview'
export default {
    name: 'personalManagement',
    data() {
        return {
            onOff: false
        }
    },
    methods: {
        close() {
            this.onOff = false
        },
        loginOut() {
            loginOut().then(res => {
                if (res.code == 0) {
                    sessionStorage.clear()
                    this.$Message.success('退出成功')
                    this.$store.dispatch('handleReset')
                    this.$router.push('/')
                    this.close()
                }
            })
        }
    },
    mounted() {},
    components: {
        Icon
    }
}
</script>

<style lang="stylus" scoped>
.personalManagement
    width 378px
    position absolute
    right -157px
    top 45px
    line-height normal
    animation fadeInDown ease 0.3s
    height 284px
    width 190px
    padding 20px
    background-color #f7c858
    text-align center
    color #000
    &::before
        content ''
        position absolute
        top -10px
        left 50%
        transform translateX(-50%)
        width 0
        height 0
        border-style solid
        border-width 0 10px 10px 10px
        border-color transparent transparent #f7c858 transparent
    ul
        display flex
        justify-content center
        flex-direction column
        font-size 14px
        margin-top 10px
        li
            border 1px solid #000
            height 38px
            line-height 36px
            margin-bottom 10px
            border-radius 4px
            &:hover
                border none
                color #fff
                background #ea2f4c
    .box
        position absolute
        top -100px
        height 100px
        width 190px
        background transparent
    .logout
        line-height 38px
        border-top 1px solid #000
        border-bottom 1px solid #000
        margin-bottom 10px
        display flex
        justify-content center
        align-items center
        span
            padding 0 4px
    .login_history
        display flex
        flex-direction column
        span
            color #755d0c
            height 20px
@keyframes fadeInDown
    from
        transform translate3d(0, -100%, 0)
    to
        transform translate3d(0, 0, 0)
</style>



