<template>
    <div class="home_list">
        <div class="card_container container">
            <countDownCard :backgroundImageIndex="'new_shanghai.png'" :timer=4 />
            <countDownCard :backgroundImageIndex="'new_henei.png'" />
            <countDownCard :backgroundImageIndex="'new_beijing.png'" />
            <countDownCard :backgroundImageIndex="'new_mangu.png'" :timer=25 />
            <div class="rank">
                <img src="../../assets/images/new_paihang.png" alt="">
            </div>
            <countDownCard :backgroundImageIndex="'new_jiangsu.png'" :timer=23 />
            <countDownCard :backgroundImageIndex="'new_dongjing.png'" />
        </div>
    </div>
</template>

<script>
import countDownCard from './countDownCard'
export default {
    name: 'home_list',
    components:{
        countDownCard
    },
    data() {
        return {
            
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
        height: 422px;
        justify-content: space-between;

</style>
