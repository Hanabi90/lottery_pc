<template>
    <div style="position:relative">
        <div class="navTitle">游戏追号记录</div>
        <div v-if="!detailedOnoff">
            <Form :model="orderHistoryList" :label-width="72" inline>
                <FormItem label="彩种名称">
                    <Select
                        v-model="orderHistoryList.lotteryid"
                        style="width:110px"
                        @on-change="getMethods"
                    >
                        <Option
                            v-for="(item,value) of lotteryList"
                            :key="value"
                            :value="value"
                        >{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="游戏玩法">
                    <Select v-model="orderHistoryList.methodid" style="width:120px">
                        <Option value="0">所有玩法</Option>
                        <Option
                            v-for="(item,index) of lotteryMethodList"
                            :key="index"
                            :value="item.methodid"
                        >{{item.methodname}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="追号状态">
                    <Select v-model="orderHistoryList.taskstatus" style="width:100px">
                        <Option
                            v-for="item of tasksList"
                            :key="item.value"
                            :value="item.value"
                        >{{item.text}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="42" label="类型">
                    <Select v-model="orderHistoryList.userpointtype" style="width:100px">
                        <Option
                            v-for="item of userpointtypeList"
                            :key="item.value"
                            :value="item.value"
                        >{{item.text}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="80" label="下级用户名">
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
                <FormItem label="彩种奖期">
                    <Input v-model="orderHistoryList.issue" placeholder="请选择"></Input>
                </FormItem>
                <FormItem :label-width="80" label="请选择日期">
                    <DatePicker
                        v-model="orderHistoryList.starttime"
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        placeholder="请选择日期"
                        style="width: 280px"
                    ></DatePicker>
                </FormItem>
                <FormItem label="下级">
                    <Checkbox true-value="1" false-value="0" v-model="orderHistoryList.include"></Checkbox>
                </FormItem>
                <Button class="button" @click="handleOrderHistory">查询</Button>
            </Form>
            <div class="content">
                <div class="title">
                    <h5>追号时间</h5>
                    <h5>用户</h5>
                    <h5>彩种</h5>
                    <h5>开始期数</h5>
                    <h5>追号内容</h5>
                    <h5>追号总金额</h5>
                    <h5>中奖后终止</h5>
                    <h5>追号状态</h5>
                    <h5>操作</h5>
                </div>
                <ul class="list">
                    <li v-for="(item,value) of userHistory" :key="value">
                        <span>{{item.updatetime}}</span>
                        <span>{{item.username}}</span>
                        <span>{{item.cnname}}</span>
                        <span>{{item.beginissue}}</span>
                        <span class="code">{{item.codes}}</span>
                        <span>{{item.taskprice}}</span>
                        <span>{{item.stoponwin==1?'是':'否'}}</span>
                        <span
                            :style="{color:item.status==0?'#018625':'#b9b9b9'}"
                        >{{item.status==0?'进行中':'已完成'}}</span>
                        <span>
                            <Button
                                @click="getDetailed(item.taskid)"
                                style="height:30px;margin-top:-6px;padding:0;width: 80px;"
                                type="primary"
                            >详情</Button>
                        </span>
                    </li>
                </ul>
                <div class="totalList">
                    <span>取消总金额：{{total_cancelprice}}</span>
                    <span>完成总金额：{{total_finishprice}}</span>
                    <span>追号总金额：{{total_taskprice}}</span>
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
        <div v-else class="listContent" style="height:950px">
            <Table width="100%" border :columns="columns2" :data="detailedTask"></Table>
            <Table border ref="selection" :columns="columns4" :data="detailedList" height="810"></Table>
        </div>
        <Button v-if="detailedOnoff" @click="back" class="back" type="primary">返回</Button>
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
    Input,
    Table
} from 'iview'
import {
    getuserlottery,
    getchildlist,
    gettaskhistory,
    getuserlotterymethod,
    gettaskhistorydetail,
    traceordercancel
} from '@/api/index'
export default {
    name: 'traceHistory',
    data() {
        return {
            orderHistoryList: {
                include: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                taskstatus: '-1', //追号状态
                issue: '', //彩种奖期
                userpointtype: '2',
                methodid: '0', //游戏玩法
                lotteryid: '0', //彩种名称
                starttime: '', //起始时间
                pn: 18, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            total: 0,
            tasksList: [
                { value: '-1', text: '所有状态' },
                { value: '0', text: '进行中' },
                { value: '1', text: '已取消' },
                { value: '2', text: '已完成' }
            ], //状态列表
            lotteryList: {}, //彩票列表
            userpointtypeList: [
                { value: '-1', text: '不含超级2000' },
                { value: '1', text: '只有超级2000' },
                { value: '2', text: '所有类型' }
            ], //类型列表
            lotteryMethodList: [], //彩票玩法id
            userList: [],
            userHistory: [],
            scroll: true, //把滚动条置顶
            detailedOnoff: false,
            columns2: [
                {
                    title: '游戏用户',
                    key: 'username',
                    width: 100,
                    fixed: 'left'
                },
                {
                    title: '追号编号',
                    key: 'taskid',
                    width: 100
                },
                {
                    title: '追号时间:',
                    key: 'begintime',
                    width: 100
                },
                {
                    title: '游戏',
                    key: 'cnname',
                    width: 100
                },
                {
                    title: '玩法',
                    key: 'methodname',
                    width: 200
                },
                {
                    title: '模式',
                    key: 'modes',
                    width: 100
                },
                {
                    title: '奖金组',
                    key: 'prizegroup',
                    width: 100
                },
                {
                    title: '追号内容',
                    key: 'codes',
                    width: 100
                },
                {
                    title: '开始期号',
                    key: 'beginissue',
                    width: 100
                },
                {
                    title: '追号期数',
                    key: 'issuecount',
                    width: 100
                },
                {
                    title: '完成期数',
                    key: 'finishedcount',
                    width: 100
                },
                {
                    title: '取消期数',
                    key: 'cancelcount',
                    width: 100
                },
                {
                    title: '完成金额',
                    key: 'finishprice',
                    width: 100
                },
                {
                    title: '取消金额',
                    key: 'cancelprice',
                    width: 100
                },
                {
                    title: '中奖后停止追号',
                    key: 'stoponwin',
                    width: 100
                },
                {
                    title: '追号状态',
                    key: 'status',
                    width: 100
                },
                {
                    title: '追号总金额',
                    key: 'taskprice',
                    fixed: 'right',
                    width: 120
                }
            ],
            detailedTask: [],
            detailedList: [],
            columns4: [
                {
                    title: '奖期',
                    key: 'issue'
                },
                {
                    title: '追号倍数',
                    key: 'multiple'
                },
                {
                    title: '追号状态',
                    key: 'traceText'
                },
                {
                    title: '状态',
                    key: 'statusText'
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        if (params.row.can != 0) {
                            let projectid = params.row.projectid
                            return h('div', [
                                h(
                                    Button,
                                    {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                traceordercancel({
                                                    taskId: this.taskId,
                                                    detailsId: params.row.entry
                                                }).then(res => {
                                                    this.$store.dispatch(
                                                        'handleMoney',
                                                        res.data.money
                                                    )
                                                    this.$Message.success(
                                                        '撤单成功'
                                                    )
                                                    params.row.can = 0
                                                    params.row.traceText =
                                                        '已取消'
                                                    this.$set(
                                                        params.row,
                                                        'statusText',
                                                        '本人撤单'
                                                    )
                                                })
                                            }
                                        }
                                    },
                                    '撤单'
                                )
                            ])
                        }
                    }
                }
            ],
            taskId: '', //撤单使用
            total_cancelprice: '0', //取消总结
            total_finishprice: '0', //完成总金额
            total_taskprice: '0' //追号总金额
        }
    },
    computed: {},
    methods: {
        //返回
        back() {
            this.detailedOnoff = false
            this.handleOrderHistory()
        },
        //获取详情
        getDetailed(id) {
            gettaskhistorydetail({ id }).then(res => {
                this.taskId = id
                this.detailedOnoff = true
                this.detailedTask[0] = res.data.task
                this.detailedList = res.data.aTaskdetail.map(item => {
                    let status
                    item.can == 0
                        ? (item._disabled = true)
                        : (item._disabled = false)

                    if (item.iscancel == 0) {
                        if (item.isgetprize == 0) {
                            status = '未开奖'
                        } else if (item.isgetprize == 2) {
                            status = '未中奖'
                        } else if (item.isgetprize == 1) {
                            if (item.prizestatus == 0) {
                                status = '未派奖'
                            } else {
                                status = '已派奖'
                            }
                        }
                    }
                    if (item.iscancel == 1) {
                        status = '本人撤单'
                    }
                    if (item.iscancel == 2) {
                        status = '平台撤单'
                    }
                    if (item.iscancel == 3) {
                        status = '错开撤单'
                    }
                    if (item.status == 0) {
                        item.traceText = '进行中'
                    }
                    if (item.status == 2) {
                        item.traceText = '已取消'
                    }
                    if (item.status == 1) {
                        if (item.can == 1) {
                            item.traceText = '已完成，可撤单'
                        } else {
                            item.traceText = '已完成，不可撤单'
                        }
                    }

                    item.statusText = status
                    return item
                })
            })
        },
        //获取玩法
        getMethods() {
            getuserlotterymethod({ lotteryid: arguments[0] }).then(res => {
                this.lotteryMethodList = [...res.data]
            })
        },
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
            gettaskhistory({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.userHistory = [...res.data.page_data] //当前数据
                    this.total = res.data.total_count //总条数
                    this.total_cancelprice = res.data.total_cancelprice //取消总结
                    this.total_finishprice = res.data.total_finishprice //完成总金额
                    this.total_taskprice = res.data.total_taskprice //追号总金额
                } else {
                    this.userHistory = []
                    this.total = 0 //总条数
                    this.total_cancelprice = 0 //取消总结
                    this.total_finishprice = 0 //完成总金额
                    this.total_taskprice = 0 //追号总金额
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
            gettaskhistory({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.userHistory = [...res.data.page_data] //当前数据
                    this.pages = Math.ceil(
                        res.data.total_count / this.orderHistoryList.pn
                    ) //页数
                    this.total_cancelprice = res.data.total_cancelprice //取消总结
                    this.total_finishprice = res.data.total_finishprice //完成总金额
                    this.total_taskprice = res.data.total_taskprice //追号总金额
                } else {
                    this.userHistory = []
                    this.pages = 1
                    this.total_cancelprice = 0 //取消总结
                    this.total_finishprice = 0 //完成总金额
                    this.total_taskprice = 0 //追号总金额
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
        getuserlottery().then(res => {
            this.lotteryList = { ...res.data }
            this.$set(this.lotteryList, 0, '所有游戏')
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
        Input,
        Table
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
            font-size 14px
            &:nth-child(2)
                flex 0.8
            &:nth-child(7)
                flex 0.8
            &:nth-child(8)
                flex 1.2
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
                &:nth-child(2)
                    flex 0.8
                &:nth-child(7)
                    flex 0.8
                &:nth-child(8)
                    flex 1.2
            .add
                color #f00
            .less
                color #00ceff
            .code
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
    .totalList
        background #ea2f4c
        line-height 46px
        font-size 14px
        color #fff
        display flex
        justify-content space-between
        &>span
            flex 1
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
.listContent
    width 975px
    border-left 1px solid #fff
    >>>.ivu-table th
        background #000
        color #fff
    >>>.ivu-table td
        background #202020
        color #fff
    >>>.ivu-table
        background none
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
.back
    position absolute
    right 10px
    top 10px
</style>
