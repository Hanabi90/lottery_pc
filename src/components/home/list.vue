<template>
    <div class="home_list">
        <div class="card_container container">
            <div>
                <countDownCard
                    @click.native="jump('ig_hk')"
                    style="margin-bottom:30px"
                    :backgroundImageIndex="'ig.png'"
                />
                <countDownCard @click.native="jump('ig_2')" :backgroundImageIndex="'pk10.png'" />
            </div>
            <div style="margin:0 20px">
                <countDownCard @click.native="jump('ig_16')" :backgroundImageIndex="'feiting.png'" />
            </div>
            <div>
                <countDownCard
                    @click.native="$Message.error('即将上线')"
                    style="margin-bottom:30px"
                    :backgroundImageIndex="'tiyu.png'"
                />
                <countDownCard
                    @click.native="$Message.error('即将上线')"
                    :backgroundImageIndex="'laohuji.png'"
                />
            </div>
        </div>
    </div>
</template>

<script>
import countDownCard from './countDownCard'
import { EventBus } from '@/api/eventBus.js'
import { igLogin } from '@/api/index.js'
export default {
    name: 'home_list',
    components: {
        countDownCard
    },
    data() {
        return {}
    },
    methods: {
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
</style>
