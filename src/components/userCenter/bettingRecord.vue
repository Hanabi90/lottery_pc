<template>
    <div>
        <div class="navTitle">投注记录</div>
        <Form :model="bettingRecord" :label-width="80" inline>
            <FormItem label="彩种名称">
                <Select
                    @on-change="getUserLotterymethod"
                    v-model="bettingRecord.lotteryid"
                    style="width:140px"
                >
                    <Option v-for="(item,value) of lotteryList" :key="value" :value="value">{{item}}</Option>
                </Select>
            </FormItem>
            <FormItem label="游戏玩法">
                <Select placeholder="请先选择彩种" v-model="bettingRecord.methodid" style="width:140px">
                    <Option value="0">所有玩法</Option>
                    <Option
                        v-for="item of lotteryMethodList"
                        :key="item.methodid"
                        :value="item.methodid"
                    >{{item.methodname}}</Option>
                </Select>
            </FormItem>
            <FormItem label="奖金组类型">
                <Select v-model="bettingRecord.userpointtype" style="width:140px">
                    <Option
                        v-for="item of userPointTypeList"
                        :key="item.value"
                        :value="item.value"
                    >{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="请选择日期">
                <DatePicker
                    v-model="bettingRecord.starttime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placeholder="请选择日期"
                    style="width: 190px"
                    placement="bottom-end"
                ></DatePicker>
            </FormItem>
            <FormItem label="下级用户名">
                <Select placeholder="查询下级信息" v-model="bettingRecord.username" style="width:140px">
                    <Option
                        v-for="(item,value) of userList"
                        :key="value"
                        :value="item.username"
                    >{{item.username}}</Option>
                </Select>
            </FormItem>
            <FormItem label="彩种奖期">
                <Input style="width:140px" v-model="bettingRecord.issue" placeholder="请选择"></Input>
            </FormItem>
            <FormItem label="下级">
                <Checkbox true-value="1" false-value="0" v-model="bettingRecord.include"></Checkbox>
            </FormItem>
            <Button class="button" @click="getBetHistory" type="primary">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>投注时间</h5>
                <h5>用户</h5>
                <h5>彩种</h5>
                <h5>投注期号</h5>
                <h5>投注内容</h5>
                <h5>玩法名称</h5>
                <h5>投注金额</h5>
                <h5>奖金</h5>
                <h5>开奖号码</h5>
                <h5>状态</h5>
                <h5>操作</h5>
            </div>

            <ul class="list">
                <li v-for="(item,value) of userHistory" :key="value">
                    <span>{{item.writetime}}</span>
                    <span>{{item.username}}</span>
                    <span>{{item.cnname}}</span>
                    <span>{{item.issue}}</span>
                    <Tooltip
                        max-width="400"
                        :content="item.code"
                    >{{item.code.slice(0,4)}}{{item.code.length>4?"...":''}}</Tooltip>
                    <Tooltip
                        max-width="400"
                        :content="item.methodname"
                    >{{item.methodname.slice(0,4)}}{{item.methodname.length>4?"...":''}}</Tooltip>

                    <span>{{item.totalprice}}</span>
                    <span>{{item.bonus}}</span>
                    <Tooltip
                        max-width="400"
                        :content="item.nocode"
                    >{{item.nocode?item.nocode.slice(0,4):''}}{{(item.nocode&&item.nocode.length)>4?"...":''}}</Tooltip>
                    <span>{{handleStatus(item.iscancel,item.isgetprize,item.prizestatus)}}</span>
                    <span>
                        <Button
                            type="primary"
                            :disabled="!item.can"
                            @click="handleCancel(item.projectid,value)"
                        >撤单</Button>
                    </span>
                </li>
            </ul>
            <div class="totalList">
                <span>总投注金额：{{total_betmoney}}</span>
                <span>总奖金：{{total_bonus}}</span>
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
                :page-size="this.bettingRecord.pn"
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
    DatePicker,
    Button,
    Checkbox,
    Page,
    Input,
    Tooltip
} from 'iview'
import {
    getuserlottery,
    getuserlotterymethod,
    getchildlist,
    getbethistory,
    ordercancel
} from '@/api/index'
export default {
    name: 'bettingRecord',
    data() {
        return {
            bettingRecord: {
                include: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                userpointtype: '2', //投注类型
                issue: '', //彩种奖期
                methodid: '0', //游戏玩法
                lotteryid: '0', //彩种名称
                starttime: '', //起始时间
                pn: 10, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            lotteryList: {}, //彩票id
            lotteryMethodList: [], //玩法id
            userList: [],
            userPointTypeList: [
                { value: '2', name: '所有类型' },
                { value: '-1', name: '不含超级2000' },
                { value: '1', name: '只有超级2000' }
            ],
            userHistory: [],
            total: 0, //页数
            datafinish: '数据已加载完',
            total_betmoney: 0,
            total_bonus: 0
        }
    },
    methods: {
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
        changePn(value) {
            this.$set(this.bettingRecord, 'pn', value)
            this.getBetHistory()
        },
        handleCancel(projectid, value) {
            ordercancel({ projectid }).then(res => {
                this.$set(this.userHistory[value], 'can', 0)
                this.$Message.success('撤单成功')
            })
        },
        getUserLotterymethod() {
            getuserlotterymethod({
                lotteryid: this.bettingRecord.lotteryid
            }).then(res => {
                this.lotteryMethodList = [...res.data]
            })
        },
        getBetHistory() {
            this.$refs.page.changePage(1)
            let bettingRecord = { ...this.bettingRecord }
            bettingRecord.starttime = this.dataformat(
                this.bettingRecord.starttime[0]
            )
            bettingRecord.endtime = this.dataformat(
                this.bettingRecord.starttime[1]
            )
            bettingRecord.p = 1
            this.$set(this.bettingRecord, 'p', 1)
            getbethistory({ ...bettingRecord }).then(res => {
                if (res.data.page_data) {
                    this.userHistory = [...res.data.page_data]
                    this.total = res.data.total_count
                    this.total_betmoney = res.data.total_betmoney
                    this.total_bonus = res.data.total_bonus
                } else {
                    this.userHistory = []
                    this.pages = 0
                    this.total_betmoney = 0
                    this.total_bonus = 0
                }
            })
        },
        handleReachBottom(value) {
            let bettingRecord = { ...this.bettingRecord }
            bettingRecord.starttime = this.dataformat(
                this.bettingRecord.starttime[0]
            )
            bettingRecord.endtime = this.dataformat(
                this.bettingRecord.starttime[1]
            )
            bettingRecord.p = value

            getbethistory({ ...bettingRecord }).then(res => {
                if (res.data.page_data) {
                    this.userHistory = [...res.data.page_data]
                    this.total = res.data.total_count

                    this.total_betmoney = res.data.total_betmoney
                    this.total_bonus = res.data.total_bonus
                } else {
                    this.userHistory = []
                    this.pages = 0
                    this.total_betmoney = 0
                    this.total_bonus = 0
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
        },
        handleStatus(iscancel, isgetprize, prizestatus) {
            if (iscancel == 0) {
                if (isgetprize == 0) {
                    return '未开奖'
                } else if (isgetprize == 2) {
                    return '未中奖'
                } else if (isgetprize == 1) {
                    if (prizestatus == 0) {
                        return '未派奖'
                    } else {
                        return '已派奖'
                    }
                }
            }
            if (iscancel == 1) {
                return '本人撤单'
            }
            if (iscancel == 2) {
                return '平台撤单'
            }
            if (iscancel == 3) {
                return '错开撤单'
            }
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
        this.getBetHistory()
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
                flex 1.6
            &:nth-child(2)
                flex 0.8
            &:nth-child(3)
                flex 1.2
            &:nth-child(4)
                flex 1.4
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
                    flex 1.7
                &:nth-child(2)
                    flex 0.8
                &:nth-child(3)
                    flex 1.2
                &:nth-child(4)
                    flex 1.4
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
