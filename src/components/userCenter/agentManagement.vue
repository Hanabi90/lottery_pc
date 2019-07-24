<template>
    <div style="position:relative">
        <div class="navTitle">团队推广</div>
        <div>
            <div class="content" style="padding:15px">
                <div v-if="navIndex==1" class="team">
                    <Form ref="teamGroup" :model="teamGroup" :label-width="80" inline>
                        <FormItem :label-width="60" label="用户名">
                            <Input
                                style="width:140px"
                                type="text"
                                :readonly="readonly"
                                @on-focus="removeInputReadonly"
                                v-model="teamGroup.username"
                                placeholder="请输入用户名"
                            ></Input>
                        </FormItem>
                        <FormItem label="用户余额">
                            <Input
                                style="width:140px"
                                type="text"
                                v-model="teamGroup.bank_min"
                                placeholder="最少金额"
                            ></Input>
                        </FormItem>
                        <FormItem :label-width="0">
                            <Input
                                style="width:140px"
                                type="text"
                                v-model="teamGroup.bank_max"
                                placeholder="最大金额"
                            ></Input>
                        </FormItem>
                        <Button class="button" type="primary" @click="getGroupList">查询</Button>
                        <Button
                            class="button"
                            style="margin:0 10px;letter-spacing:0"
                            type="primary"
                            @click="handleAlert('','OpenAccount','注册用户')"
                        >注册用户</Button>
                        <Button
                            @click="handleAlert('','OpenLine','推广链接')"
                            class="button"
                            style="letter-spacing:0"
                            type="primary"
                        >推广链接</Button>
                        <FormItem :label-width="20">
                            <Breadcrumb separator="<b class='demo-breadcrumb-separator'>></b>">
                                <BreadcrumbItem
                                    v-for="(item,index) of userTree"
                                    style="color:#ea2f4c"
                                    :key="index"
                                    @click.native="getGroupList({uid:item.userid})"
                                >{{item.username}}</BreadcrumbItem>
                            </Breadcrumb>
                        </FormItem>
                    </Form>
                    <div class="teamCenter">
                        <ul class="teamGroupListTitle">
                            <li>用户名</li>
                            <li>用户类型</li>
                            <li>奖金组</li>
                            <li>{{`${systemtype==0?'用户余额':'信用余额'}`}}</li>
                            <li style="flex:4">用户操作</li>
                        </ul>

                        <ul class="teamList">
                            <li v-for="(item, index) in teamList" :key="index">
                                <span>{{item.username}}</span>
                                <span>{{item.groupname}}</span>
                                <span>{{item.prizeGroup.toFixed()}}</span>
                                <span>{{item.money}}</span>
                                <span style="flex:4">
                                    <Button
                                        v-if="systemtype!=1"
                                        type="primary"
                                        size="small"
                                        :disabled="istop!=1"
                                        @click="handleSubordinateRecharge(item.userid)"
                                    >充值</Button>
                                    <Button
                                        type="primary"
                                        size="small"
                                        @click="handleAlert(item.userid,'TeamAccount','团队余额')"
                                    >团队余额</Button>
                                    <Button
                                        v-if="systemtype==1"
                                        type="primary"
                                        size="small"
                                        :disabled="systemtype!=1||userId!=item.parentid"
                                        @click="handleAlert(item.userid,'Reputation','信誉设置')"
                                    >信用设置</Button>
                                    <Button
                                        type="primary"
                                        size="small"
                                        :disabled="systemtype!=0||userId!=item.parentid "
                                        @click="handleAlert(item.userid,'SetPoint','返点设置')"
                                    >返点设置</Button>
                                    <Button
                                        type="primary"
                                        size="small"
                                        :disabled="item.usertype!=1"
                                        @click="getGroupList({uid:item.userid})"
                                    >查询下级</Button>
                                </span>
                            </li>
                        </ul>
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
                        :page-size="this.teamGroup.pn"
                        @on-change="handleReachBottom"
                        @on-page-size-change="changePn"
                        :total="Number(total)"
                        class="page"
                    />
                    <Button @click="handleGo" class="btn">Go</Button>
                </div>
            </div>
        </div>
        <Modal v-model="alert" @on-visible-change="updateList" :width="60">
            <p slot="header" class="alertHeader">
                <span>{{alertTitle}}</span>
            </p>
            <div>
                <component style="margin:auto" v-if="alert" :uid="pointUserId" :is="alertComponent"></component>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import {
    Form,
    FormItem,
    Input,
    Button,
    Page,
    Breadcrumb,
    BreadcrumbItem,
    Modal
} from 'iview'
import { getgrouplist } from '@/api/index'
import GameHistory from './gameHistory'
import SetPoint from './setPoint'
import TeamAccount from './teamAccount'
import Reputation from './reputation'
import SubordinateRecharge from './subordinateRecharge'
import OpenAccount from './openAccount'
import OpenLine from './openLine'
import TeamProfitLossStatement from './teamProfitLossStatement'
export default {
    name: 'agentManagement',
    data() {
        return {
            alert: false, //弹窗开关
            alertTitle: '', //弹窗标题
            alertComponent: '', //弹窗内容组件
            subordinateRecharge: false, //充值
            reputation: false, //信誉设置
            teamAccount: false, //显示团队余额
            backOnoff: false, //返回按钮开关
            pointUserId: '', //设置返点的id
            username: '', //游戏帐变查询使用
            setPoint: false, //游戏返点设置
            gameHistory: false, //游戏帐变开关
            loading: false,
            addUserType: '1', //选择添加类型
            readonly: true, //解决浏览器默认密码输入
            navIndex: 1, //导航下标位置
            teamGroup: {
                username: '',
                bank_min: '',
                bank_max: '',
                p: 1,
                pn: 10
            },
            teamList: [],
            istop: '', //是否是vip类型
            systemtype: JSON.parse(sessionStorage.getItem('userSeting'))
                .systemtype,
            total: 0, //总条数
            teamGroupUpdate: true, //下拉是否加载完
            userTree: [], //用户树结构
            userId: JSON.parse(sessionStorage.getItem('userSeting')).userid
        }
    },
    methods: {
        //关闭弹窗更新数据
        updateList(blo) {
            if (!blo) {
                this.getGroupList()
            }
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
        changePn(value) {
            this.$set(this.teamGroup, 'pn', value)
            this.getgrouplist()
        },
        //弹窗
        handleAlert(value, target, title) {
            this.alert = true
            this.alertTitle = title
            this.alertComponent = target
            this.pointUserId = value
        },

        //设置充值
        handleSubordinateRecharge(value) {
            this.backOnoff = true
            this.pointUserId = value
            this.subordinateRecharge = true
        },
        //设置返点
        handlePoint(value) {
            this.setPoint = true
            this.pointUserId = value
            this.backOnoff = true
        },
        //返回
        back() {
            this.teamAccount = false
            this.gameHistory = false
            this.setPoint = false
            this.backOnoff = false
            this.reputation = false
            this.subordinateRecharge = false
        },
        //游戏帐变查询
        getGameHistory(value) {
            this.gameHistory = true
            this.username = value
            this.backOnoff = true
        },
        //查询团队列表
        getGroupList(obj) {
            getgrouplist({ ...this.teamGroup, ...obj }).then(res => {
                this.istop = res.data.istop
                this.teamList = res.data.page_data
                this.total = res.data.total_count
                if (res.data.usertree) {
                    this.userTree = res.data.usertree
                } else {
                    this.teamGroup.p = 0
                    this.userTree = []
                }
            })
        },
        //下拉加载
        handleReachBottom(value) {
            this.$set(this.teamGroup, 'p', value)
            getgrouplist(this.teamGroup).then(res => {
                this.istop = res.data.istop
                this.teamList = res.data.page_data
                this.total = res.data.total_count
                if (res.data.usertree) {
                    this.userTree = res.data.usertree
                } else {
                    this.teamGroup.p = 0
                    this.userTree = []
                }
            })
        },
        removeInputReadonly() {
            this.readonly = false
        }
    },
    mounted() {
        this.getGroupList()
    },
    components: {
        Form,
        FormItem,
        Input,
        Button,
        Page,
        Breadcrumb,
        BreadcrumbItem,
        GameHistory,
        SetPoint,
        TeamAccount,
        Reputation,
        SubordinateRecharge,
        OpenAccount,
        TeamProfitLossStatement,
        Modal,
        OpenLine
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
>>>.ivu-modal
    width -webkit-max-content !important
    width -moz-max-content !important
    width max-content !important
.teamCenter
    border-radius 3px
    overflow hidden
    .teamGroupListTitle
        background #000
        display flex
        color #fff
        line-height 45px
        text-align center
        li
            flex 1
    .teamList
        height 590px
        overflow-y scroll
        background #131313
        li
            display flex
            text-align center
            line-height 44px
            font-size 14px
            color #fff
            span
                flex 1
                button
                    margin 0 4px
                    color #fff
                    width 76px
                    height 30px
                    padding 0
                    text-align center
                    background #ea2f4c
                    border-radius 15px
                    border none
                    font-size 14px
                    &[disabled]
                        color #ffffff
                        background-color #999999
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
    &:nth-child(3)
        background-image linear-gradient(0, rgb(111, 135, 250) 0%, rgb(95, 245, 233) 100%)
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
>>>.ivu-modal-header
    background #000
    p
        color #fff
        text-align center
</style>
