<template>
    <div class="speedTest">
        <div class="nav">
            <div class="imgContent">
                <img @click="$router.push({ path: '/' })" src="../assets/images/page_logo.png" />
            </div>
        </div>
        <div class="speedContent">
            <div class="title">
                <img src="../assets/images/speedIcon.png" alt />
                <p>奥德赛-线路入口</p>
            </div>
            <div class="listContent">
                <h5>请选择最快的链接进入网站</h5>
                <ul>
                    <li v-for="(item,index) of url" :key="index">
                        <span>线路1</span>
                        <span>
                            {{item}} 线路检测
                            <i>{{pingList[index] | getTime}}秒</i>
                        </span>
                        <span @click="jump(item)">立即进入</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="speedBottom">
            <div class="imgBox">
                <img src="../assets/images/speedImg.png" alt />
            </div>
            <div class="listContent">
                <div class="list">
                    <p>IOS客户端</p>
                    <img src="../assets/images/qrcode.png" alt />
                    <button>扫一扫下载IOS APP版本</button>
                </div>
                <div class="list">
                    <p>安卓客户端</p>
                    <img src="../assets/images/qrcode.png" alt />
                    <button>扫一扫下载安卓 APP版本</button>
                </div>
                <div class="list">
                    <p>Pc/Mac客户端</p>
                    <img src="../assets/images/qrcode.png" alt />
                    <button>扫一扫下载Pc/Mac版本</button>
                </div>
            </div>
        </div>
        <span class="box" ref="box"></span>
    </div>
</template>

<script>
export default {
    name: 'speedTest',
    data() {
        return {
            url: [
                'https://www.obolbetonline.com',
                'https://lottery-test.hoyibet.com'
            ],
            pingList: []
        }
    },
    filters: {
        getTime(value) {
            if (value) {
                return Number(value) / 1000
            } else {
                return '...'
            }
        }
    },
    methods: {
        newRequest() {
            for (let index = 0; index < this.url.length; index++) {
                const url = this.url[index]
                let startTime = new Date().getTime()
                let img = document.createElement('img')
                img.src = url + 'speedTest' + Math.random() + '.jpg'
                img.style.display = 'none'
                img.onerror = () => {
                    let endTime = new Date().getTime()
                    this.$set(this.pingList, index, endTime - startTime)
                }
                this.$refs.box.appendChild(img)
            }
        },
        jump(url) {
            window.open(url, '_blank')
        }
    },
    mounted() {
        this.newRequest()
    }
}
</script>

<style lang="stylus" scoped>
.speedTest
    .nav
        background #242424
        margin-bottom 20px
        .imgContent
            width 1200px
            margin auto
            padding 5px 0
            img
                cursor pointer
    .speedContent
        width 1200px
        height 390px
        overflow hidden
        margin auto
        padding-left 250px
        position relative
        margin-bottom 120px
        .title
            width 250px
            height 390px
            position absolute
            left 0
            top 0
            background #ea2f4c
            text-align center
            color #fff
            font-size 20px
            padding-top 150px
        .listContent
            height 390px
            background #222222
            padding 40px 20px
            h5
                font-size 16px
                color #fff
                margin-bottom 26px
            ul
                display flex
                flex-wrap wrap
                li
                    overflow hidden
                    margin-bottom 20px
                    &:nth-child(odd)
                        margin-right 10px
                    span
                        float left
                        height 40px
                        text-align center
                        line-height 40px
                        color #fff
                    span:nth-child(1)
                        width 60px
                        background #000
                    span:nth-child(2)
                        width 306px
                        background #555555
                    span:nth-child(3)
                        width 80px
                        cursor pointer
                        background-image linear-gradient(0deg, rgb(234, 47, 76) 0%, rgb(255, 106, 129) 100%)
    .speedBottom
        width 1200px
        margin auto
        padding-left 484px
        position relative
        background #222
        margin-bottom 20px
        .imgBox
            position absolute
            left 80px
            top -60px
        .listContent
            padding 20px 10px
            display flex
            .list
                width 202px
                text-align center
                margin-right 20px
                p
                    font-size 18px
                    color #fff
                img
                    margin 20px 0
                button
                    border-radius 5px
                    background-color rgb(255, 35, 69)
                    width 202px
                    height 38px
                    border none
                    color #fff
                    cursor pointer
                    outline none
</style>

