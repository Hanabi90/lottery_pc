<template>
    <div>
        <div class="navTitle">彩票契约分红</div>
        <Form :model="orderHistoryList" :label-width="100" inline>
            <FormItem>
                <span slot="label">
                    <Icon type="ios-search" />
                    <span style="margin-right:5px">查询:</span> 日期:
                </span>
                <DatePicker
                    v-model="orderHistoryList.starttime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placeholder="请选择日期"
                    style="width: 280px"
                ></DatePicker>
            </FormItem>
            <Button class="button" @click="handleOrderHistory">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>用户名</h5>
                <h5>日期</h5>
                <h5>国外彩总额</h5>
                <h5>官方彩总额</h5>
                <h5>总销售额</h5>
                <h5>国外彩投注占比</h5>
                <h5>获得工资百分比</h5>
                <h5>工资</h5>
            </div>
            <ul class="list">
                <li v-for="(item,value) of sharelist" :key="value">
                    <span>{{item.username}}</span>
                    <span>{{item.recorddate}}</span>
                    <span>{{item.self_bet}}</span>
                    <span>{{item.official_bet}}</span>
                    <span>{{item.total_bet}}</span>
                    <span>{{item.proportion}}</span>
                    <span>{{item.bonus}}</span>
                    <span>{{item.gift_amount}}</span>
                </li>
                <li v-if="pages<=orderHistoryList.p"></li>
            </ul>
            <div class="total">
                <span>合计官方彩总额：{{`${Number(official_bet).toFixed(2)}`}}</span>
                <span>合计国外彩总额：{{`${Number(self_bet).toFixed(2)}`}}</span>
                <span>合计总销售额：{{`${Number(total_bet).toFixed(2)}`}}</span>
            </div>
            <div class="pageBox">
                <Page
                    ref="page"
                    show-total
                    :show-sizer="true"
                    show-elevator
                    size="small"
                    transfer
                    :page-size="this.orderHistoryList.pn"
                    @on-change="handleReachBottom"
                    @on-page-size-change="changePn"
                    :total="Number(total)"
                    class="page"
                />
                <Button @click="handleGo" class="btn">Go</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { Form, FormItem, DatePicker, Button, Page, Icon } from 'iview'
