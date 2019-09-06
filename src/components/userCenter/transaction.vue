<template>
    <div>
        <div class="navTitle">交易明细</div>
        <Form :model="bettingRecord" :label-width="76" inline>
            <FormItem label="交易类型">
                <Select
                    placeholder="请选择交易类型"
                    v-model="bettingRecord.ordertypeid"
                    style="width:140px"
                >
                    <Option :value="-2">所有类型</Option>
                    <Option :value="-3">充值</Option>
                    <Option :value="-4">提款</Option>
                    <Option :value="-5">转入</Option>
                    <Option :value="-6">转出</Option>
                </Select>
            </FormItem>
            <FormItem label="请选择日期">
                <DatePicker
                    v-model="bettingRecord.starttime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placeholder="请选择日期"
                    :options="maxDay"
                    style="width: 280px"
                ></DatePicker>
            </FormItem>
            <FormItem :label-width="76" label="下级用户名">
                <Select placeholder="查询下级信息" v-model="bettingRecord.username" style="width:120px">
                    <Option
                        v-for="(item,value) of userList"
                        :key="value"
                        :value="item.username"
                    >{{item.username}}</Option>
                </Select>
            </FormItem>
            <FormItem :label-width="36" label="下级">
                <Checkbox true-value="1" false-value="0" v-model="bettingRecord.includechild"></Checkbox>
            </FormItem>
            <Button class="button" @click="handleSeach" type="primary">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>时间</h5>
                <h5>交易类别</h5>
                <h5>交易内容</h5>
                <h5>金额</h5>
                <h5>交易单号</h5>
            </div>
            <ul class="list">
                <li v-for="(item,value) of userHistory" :key="value">
                    <span>{{item.times}}</span>
                    <span>{{item.cntitle}}</span>
                    <span>{{item.description}}</span>
                    <span>{{item.amount}}</span>

                    <span>{{item.orderno}}</span>
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
import {
    Form,
    FormItem,
    DatePicker,
    Select,
    Option,
    Button,
    Checkbox,
    Page
} from 'iview'
import { getbankreporthistory, getchildlist } from '@/api/index'
export default {
    name: 'transaction',
    data() {
        return {
            bettingRecord: {
                includechild: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                ordertypeid: -2, //帐变类型id
                starttime: '', //起始时间
                endtime: '', //结束时间
                pn: 18, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            total: 1,
            userList: [], //下级用户名
            userHistory: [],
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
        handleSeach() {
            this.handleReachBottom(1)
            this.$refs.page.currentPage = 1
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
            this.$set(this.bettingRecord, 'pn', value)
            this.$set(this.bettingRecord, 'p', 1)
            this.getBetHistory()
        },

        getBetHistory() {
            let bettingRecord = { ...this.bettingRecord }
            if (bettingRecord.starttime[0]) {
                bettingRecord.starttime = this.dataformat(
                    this.bettingRecord.starttime[0]
                )
                bettingRecord.endtime = this.dataformat(
                    this.bettingRecord.starttime[1]
                )
            } else {
                bettingRecord.starttime = ''
                bettingRecord.endtime = ''
            }
            getbankreporthistory({
                ...bettingRecord
            }).then(res => {
                if (!res.data.page_data) {
                    this.userHistory = []
                    this.$Message.success('暂无数据')
                    return
                }
                this.userHistory = [...res.data.page_data]
                this.total = res.data.total_count
            })
        },
        handleReachBottom(value) {
            this.$set(this.bettingRecord, 'p', value)
            this.getBetHistory()
        }
    },
    mounted() {
        this.getBetHistory()
        //获取用户下级
        getchildlist().then(res => {
            if (res.data) {
                this.userList = [...res.data]
            }
        })
    },
    components: {
        Form,
        FormItem,
        Select,
        Option,
        Button,
        Checkbox,
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
                line-height 30px
                color #fff
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
