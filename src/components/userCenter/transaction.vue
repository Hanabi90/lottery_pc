<template>
    <div>
        <div class="navTitle">交易明细</div>
        <Form :model="bettingRecord" :label-width="80" inline>
            <FormItem label="交易类型">
                <Select placeholder="请选择交易类型" v-model="bettingRecord.querytype" style="width:140px">
                    <Option :value="0">所有类型</Option>
                    <Option value="DEPOIST">存款</Option>
                    <Option value="WITHDRAWAL">提款</Option>
                </Select>
            </FormItem>
            <Button class="button" @click="handleSeach" type="primary">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>时间</h5>
                <h5>交易类别</h5>
                <h5>交易内容</h5>
                <h5>金额</h5>
                <h5>状态</h5>
                <h5>交易单号</h5>
            </div>
            <ul class="list">
                <li v-for="(item,value) of userHistory" :key="value">
                    <span>{{item.time}}</span>
                    <span>{{item.transtype}}</span>
                    <span>{{item.transcontent}}</span>
                    <span>{{item.money}}</span>
                    <span :style="{'color':item.status=='成功'?'#0eff00':'red'}">{{item.status}}</span>
                    <span>{{item.trans_no}}</span>
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
                :total="total"
                class="page"
            />
            <Button @click="handleGo" class="btn">Go</Button>
        </div>
    </div>
</template>

<script>
import { Form, FormItem, Select, Option, Button, Page } from 'iview'
import { gettransreport } from '@/api/index'
export default {
    name: 'transaction',
    data() {
        return {
            bettingRecord: {
                querytype: 0, //游戏玩法
                page: 1, //请求的页面序号
                page_size: 10 //请求的数据记录数量
            },
            total: 1,
            userHistory: []
        }
    },
    methods: {
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
        },
        //切换显示条数
        changePn(value) {
            this.$set(this.bettingRecord, 'page_size', value)
            this.$set(this.bettingRecord, 'page', 1)
            this.getBetHistory()
        },

        getBetHistory() {
            gettransreport({
                ...this.bettingRecord
            }).then(res => {
                this.userHistory = [...res.data.data]
                this.total = res.data.total
                if (!res.data.data.length) {
                    this.$Message.success('暂无数据')
                }
            })
        },
        handleReachBottom(value) {
            this.$set(this.bettingRecord, 'page', value)
            this.getBetHistory()
        }
    },
    mounted() {
        this.getBetHistory()
    },
    components: {
        Form,
        FormItem,
        Select,
        Option,
        Button,
        Page
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
            &:nth-child(1)
                flex 1.2
            &:nth-child(3)
                flex 1.4
            &:last-child
                flex 1.7
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
                &:nth-child(1)
                    flex 1.2
                &:nth-child(3)
                    flex 1.4
                &:last-child
                    flex 1.7
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