import { getdailycontractrecord } from '@/api/index'
export default {
    name: 'noGameHistory',
    data() {
        return {
            orderHistoryList: {
                starttime: '', //起始时间
                pn: 10, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            ordertypeid: [],
            sharelist: [],
            pages: 1, //页数
            scroll: true, //把滚动条置顶
            official_bet: 0,
            self_bet: 0,
            total_bet: 0,
            total: 0 //页数
        }
    },

    methods: {
        handleGo() {
            let pageInput = this.$refs.page.$el
                    .getElementsByClassName('ivu-page-options-elevator')[0]
                    .getElementsByTagName('input')[0],
                evtObj
            if (window.KeyEvent) {
                //firefox 浏览器下模拟事件
                evtObj = document.createEvent('KeyEvents')
                evtObj.initKeyEvent(
                    'keyup',
                    true,
                    true,
                    window,
                    true,
                    false,
                    false,
                    false,
                    13,
                    0
                )
            } else {
                //chrome 浏览器下模拟事件
                evtObj = document.createEvent('UIEvents')
                evtObj.initUIEvent('keyup', true, true, window, 1)
                delete evtObj.keyCode
                if (typeof evtObj.keyCode === 'undefined') {
                    //为了模拟keycode
                    Object.defineProperty(evtObj, 'keyCode', { value: 13 })
                } else {
                    evtObj.key = String.fromCharCode(13)
                }
            }
            pageInput.dispatchEvent(evtObj)

            // this.$refs.page.changePage()
        },
        changePn(value) {
            this.$set(this.orderHistoryList, 'pn', value)
            this.handleOrderHistory()
        },
        handleOrderHistory() {
            this.scroll = false
            this.$nextTick(() => {
                this.scroll = true
            })
            let orderHistoryList = { ...this.orderHistoryList }
            orderHistoryList.starttime = this.dataformat(
                this.orderHistoryList.starttime[0]
            )
            orderHistoryList.endtime = this.dataformat(
                this.orderHistoryList.starttime[1]
            )
            orderHistoryList.p = 1
            this.$set(this.orderHistoryList, 'p', 1)
            getdailycontractrecord({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.sharelist = res.data.page_data
                    this.total = res.data.record_count //总条数
                    this.official_bet = isNaN(
                        Number(res.data.total_count['official_bet'])
                    )
                        ? 0
                        : res.data.total_count['official_bet']
                    this.self_bet = isNaN(
                        Number(res.data.total_count['self_bet'])
                    )
                        ? 0
                        : res.data.total_count['self_bet']
                    this.total_bet = isNaN(
                        Number(res.data.total_count['total_bet'])
                    )
                        ? 0
                        : res.data.total_count['total_bet']
                } else {
                    this.sharelist = []
                    this.total = 0 //总条数
                    this.lost_amount = 0
                    this.gift_amount = 0
                }
            })
        },
        handleReachBottom(value) {
            let orderHistoryList = { ...this.orderHistoryList }
            orderHistoryList.starttime = this.dataformat(
                this.orderHistoryList.starttime[0]
            )
            orderHistoryList.endtime = this.dataformat(
                this.orderHistoryList.starttime[1]
            )
            orderHistoryList.p = value
            getdailycontractrecord({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.sharelist = res.data.page_data
                    this.total = res.data.record_count //总条数
                    this.lost_amount = res.data.total_count['lost_amount']
                    this.gift_amount = res.data.total_count['gift_amount']
                } else {
                    this.sharelist = []
                    this.total = 0 //总条数
                    this.lost_amount = 0
                    this.gift_amount = 0
                }
            })
        },
        dataformat(str) {
            let time = new Date(str)
            time =
                time.getFullYear() +
                '-' +
                (time.getMonth() + 1 > 9
                    ? time.getMonth() + 1
                    : '0' + (time.getMonth() + 1)) +
                '-' +
                (time.getDate() > 9 ? time.getDate() : '0' + time.getDate()) +
                ' ' +
                (time.getHours() > 9
                    ? time.getHours()
                    : '0' + time.getHours()) +
                ':' +
                (time.getMinutes() > 9
                    ? time.getMinutes()
                    : '0' + time.getMinutes()) +
                ':' +
                (time.getSeconds() > 9
                    ? time.getSeconds()
                    : '0' + time.getSeconds())
            return time
        }
    },
    mounted() {
        this.handleOrderHistory()
    },
    components: {
        Form,
        FormItem,

        DatePicker,
        Button,

        Page,
        Icon
    }
}
</script>

<style lang="stylus" scoped>
.navTitle
    background #ea2f4c
    width 150px
    line-height 50px
    color #ffffff
    font-size 16px
    border-bottom-right-radius 20px
    text-align center
    margin-bottom 20px
>>>.ivu-form .ivu-form-item-label
    color #fff
.content
    border-radius 3px
    overflow hidden
    .title
        background #000
        display flex
        padding-right 20px
        h5
            flex 1
            line-height 45px
            text-align center
            color #fff
            font-size 14px
            &:nth-child(1), &:nth-child(3)
                flex 1.6
    .list
        height 590px
        overflow-y scroll
        li
            display flex
            margin-bottom 10px
            align-items center
            span, >div
                flex 1
                text-align center
                font-size 14px
                color #fff
                &:nth-child(1), &:nth-child(3)
                    flex 1.6
            .add
                color #f00
            .less
                color #00ceff
            .code
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
    .total
        background #ea2f4c
        line-height 46px
        font-size 14px
        color #fff
        display flex
        justify-content space-evenly
        span
            display inline-block
            flex 1
            text-align center
.button
    border-radius 17px
    background-image linear-gradient(0, rgb(245, 96, 81) 0%, rgb(251, 196, 52) 100%)
    background-color #fbc434
    width 107px
    line-height 35px
    height 35px
    padding 0
    margin 0
    color #fff
    border none
    font-size 14px
    text-indent 10px
    letter-spacing 10px
.pageBox
    overflow hidden
    text-align center
    .page
        font-size 14px
        color #fff
        text-align center
        padding 20px 0
        display inline-block
        vertical-align middle
        >>>.ivu-page-item
            border-radius 200px
            margin 0 4px
        >>>.ivu-page-item-active
            background #ea2f4c
            a
                color #fff
    .btn
        display inline-block
        width 33px
        line-height 20px
        font-size 14px
        text-align center
        border-radius 5px
        padding 0
        maring 0
        background-color rgb(234, 47, 76)
        border none
        color #fff
</style>
