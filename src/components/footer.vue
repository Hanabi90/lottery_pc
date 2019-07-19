<template>
    <div class="page_footer">
        <div class="container">
            <div class="list_container">
                <div class="top">
                    <div class="list">
                        <h5>牌照</h5>
                        <div></div>
                    </div>
                    <div class="list">
                        <h5>存款</h5>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                </div>
                <div class="bottom">
                    <div class="list">
                        <h5>合作伙伴</h5>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div class="list">
                        <h5>博彩责任</h5>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div class="list">
                        <h5>信息安全</h5>
                        <div></div>
                    </div>
                </div>
            </div>
            <div class="footer_border"></div>
            <ul class="about">
                <li>
                    <h5>产品下载</h5>
                    <p>PC客户端</p>
                    <p>手机客户端</p>
                    <p>快速登录器</p>
                    <p>防劫持教程</p>
                </li>
                <li>
                    <h5>使用帮助</h5>
                    <p>如何存款</p>
                    <p>常见问题</p>
                    <p>玩法介绍</p>
                </li>
                <li class="proxy">
                    <div class="contact">
                        <i></i>
                        <p>
                            <span>400-120-8228</span>
                            <span>国内24小时服务电话</span>
                        </p>
                    </div>
                    <div>
                        <p>2009-2019  奥赛德娱乐 Odyssey Entertainment 版权所有 菲律宾政府 PAGCOR 博彩拍照认证</p>
                        <p>奥德赛娱乐郑重提示：彩票有风险，投注须谨慎。不向未满18岁的青年出手彩票</p>
                        <p>建议使用Google Chorome浏览器，并将屏幕解析度设定为1920x1080，以获得最佳浏览效果</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'page_footer'
}
</script>

<style lang="stylus" scoped>
.page_footer
    background #232526
    overflow hidden
.container
    width 1200px
    margin auto
    margin-top 20px
    overflow hidden
.list_container
    display flex
    flex-direction column
    .top,.bottom
        display flex
.top
    .list
        color #fff
        font-size 12px
        height 82px
        margin-bottom 30px
        margin-right 10px
        &:nth-child(1)
            div
                height 82px
                width 152px
                background url('../assets/images/GAMING.png') no-repeat 0 0
        &:nth-child(2)
            ul
                display flex
                li
                    height 82px
                    float left
                    margin-right 10px
                    &:nth-child(1)
                        width 84px
                        background url('../assets/images/visa_hover.png') no-repeat 0 0
                    &:nth-child(2)
                        width 84px
                        background url('../assets/images/mastercard_hover.png') no-repeat 0 0
                    &:nth-child(3)
                        width 125px
                        background url('../assets/images/unionPay_hover.png') no-repeat 0 0
.bottom
    .list
        color #fff
        font-size 12px
        height 82px
        margin-bottom 30px
        margin-right: 30px;
        &:nth-child(1)
            ul
                li
                    height 82px
                    float left
                    margin-right 10px
                    &:nth-child(1)
                        width 84px
                        margin-top 10px
                        background url('../assets/images/iapp.png') no-repeat 0 0
                    &:nth-child(2)
                        width 150px
                        background url('../assets/images/page_logo.png') no-repeat 0 0
                    &:nth-child(3)
                        width 164px
                        background url('../assets/images/jockeyclub_hover.png') no-repeat 0 0
        &:nth-child(2)
            ul
                li
                    height 82px
                    float left
                    margin-right 10px
                    &:nth-child(1)
                        width 84px
                        background url('../assets/images/GAMCARE_hover.png') no-repeat 0 0
                    &:nth-child(2)
                        width 84px
                        background url('../assets/images/18_hover.png') no-repeat 0 0
                    &:nth-child(3)
                        width 84px
                        background url('../assets/images/stop_hover.png') no-repeat 0 0
        &:nth-child(3)
            margin-right 29px
            div
                width 160px
                height 82px
                background url('../assets/images/iovation_hover.png') no-repeat 0 0
div.bottom>div,div.top>div,ul>li
    background-size auto 50px
    filter grayscale(1) opacity(0.5)
    transition all 0.2s linear
    &:hover
        filter grayscale(0) opacity(1)
.footer_border
    clear both
    border-bottom 1px dashed #545556
    width 100%
    margin-bottom 40px
.about
    padding-bottom 20px
    overflow hidden
    li
        cursor pointer
        float left
        margin-right 140px
        overflow hidden
        h5
            font-size 14px
            color #fff
            margin-bottom 10px
        p
            font-size 13px
            color #717171
            line-height 30px
            transition color 0.2s linear
            &:hover
                color #fff
    li.proxy
        margin-right 0
        .contact
            width 300px
            margin-bottom 20px
.wechat, .webo, .youku
    .icon
        width 27px
        height 27px
        filter grayscale(1) opacity(0.5)
        transition all 0.2s linear
    &:hover
        p
            color #fff
        .icon
            filter grayscale(0) opacity(1)
.wechat
    .icon
        background url('../assets/images/wechat_hover.png') no-repeat 0 0
.webo
    .icon
        background url('../assets/images/weibo_hover.png') no-repeat 0 0
.youku
    margin-top 20px
    .icon
        background url('../assets/images/weibo_hover.png') no-repeat 0 0
button
    padding 10px 18px
    background-color #545556
    border-radius 5px
    border 2px solid #545556
    width 100%
    color #b9b9b9
    margin-bottom 20px
    transition all 0.2s linear
    &:hover
        color #fff
        background-color #98171a
        border 2px solid #98171a
.button_icon
    width 34px
    height 34px
    background-image url('../assets/images/icon-shake.png')
    display inline-block
    margin-right 10px
    vertical-align middle
    animation 0.8s ease-in-out infinite alternate move
@keyframes move
    0%
        -moz-transform translateY(-2px)
        -ms-transform translateY(-2px)
        -webkit-transform translateY(-2px)
        transform translateY(-2px)
    50%
        -moz-transform translateY(2px)
        -ms-transform translateY(2px)
        -webkit-transform translateY(2px)
        transform translateY(2px)
    100%, 70%
        -moz-transform translateY(0)
        -ms-transform translateY(0)
        -webkit-transform translateY(0)
        transform translateY(0)
    0%
        left -200px
    100%
        left 100%
.contact
    padding 10px 0
    border-radius 5px
    border 2px solid #545556
    padding-left 74px
    overflow hidden
    i, p
        float left
    i
        width 34px
        height 34px
        background url('../assets/images/icon-call.png') no-repeat 0 0
        margin-top 5px
        margin-right 10px
    p
        span
            display block
            line-height 20px
.visitor
    font-size 12px
    margin-top 20px
    span
        margin-right 20px
    strong
        background #ddd
        border-radius 3px
        padding 4px 6px
        margin-right 10px
        color #000
        text-decoration overline
.fc
    font-size 13px
    text-align center
    color #717171
    padding-bottom 20px
    h6:first-child
        margin-bottom 20px
</style>
