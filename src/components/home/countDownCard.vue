<template>
    <div class="countDownCard" @click="goto()">
        <div class="timer" v-if="timer">{{countDown}}</div>
        <img ondragstart="return false" :src="backgroundArr" alt />
    </div>
</template>

<script>
import { getissue } from '../../api/index'
export default {
    data() {
        return {
            backgroundArr: require(`../../assets/images/${this.backgroundImageIndex}`),
            saleend: '',
            timercount: '',
            interval: null
        }
    },
    props: {
        backgroundImageIndex: {
            type: String,
            required: true
        },
        timer: {
            type: Number,
            default: 0
        }
    },
    methods: {
        goto() {
            this.$router.push({})
        },
        handleIssues() {
            let lotteryid = this.timer
            getissue({
                lotteryid
            }).then(res => {
                this.saleend = res.data.saleend
                let now = Math.trunc(
                        Date.parse(res.data.nowtime.replace(/-/g, '/')) / 1000
                    ),
                    date = Math.trunc(
                        Date.parse(res.data.saleend.replace(/-/g, '/')) / 1000
                    ),
                    open = Math.trunc(
                        Date.parse(res.data.opentime.replace(/-/g, '/')) / 1000
                    ),
                    opentime = open - now
                this.timercount = date - now
                this.interval = setInterval(() => {
                    this.timercount--
                    if (this.timercount <= 0) {
                        this.timercount = 0
                        clearInterval(this.interval)
                        this.handleIssues()
                    }
                }, 1000)
            })
        },
        formatSeconds(value) {
            var secondTime = parseInt(value) // 秒
            var minuteTime = 0 // 分
            var hourTime = 0 // 小时
            if (secondTime > 60) {
                //如果秒数大于60，将秒数转换成整数
                //获取分钟，除以60取整数，得到整数分钟
                minuteTime = parseInt(secondTime / 60)
                //获取秒数，秒数取佘，得到整数秒数
                secondTime = parseInt(secondTime % 60)
                //如果分钟大于60，将分钟转换成小时
                if (minuteTime > 60) {
                    //获取小时，获取分钟除以60，得到整数小时
                    hourTime = parseInt(minuteTime / 60)
                    //获取小时后取佘的分，获取分钟除以60取佘的分
                    minuteTime = parseInt(minuteTime % 60)
                }
            }
            var result = '' + parseInt(secondTime) + '秒'

            if (minuteTime > 0) {
                result = '' + parseInt(minuteTime) + '分' + result
            }
            if (hourTime > 0) {
                result = '' + parseInt(hourTime) + '小时' + result
            }
            return result
        }
    },
    computed: {
        countDown() {
            return this.formatSeconds(this.timercount)
        }
    },
    created() {
        if (this.timer) {
            this.handleIssues()
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>

<style lang="stylus" scoped>
.countDownCard
    position relative
    .timer
        position absolute
        top 116px
        left 26px
        color #fff
        font-size 30px
        font-weight bold
</style>
