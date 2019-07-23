<template>
    <div class="lotteryGroup">
        <ul class="nav">
            <li
                v-for="(item,value) of infoList"
                :key="value"
                :class="value==methodCrowdActive?'active':''"
                @click="getMethodId(item,value)"
            >{{item.title}}</li>
        </ul>
        <ul class="navTwo">
            <li v-for="(item,value) of getmethod" :key="value">
                <i>{{item.gtitle}}</i>
                <span
                    v-for="(list,index) of item.label"
                    :key="index+'a'"
                    :class="index==itemActive.index&&value==itemActive.value?'active':''"
                    @click="getItem(item.gtitle,list,value,index)"
                >{{list.name}}</span>
            </li>
            <li class="bonusGroup">
                <div>
                    <span>单注奖金:</span>
                    <InputNumber
                        size="large"
                        :parser="value => value"
                        :step="2"
                        :max="prizeGroup"
                        :active-change="false"
                        v-model="nowPrizeGroup"
                        @on-blur="handleGroupMinValue"
                        style="margin-bottom:10px"
                    ></InputNumber>
                </div>
                <div>
                    <span>单注返点:</span>
                    <span>{{rebate}}</span>
                </div>
                <div class="numberTitle">
                    <div>
                        <p>
                            <Tooltip transfer max-width="300" :content="methodList.methoddesc">
                                <i></i>
                                <span>说明</span>
                            </Tooltip>
                        </p>
                        <p>
                            <Tooltip transfer max-width="300" :content="methodList.methodexample">
                                <i></i>
                                <span>示例</span>
                            </Tooltip>
                        </p>
                    </div>
                </div>
            </li>
        </ul>
        <Lotterynumber :order="this.$refs.order" ref="lotterynumber" :method-list="methodList" />
        <Order
            :methodid="methodid"
            :i-wallet-type="iWalletType"
            :method-list="methodList"
            :rebate="rebate"
            :modes="methodList.modes"
            :now-prize-group="nowPrizeGroup"
            :lotterynumber="this.$refs.lotterynumber"
            :prize="this.prize"
            ref="order"
        />
    </div>
</template>

<script>
import { InputNumber, Tooltip } from 'iview'
import Lotterynumber from './lotteryNumber'
import Order from '@/components/lottery/order.vue'
import { MethodCrowd, getmethod, getLotteryInfo } from '@/api/index.js'
export default {
    name: 'lotteryGroup',
    data() {
        return {
            infoList: '',
            getmethod: [], //二级组
            methodCrowdActive: 0,
            methodList: {}, //最终玩法
            itemActive: {
                value: 0,
                index: 0
            },
            activeNow: {
                navOne: 0,
                navTwo: {
                    col: 0,
                    index: 0
                }
            },
            prizeGroup: 0, //返点
            nowPrizeGroup: 1984, //当前选择返点
            iWalletType: '1', //1-现金 2-信用
            methodid: '', //具体玩法id
            bonus: 'bonus1',
            prize: 0 //彩票奖金
        }
    },
    computed: {
        rebate() {
            return (
                parseFloat(
                    ((this.prizeGroup - this.nowPrizeGroup) / 20).toFixed(1)
                ) + '%'
            )
        }
    },
    mounted() {
        getLotteryInfo({ memnuid: this.$route.query.menuId }).then(res => {
            this.infoList = res.data
            this.getmethod = res.data[0].label
            this.methodList = {
                ...res.data[0].label[0].label[0],
                title: res.data[0].label[0].gtitle
            }
            this.prize = res.data[0].label[0].label[0].prize_level_special
            this.nowPrizeGroup = Number(
                res.data[0].label[0].label[0].nowPrizeGroup.toFixed()
            )
            this.prizeGroup = res.data[0].label[0].label[0].nowPrizeGroup
            this.methodid = res.data[0].label[0].label[0].methodid
        })
    },
    methods: {
        //处理奖金组 最小值
        handleGroupMinValue() {
            if (this.nowPrizeGroup < 1300) {
                this.nowPrizeGroup = 1300
            }
        },
        getMethodId(item, value) {
            this.$store.dispatch('handleTrace', false) //关闭追号
            this.methodCrowdActive = value
            this.getmethod = item.label
            this.methodList = {
                ...item.label[0].label[0],
                title: item.label[0].gtitle
            }
            this.methodid = item.label[0].label[0].methodid
            this.prize = item.label[0].label[0].prize_level_special
            this.itemActive = { value: 0, index: 0 }
            this.$nextTick(() => {
                this.$refs.lotterynumber.reset()
            })
        },
        //获取最终玩法
        getItem(title, item, value, index) {
            this.$store.dispatch('handleTrace', false) //关闭追号
            this.$store.dispatch('handleLotteryNumber', '')
            //重置选号区域
            this.$nextTick(() => {
                this.$refs.lotterynumber.reset()
            })
            //item最终选项，value-行 index-列
            this.methodid = item.methodid
            this.itemActive = { value, index }
            this.methodList = { ...item, title }
            this.prize = item.prize_level_special
            this.nowPrizeGroup = Number(item.nowPrizeGroup.toFixed())
            this.prizeGroup = item.nowPrizeGroup
        }
    },
    components: {
        Lotterynumber,
        Order,
        InputNumber,
        Tooltip
    }
}
</script>
<style lang="stylus" scoped>
.lotteryGroup
    color #fff
    cursor pointer
    margin-top 10px
    .nav
        overflow hidden
        background #000
        display flex
        li
            height 44px
            text-align center
            border-right 1px solid #363636
            line-height 44px
            flex 1
            font-size 12px
            &.special_play
                i
                    display inline-block
                    background url('../../assets/images/icon_play.png') no-repeat
                    margin-bottom -8px
                    width 18px
                    height 18px
            &.active
                background #ea314e
                border-top 1px solid #ea314e
    .navTwo
        padding-top 20px
        min-height 140px
        font-size 12px
        position relative
        padding-right 190px
        background #202020
        overflow hidden
        li
            margin-bottom 10px
            margin-left 10px
            span, i
                text-align center
                padding 5px 4px
                display inline-block
            i
                color #ffa700
            span.active
                color #ffa700
                border 1px solid #ffa700
                border-radius 3px
            &.bonusGroup
                position absolute
                right 20px
                top 16px
                .numberTitle
                    padding-left 6px
                    overflow hidden
                    p
                        float left
                        .ivu-tooltip
                            color #ccc
                            margin-right 16px
                            display inline-block
                            line-height 28px
                            font-size 14px
                        i
                            background url('../../assets/images/icon_sm_group.png') no-repeat
                            display inline-block
                            width 17px
                            height 17px
                            margin-bottom -4px
                            margin-right 5px
                        button
                            background #a96b94
                            border none
                            padding 4px 10px
                            color #fff
                            border-radius 3px
</style>
