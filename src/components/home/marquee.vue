<template>
    <div class="marquee">
        <div class="box">
            <p>最新公告：</p>
            <p>
                <marquee-text v-if="textList" :duration="speed">
                    <div class="content" v-html="textList" @click="handleAlert($event)"></div>
                </marquee-text>
            </p>
        </div>
        <notice ref="notice"></notice>
    </div>
</template>

<script>
import MarqueeText from 'vue-marquee-text-component'
import { getnotice } from '@/api/index'
import notice from '../userCenter/notice'
export default {
    data() {
        return {
            textList: '',
            speed: 40
        }
    },
    methods: {
        handleAlert(e) {
            var index = e.srcElement.getAttribute('data-index')
            this.$refs.notice.handleAlert(index)
        }
    },
    mounted() {
        getnotice().then(res => {
            this.speed *= res.data.affects
            res.data.results.forEach((item, index) => {
                this.textList += `<span  data-index="${index}">${item.subject}${item.content}</span>`
            })
        })
    },
    components: {
        MarqueeText,
        notice
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
            width 380px
            >>>.content
                span
                    float left
                    height 100%
</style>
