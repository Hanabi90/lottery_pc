<template>
    <div class="marquee">
        <div class="box">
            <p>最新公告：</p>
            <p>
                <marquee-text :duration="speed">{{textList}}</marquee-text>
            </p>
        </div>
    </div>
</template>

<script>
import MarqueeText from 'vue-marquee-text-component'
import { getnotice } from '@/api/index'
export default {
    data() {
        return {
            textList: '',
            speed: 40
        }
    },
    mounted() {
        getnotice().then(res => {
            this.speed *= res.data.affects
            res.data.results.forEach(item => {
                this.textList += item.subject + item.content
            })
        })
    },
    components: {
        MarqueeText
    }
}
</script>

<style lang="stylus" scoped>
.marquee
    color #e4d4a2
    font-size 12px
    line-height 50px
    cursor pointer
    .box
        width 593px
        margin auto
        overflow hidden
        .marquee-text-wrap
            width 500px
        p:nth-child(1)
            float left
        p:nth-child(2)
            overflow hidden
            float left
</style>
