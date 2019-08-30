<template>
    <div>
        <div class="navTitle">投注记录</div>
        <Form :model="bettingRecord" :label-width="80" inline>
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
            <Button class="button" @click="handleSeach" type="primary">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>游戏帐号</h5>
                <h5>投注游戏</h5>
                <h5>投注内容</h5>
                <h5>赔率</h5>
                <h5>投注金额</h5>
                <h5>输赢</h5>
                <h5>流水</h5>
                <h5>投注时间</h5>
                <h5>游戏模组名称</h5>
                <h5>游戏类型名称</h5>
                <h5>游戏大厅名称</h5>
            </div>
            <ul class="list">
                <li v-for="(item,value) of userHistory" :key="value">
                    <Tooltip
                        max-width="350px"
                        :content="item.game_account"
                        placement="right-start"
                    >{{item.game_account.slice(0,4)}}{{item.game_account>4?"...":''}}</Tooltip>
                    <span>{{item.bet_game}}</span>
                    <span>{{item.bet_content}}</span>
                    <span>{{item.odds}}</span>
                    <span>{{item.bet_money}}</span>
                    <span :style="{'color':item.winorlose=='赢'?'#0eff00':'red'}">{{item.winorlose}}</span>
                    <span>{{item.ts_flowing}}</span>
                    <Tooltip
                        max-width="350px"
                        :content="item.bet_time"
                        placement="right-start"
                    >{{item.bet_time.slice(0,4)}}{{item.bet_time>4?"...":''}}</Tooltip>
                    <span>{{item.model_name}}</span>
                    <span>{{item.main_type}}</span>
                    <span>{{item.sub_type}}</span>
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
import { Form, FormItem, Select, Option, Button, Page, Tooltip } from 'iview'
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
                page_size: 10, //请求的数据记录数量
                page: 1 //请求的页面序号
            },
            typeList: [],
            subList: [],
            userHistory: [],
            total: 0 //页数
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
            getgamereport({ ...this.bettingRecord }).then(res => {
                this.userHistory = [...res.data.data]
                this.total = res.data.total
            })
        },
        handleReachBottom(value) {
            this.$set(this.bettingRecord, 'page', value)
            this.getBetHistory()
        }
    },
    mounted() {
        this.getBetHistory()
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
        Tooltip
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
