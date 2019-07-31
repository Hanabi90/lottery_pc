<template>
    <div class="bullentin">
        <h5>平台公告</h5>
        <div class="boxContent">
            <ul :class="{box:list.length>9}" class="boxs">
                <li
                    class="list"
                    v-for="(item,index) of list"
                    :key="index"
                    @click="handleAlert(index)"
                >
                    <div class="time">【公告】</div>
                    <p class="content">{{item.subject}}</p>
                </li>
            </ul>
            <ul :class="{box:list.length>9}" class="boxs">
                <li
                    class="list"
                    v-for="(item,index) of list"
                    :key="index"
                    @click="handleAlert(index)"
                >
                    <div class="time">【公告】</div>
                    <p class="content">{{item.subject}}</p>
                </li>
            </ul>
        </div>
        <notice ref="notice"></notice>
    </div>
</template>

<script>
import { getnotice } from '@/api/index'
import notice from '../userCenter/notice'
export default {
    name: 'bullentin',
    data() {
        return {
            list: []
        }
    },
    methods: {
        handleAlert(index) {
            this.$refs.notice.handleAlert(index)
        }
    },
    mounted() {
        getnotice().then(res => {
            this.list = res.data.results
        })
    },
    components: {
        notice
    }
}
</script>

<style lang="stylus" scoped>
.bullentin
    background #202020
    padding-bottom 20px
    margin-top 10px
    height 390px
    overflow hidden
    h5
        background #000
        color #fff
        text-indent 20px
        line-height 44px
        margin-bottom 10px
        font-size 14px
    .boxContent
        height 340px
        overflow hidden
        .box
            animation listAnim 50s linear infinite
        .boxs
            .list
                overflow hidden
                margin 0 20px
                color #bbbbbb
                border-bottom 1px dashed #333
                font-size 14px
                line-height 30px
                padding-top 4px
                .time, .content
                    float left
                .time
                    margin-right 9px
                .content
                    width 170px
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
@keyframes listAnim
    0%
        transform translateY(0%)
    100%
        transform translateY(-100%)
</style>
