<template>
    <div class="userCenterBox">
        <ul class="userNav">
            <li>
                <Icon type="md-people" size="20" />团队管理
            </li>
            <router-link tag="li" to="agentManagement">团队推广</router-link>
            <!-- <router-link tag="li" to="daySalary">彩票日工资契约</router-link>
            <router-link tag="li" to="lotteryShare">彩票分红契约</router-link>-->
            <li @click="jump('daySalary')">彩票日工资契约</li>
            <li @click="jump('lotteryShare')">彩票分红契约</li>
            <router-link tag="li" to="personalManagement">
                <Icon type="md-person" size="20" />个人管理
            </router-link>
            <li>
                <Icon type="ios-paper" size="20" />报表中心
            </li>
            <router-link tag="li" to="bettingRecord">投注记录</router-link>
            <router-link tag="li" to="transaction">交易明细</router-link>
        </ul>
        <div class="container" :class="{personalManagement:$route.name=='personalManagement'}">
            <router-view :ref="$route.name"></router-view>
        </div>
    </div>
</template>

<script>
import { Icon } from 'iview'
export default {
    name: 'userCenter',
    data() {
        return {
            userData: JSON.parse(sessionStorage.getItem('userSeting'))
        }
    },
    methods: {
        jump(value) {
            if (value == 'daySalary') {
                if (this.userData.contractdaliy == 1) {
                    this.$router.push('/daySalary')
                } else {
                    this.$Message.error('请联系客服洽谈')
                }
            }
            if (value == 'lotteryShare') {
                if (this.userData.contractmonthly == 1) {
                    this.$router.push('/lotteryShare')
                } else {
                    this.$Message.error('请联系客服洽谈')
                }
            }
        }
    },
    components: {
        Icon
    }
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
    padding-top 20px
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
            position relative
            cursor pointer
            &.is-active
                background #ffd100
                color #333333
            &>>>.ivu-icon
                position absolute
                top 50%
                left 20px
                transform translateY(-50%)
            &:nth-child(1), &:nth-child(6)
                cursor initial
    .container
        margin-left 20px
        background #202020
        &.personalManagement
            background transparent
</style>
