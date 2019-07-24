<template>
    <div class="winnerlist">
        <div class="mask">
            <ul class="winnerlist_ul">
                <li v-for="(item, index) in winnerlistArr" :key="item.username + index">
                    <span>{{item.username|capitalize}}</span>
                    <span>{{item.cnname}}</span>
                    <span>{{item.bonus}}</span>
                </li>
            </ul>
            <ul class="winnerlist_ul">
                <li v-for="(item, index) in winnerlistArr" :key="item.username + index">
                    <span>{{item.username|capitalize}}</span>
                    <span>{{item.cnname}}</span>
                    <span>{{item.bonus}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { getwinner } from '../../api/index'

export default {
    data() {
        return {
            winnerlistArr: []
        }
    },
    created() {
        this.getwinnerList()
    },
    methods: {
        getwinnerList() {
            getwinner({ amount: 50 }).then(res => {
                this.winnerlistArr = res.data
            })
        }
    },
    filters: {
        capitalize(value) {
            return value.length > 3
                ? value.substr(0, 3) +
                      new Array(value.length - 2).join('*') +
                      value.substr(-1)
                : value
        }
    }
}
</script>

<style lang="stylus" scoped>
.winnerlist
    width 280px
    height 420px
    padding 20px
    text-align center
    background-image url('../../assets/images/new_paihang.png')
    .mask
        margin-top 45px
        overflow hidden
        height 90%
    .winnerlist_ul
        color #fff
        animation listAnim 50s linear infinite
        li
            span
                display inline-block
                width 33.33%
                overflow hidden
                &:nth-child(1)
                    text-align left
@keyframes listAnim
    0%
        transform translateY(0%)
    100%
        transform translateY(-100%)
</style>
