<template>
    <div class="userCenterBox">
        <ul class="userNav">
            <li>团队管理</li>
            <router-link tag="li" to="agentManagement">团队推广</router-link>
            <li>彩票日工资契约</li>
            <li>彩票分红契约</li>
            <li>个人管理</li>
            <li>彩票报表</li>
            <router-link tag="li" to="bettingRecord">投注记录</router-link>
            <router-link tag="li" to="traceHistory">游戏追号记录</router-link>
            <router-link tag="li" to="gameHistory">游戏账变记录</router-link>
            <router-link tag="li" to="noGameHistory">非游戏账变记录</router-link>
        </ul>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'userCenter',
    data() {
        return {}
    },
    methods: {},
    components: {}
}
</script>

<style lang="stylus" scoped>
.userCenterBox
    width 1200px
    margin auto
    padding-left 200px
    min-height 420px
    position relative
    margin-bottom 20px
    .userNav
        width 200px
        font-size 16px
        background #202020
        border 1px solid #333333
        border-radius 5px
        position absolute
        left 0
        li
            line-height 40px
            color #ffffff
            padding-left 48px
            &.is-active
                background #ffd100
                color #333333
    .container
        margin-left 20px
        min-height 1020px
        background #202020
</style>
