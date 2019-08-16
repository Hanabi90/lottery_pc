<template>
    <div class="rightListBar">
        <ul class="list">
            <li>
                <Icon size="40" type="md-contacts" />
                <p>客服中心</p>
            </li>
            <li @click="handleTransfer">
                <Icon size="40" type="ios-reverse-camera" />
                <p>转账</p>
            </li>
            <li>
                <Icon size="40" type="ios-refresh-circle" />
                <p>代理加盟</p>
            </li>
        </ul>
    </div>
</template>

<script>
import { Icon } from 'iview'
export default {
    name: 'rightListBar',
    methods: {
        handleTransfer() {
            if (sessionStorage.getItem('token')) {
                this.$parent.alert = true
            } else {
                this.$Message.success('请先登录')
            }
        }
    },
    components: {
        Icon
    }
}
</script>

<style lang="stylus" scoped>
.rightListBar
    position fixed
    right 30px
    top 350px
    z-index 4
    .list
        li
            background #fff
            color #ff0000
            height 70px
            width 70px
            border-radius 10px
            text-align center
            font-size 16px
            margin-bottom 20px
            &:hover
                background #ff0000
                color #fff
</style>
