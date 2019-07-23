<template>
    <div class="prizeList">
        <h5>近期开奖</h5>
        <ul>
            <li v-for="(item,value) of this.$store.state.openList" :key="value" class="list">
                <div class="time">{{item.issue}}</div>
                <div class="prizeNumber">
                    <span v-for="(element,index) of item.code.split(' ')" :key="index">{{element}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'prizeList',
    mounted() {}
}
</script>

<style lang="stylus" scoped>
.prizeList
    background #202020
    padding-bottom 20px
    height 305px
    h5
        background #000
        color #fff
        text-indent 20px
        line-height 44px
        font-size 14px
    ul
        padding-top 10px
        height 261px
        overflow-y auto
        .list
            overflow hidden
            padding 0 10px
            color #dcdcdc
            border-bottom 1px dashed #555
            font-size 14px
            line-height 30px
            padding-top 2px
            &:first-child
                .time
                    color #fff
                span
                    color #fff
            .time
                float left
                color #bbbbbb
            .prizeNumber
                float right
                max-width 140px
                word-wrap break-word
                overflow hidden
                color #bbb
                span
                    margin-right 3px
            &:first-child
                background #ea314e
                font-size 14px
                font-weight bold
                color #fff
</style>
