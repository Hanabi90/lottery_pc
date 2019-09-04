<template>
    <div class="teamProfitLossStatement">
        <div class="navTitle">团队报表</div>
        <div class="seach">
            <span>请选择日期</span>
            <DatePicker
                v-model="starttime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                placeholder="请选择日期"
                style="width: 300px;margin:0 10px"
            ></DatePicker>
            <RadioGroup v-model="quickDate" @on-change="changeDate">
                <Radio label="durationToday">今天</Radio>
                <Radio label="durationYesterday">昨天</Radio>
                <Radio label="durationThisWeek">7天</Radio>
                <Radio label="durationThisMonth">30天</Radio>
            </RadioGroup>
            <Button style="width:160px" @click="handleOrderHistory" type="primary">查询</Button>
        </div>
        <div class="content">
            <div class="title">
                <h5>用户名</h5>
                <h5>用户组别</h5>
                <h5>用户等级</h5>
                <h5>充值总额</h5>
                <h5>提现总额</h5>
                <h5>投注总额</h5>
                <h5>活动礼金</h5>
                <h5>净盈亏</h5>
            </div>
            <ul class="list">
                <li v-for="(item,value) of detailedList" :key="value">
                    <span>{{item.user_name}}</span>
                    <span>{{item.belong_group}}</span>
                    <span>一星</span>
                    <span>{{item.deposit}}</span>
                    <span>{{item.withdraw}}</span>
                    <span>{{item.bonus_amount}}</span>
                    <span>{{item.gift_money_1}}</span>
                    <span>{{item.profit}}</span>
                </li>
            </ul>
        </div>
        <div class="pageBox">
            <Page
                ref="page"
                show-total
                :show-sizer="true"
                show-elevator
                size="small"
                transfer
                :page-size="pn"
                @on-change="handleReachBottom"
                @on-page-size-change="changePn"
                :total="Number(totalCount)"
                class="page"
            />
            <Button @click="handleGo" class="btn">Go</Button>
        </div>
    </div>
</template>

<script>
import {
    DatePicker,
    Select,
    Option,
    Button,
    RadioGroup,
    Radio,
    Page
} from 'iview'
import { reallist } from '@/api/index'
export default {
    name: 'teamProfitLossStatement',
    data() {
        return {
            userpointtype: '2',
            starttime: '',
            quickDate: 'durationToday',
            detailedList: [],
            totalCount: 0, //总页数
            p: 1, //当前页
            pn: 10 //一页数量
        }
    },
    mounted() {
        this.changeDate(this.quickDate)
    },
    methods: {
        changeDate(value) {
            let startTime = new Date(new Date().setHours(0, 0, 0, 0)),
                nowTime = new Date(),
                lastTime = new Date(
                    new Date(new Date().setHours(0, 0, 0, 0)).setDate(
                        new Date(new Date().setHours(0, 0, 0, 0)).getDate() - 1
                    )
                ),
                lastWeek = new Date(
                    new Date(new Date().setHours(0, 0, 0, 0)).setDate(
                        new Date(new Date().setHours(0, 0, 0, 0)).getDate() - 6
                    )
                ),
                lastMonth = new Date(
                    new Date(new Date().setHours(0, 0, 0, 0)).setDate(
                        new Date(new Date().setHours(0, 0, 0, 0)).getDate() - 29
                    )
                )
            switch (value) {
                case 'durationToday':
                    this.starttime = [startTime, nowTime]
                    break
                case 'durationYesterday':
                    this.starttime = [lastTime, startTime]
                    break
                case 'durationThisWeek':
                    this.starttime = [lastWeek, nowTime]
                    break
                case 'durationThisMonth':
                    this.starttime = [lastMonth, nowTime]
                    break

                default:
                    break
            }
            this.handleOrderHistory()
        },
        changePn(value) {
            this.pn = value
            this.p = 1
            this.handleOrderHistory()
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
        },
        handleOrderHistory() {
            let time = [...this.starttime],
                starttime,
                endtime

            starttime = this.dataformat(time[0])
            endtime = this.dataformat(time[1])

            reallist({
                searchDuration: this.quickDate,
                starttime: starttime,
                endtime: endtime,
                userpointtype: '',
                excludeNoBet: 1,
                p: this.p,
                pn: this.pn
            }).then(res => {
                this.detailedList = res.data.page_data.sub_agents
                this.totalCount = res.data.total_count
            })
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
        handleReachBottom(value) {
            this.p = value
            this.handleOrderHistory()
        }
    },
    components: {
        DatePicker,
        Button,
        RadioGroup,
        Radio,
        Page
    }
}
</script>

<style lang="stylus" scoped>
.teamProfitLossStatement
    .navTitle
        background #ea2f4c
        width 150px
        line-height 50px
        color #ffffff
        font-size 16px
        border-bottom-right-radius 20px
        text-align center
        margin-bottom 20px
    .seach
        margin-bottom 10px
        >>>.ivu-radio-wrapper
            color #fff
    span
        color #fff
    .content
        border-radius 3px
        overflow hidden
        position relative
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
                    line-height 50px
                    color #fff
                &>div
                    flex 1
                    text-align center
                    font-size 14px
                    line-height 50px
                    color #fff
                    &:nth-child(2)
                        flex 0.8
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
