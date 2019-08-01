<template>
    <div class="home_list">
        <div class="card_container container">
            <countDownCard
                @click.native="jump(4,151,1)"
                :backgroundImageIndex="'new_shanghai.png'"
                :timer="4"
            />
            <countDownCard @click.native="jump(24,2897,4)" :backgroundImageIndex="'new_henei.png'" />
            <countDownCard
                @click.native="jump(22,2870,3)"
                :backgroundImageIndex="'new_beijing.png'"
            />
            <countDownCard
                @click.native="jump(25,2926,3)"
                :backgroundImageIndex="'new_mangu.png'"
                :timer="25"
            />
            <winnerlist />
            <countDownCard
                @click.native="jump(23,2880,3)"
                :backgroundImageIndex="'new_jiangsu.png'"
                :timer="23"
            />
            <countDownCard
                @click.native="jump(17,2581,2)"
                :backgroundImageIndex="'new_dongjing.png'"
            />
        </div>
    </div>
</template>

<script>
import countDownCard from './countDownCard'
import winnerlist from '@/components/home/winnerlist'
import { EventBus } from '@/api/eventBus.js'
export default {
    name: 'home_list',
    components: {
        countDownCard,
        winnerlist
    },
    data() {
        return {}
    },
    methods: {
        jump(lotteryId, menuId, index) {
            if (sessionStorage.getItem('token')) {
                EventBus.$emit('jump', { lotteryId, menuId, index })
            } else {
                this.$Message.error('请先登录')
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.home_list
    padding-top 10px
    padding-bottom 20px
.container
    width 1200px
    margin auto
    overflow hidden
    &.card_container
        display flex
        flex-direction column
        flex-wrap wrap
        height 422px
        justify-content space-between
</style>
