<template>
    <div>
        <div class="navTitle">投注记录</div>
        <Form
            :model="bettingRecord"
            :label-width="80"
            inline
            @keydown.native.enter.prevent="()=>{}"
        >
            <FormItem label="游戏类型">
                <Select
                    placeholder="请先选择游戏类型"
                    v-model="bettingRecord.main_type"
                    style="width:140px"
                    @on-change="getSubType"
                >
                    <Option
                        v-for="(item,index) of typeList"
                        :key="index"
                        :value="item.main_type"
                    >{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="游戏大厅">
                <Select placeholder="请先选择游戏类型" v-model="bettingRecord.sub_type" style="width:140px">
                    <Option
                        v-for="(item,index) of subList"
                        :key="index"
                        :value="item.sub_type"
                    >{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="请选择日期">
                <DatePicker
                    v-model="bettingRecord.sDate"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placeholder="请选择日期"
                    style="width: 190px"
                    placement="bottom-end"
                    :options="maxDay"
                ></DatePicker>
            </FormItem>
            <Button class="button" @click="handleSeach" type="primary">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>游戏帐号</h5>
                <h5>投注时间</h5>
                <h5>投注游戏</h5>
                <h5>投注内容</h5>
                <h5>投注金额</h5>
                <h5>有效投注金额</h5>
                <h5>输赢</h5>
                <h5>盈亏</h5>
            </div>
            <ul class="list">
                <li v-for="(item,value) of userHistory" :key="value">
                    <span>{{item.game_account}}</span>
                    <span>{{item.bet_time}}</span>
                    <span>{{item.bet_game}}</span>
                    <span>{{item.bet_content}}</span>
                    <span>{{item.bet_money}}</span>
                    <span>{{item.bet_v_money}}</span>
                    <span :style="{'color':item.winorlose=='中奖'?'#0eff00':'red'}">{{item.winorlose}}</span>
                    <span
                        :style="{'color':item.winorlose=='中奖'?'#0eff00':'red'}"
                    >{{item.ts_flowing}}</span>
                </li>
            </ul>
            <div class="totalList">
                <span>总计</span>
                <span></span>
                <span></span>
                <span></span>
                <span>{{stake_sum}}</span>
                <span>{{valid_sum}}</span>
                <span></span>
                <span></span>
            </div>
        </div>

        <div class="pageBox">
            <Page
                ref="page"
                show-total
                :show-sizer="true"
                show-elevator
                size="small"
                transfer
                :page-size="this.bettingRecord.page_size"
                @on-change="handleReachBottom"
                @on-page-size-change="changePn"
                :total="Number(total)"
                class="page"
            />
            <Button @click="handleGo" class="btn">Go</Button>
        </div>
    </div>
</template>

<script>
import {
    Form,
    FormItem,
    Select,
    Option,
    Button,
    Page,
    Tooltip,
    DatePicker
} from 'iview'
import {
    getuserlottery,
    getuserlotterymethod,
    getchildlist,
    getbethistory,
    ordercancel,
    getgamereport,
    getgametypeandlobby
} from '@/api/index'
export default {
    name: 'bettingRecord',
    data() {
        return {
            bettingRecord: {
                main_type: ' ', //游戏类型
                sub_type: ' ', //游戏大厅
                sDate: '', //开始时间
                eDate: '', //结束时间
                page_size: 10, //请求的数据记录数量
                page: 1 //请求的页面序号
            },
            typeList: [],
            subList: [],
            userHistory: [],
            total: 0, //页数
            stake_sum: 0, //投注额总计
            valid_sum: 0, //有效投注额总计
            maxDay: {
                disabledDate: date => {
                    return (
                        date.valueOf() < Date.now() - 86400000 * 35 ||
                        date.valueOf() > Date.now()
                    )
                }
            }
        }
    },
    methods: {
        getSubType() {
            getgametypeandlobby({
                typecode: this.bettingRecord.main_type
            }).then(res => {
                this.subList = res.data
            })
        },
        handleSeach() {
            this.handleReachBottom(1)
            this.$refs.page.currentPage = 1
        },
        //跳转按钮
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
        //切换显示条数
        //切换显示条数
        changePn(value) {
            this.$set(this.bettingRecord, 'page_size', value)
            this.$set(this.bettingRecord, 'page', 1)
            this.getBetHistory()
        },

        getBetHistory() {
            let bettingRecord = { ...this.bettingRecord }
            if (bettingRecord.sDate[0]) {
                bettingRecord.sDate = this.dataformat(
                    this.bettingRecord.sDate[0]
                )
                bettingRecord.eDate = this.dataformat(
                    this.bettingRecord.sDate[1]
                )
            } else {
                bettingRecord.sDate = ''
                bettingRecord.eDate = ''
            }
            getgamereport({ ...bettingRecord }).then(res => {
                this.userHistory = [...res.data.data]
                this.total = res.data.total
                this.stake_sum = res.data.stake_sum
                this.valid_sum = res.data.valid_sum
                if (!res.data.data.length) {
                    this.$Message.success('暂无数据')
                }
            })
        },
        handleReachBottom(value) {
            this.$set(this.bettingRecord, 'page', value)
            this.getBetHistory()
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
        getgamereport().then(res => {
            this.userHistory = [...res.data.data]
            this.total = res.data.total
            this.stake_sum = res.data.stake_sum
            this.valid_sum = res.data.valid_sum
        })
        //获取游戏类型与关联大厅
        getgametypeandlobby().then(res => {
            this.typeList = res.data
        })
    },
    components: {
        Form,
        FormItem,
        Select,
        Option,
        Button,
        Page,
        DatePicker
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
    position relative
    padding-bottom 46px
    .title
        background #000
        display flex
        padding-right 20px
        h5
            flex 1
            line-height 45px
            text-align center
            color #fff
    .list
        height 590px
        overflow-y scroll
        li
            display flex
            margin-bottom 10px
            span
                flex 1
                text-align center
                font-size 14px
                line-height 26px
                color #fff
            &>div
                flex 1
                text-align center
                font-size 14px
                color #fff
            .code
                overflow-x auto
    .totalList
        position absolute
        bottom 0
        width 100%
        color #fff
        background #ea2f4c
        display flex
        span
            flex 1
            text-align center
            line-height 46px
            font-size 14px
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
