<template>
    <div>
        <div class="navTitle">游戏账变记录</div>
        <Form :model="orderHistoryList" :label-width="72" inline>
            <FormItem label="帐变类型">
                <Select v-model="orderHistoryList.ordertypeid" style="width:100px">
                    <Option value="-1">所有类型</Option>
                    <Option
                        v-for="item of ordertypeid"
                        :key="item.id"
                        :value="item.id"
                    >{{item.cntitle}}</Option>
                </Select>
            </FormItem>
            <FormItem label="请选择日期">
                <DatePicker
                    v-model="orderHistoryList.starttime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placeholder="请选择日期"
                    style="width: 280px"
                ></DatePicker>
            </FormItem>
            <FormItem label="下级用户名">
                <Select
                    placeholder="查询下级信息"
                    v-model="orderHistoryList.username"
                    style="width:120px"
                >
                    <Option
                        v-for="(item,value) of userList"
                        :key="value"
                        :value="item.username"
                    >{{item.username}}</Option>
                </Select>
            </FormItem>
            <FormItem label="下级">
                <Checkbox true-value="1" false-value="0" v-model="orderHistoryList.includechild"></Checkbox>
            </FormItem>
            <Button class="button" @click="handleOrderHistory">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>帐变编号</h5>
                <h5>用户名</h5>
                <h5>时间</h5>
                <h5>类型</h5>
                <h5>收入</h5>
                <h5>支出</h5>
                <h5>余额</h5>
                <h5>状态</h5>
                <h5>备注</h5>
            </div>
                <ul class="list">
                    <li v-for="(item,value) of noGameList" :key="value">
                        <span>{{item.orderno}}</span>
                        <span>{{item.username}}</span>
                        <span>{{item.times}}</span>
                        <span :class="{add:item.cntitle.indexOf('-')!='-1',less:item.cntitle.indexOf('-')=='-1'}">{{item.cntitle}}</span>
                        <span class="code">{{item.operations>0?item.amount:0}}</span>
                        <span>{{item.operations==0?item.amount:0}}</span>
                        <span>{{item.money}}</span>
                        <span>{{(item.transferstatus==1||item.transferstatus==3)?'失败':'成功'}}</span>
                        <span>{{item.description?item.description:'---'}}</span>
                    </li>
                    <li v-if="pages<=orderHistoryList.p">
                    </li>
                </ul>
            <div class="total">
                <span>总收入：{{`${Number(total_income).toFixed(2)}`}}</span>
                <span>总支出：{{`${Number(total_pay).toFixed(2)}`}}</span>
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
import {
    Form,
    FormItem,
    Select,
    Option,
    DatePicker,
    Button,
    Checkbox,
    Page,
} from 'iview'
import {
    getchildlist,
    getbankreporthistory,
    getallbankreporttype
} from '@/api/index'
export default {
    name: 'noGameHistory',
    data() {
        return {
            orderHistoryList: {
                includechild: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                ordertypeid: '-1', //帐变类型id
                starttime: '', //起始时间
                pn: 18, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            userList: [],
            ordertypeid: [],
            noGameList: [],
            pages: 1, //页数
            scroll: true, //把滚动条置顶
            total_income: 0, //收入
            total_pay: 0,
            total:0//页数
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
            getbankreporthistory({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.noGameList = [...res.data.page_data] //当前数据
                    this.total = res.data.total_count //总条数
                    this.total_income = res.data.total_income //收入
                    this.total_pay = res.data.total_pay //支出
                } else {
                    this.noGameList = []
                    this.total = 0 //总条数
                    this.total_income = 0 //收入
                    this.total_pay = 0 //支出
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
            getbankreporthistory({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.noGameList = [...res.data.page_data] //当前数据
                    this.total = res.data.total_count //总条数
                    this.total_income = res.data.total_income //收入
                    this.total_pay = res.data.total_pay //支出
                } else {
                    this.noGameList = []
                    this.total = res.data.total_count //总条数
                    this.total_income = 0 //收入
                    this.total_pay = 0 //支出
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
        //获取游戏帐变类型
        getallbankreporttype().then(res => {
            this.ordertypeid = { ...res.data }
        })
        //获取用户下级
        getchildlist().then(res => {
            if (res.data) {
                this.userList = [...res.data]
            }
        })
        this.handleOrderHistory()
    },
    components: {
        Form,
        FormItem,
        Select,
        Option,
        DatePicker,
        Button,
        Checkbox,
        Page,
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
            &:nth-child(1),&:nth-child(3)
                flex 1.6
    .list
        height 590px
        overflow-y scroll
        li
            display flex
            margin-bottom 10px
            align-items: center;
            span, >div
                flex 1
                text-align center
                font-size 14px
                color #fff
                &:nth-child(1),&:nth-child(3)
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
