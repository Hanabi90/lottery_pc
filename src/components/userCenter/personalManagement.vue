<template>
    <div class="personalMangagement">
        <div class="title">
            <div>
                <span class="name">{{$store.state.nickname}}</span>
                <div>
                    <span>彩票余额：</span>
                    <span>{{$store.state.money}}</span>
                </div>
            </div>
            <div class="btns">
                <span @click="handleAlert(2, 'Recharge', '充值')">
                    <Icon
                        style="position: absolute;
                            top: 50%;
                            left: 30%;
                            transform: translateY(-50%);"
                        type="ios-cash-outline"
                        size="20"
                        color="#fff"
                    />

                    <button>充值</button>
                </span>
                <span @click="handleAlert(2, 'Withdrawal', '提款')">
                    <Icon
                        style="position: absolute;
                            top: 50%;
                            left: 30%;
                            transform: translateY(-50%);"
                        type="ios-cash"
                        size="20"
                        color="#fff"
                    />
                    <button>提款</button>
                </span>
                <span @click="handleAlert(2, 'Transfer', '转账')">
                    <Icon
                        style="position: absolute;
                            top: 50%;
                            left: 30%;
                            transform: translateY(-50%);"
                        type="ios-cash"
                        size="20"
                        color="#fff"
                    />
                    <button>转账</button>
                </span>
            </div>
        </div>
        <ul class="list">
            <li>
                <div>
                    <div class="icon_bg">
                        <Icon type="ios-lock-outline" size="30" color="#ea2f4c" />
                    </div>
                    <div class="title_wrap">
                        <p>登录密码</p>
                        <span>6-16个字符</span>
                    </div>
                </div>
                <div @click="handleAlert('1','changePassword','修改密码')">修改登录密码</div>
            </li>
            <li>
                <div>
                    <div class="icon_bg">
                        <Icon type="ios-card" size="30" color="#ea2f4c" />
                    </div>
                    <div class="title_wrap">
                        <p>绑定银行卡</p>
                        <span>最多可绑定1张银行卡</span>
                    </div>
                </div>
                <div @click="handleAlert('132','bank','绑定银行卡')">绑定银行卡</div>
            </li>
            <li>
                <div>
                    <div class="icon_bg">
                        <Icon type="md-key" size="30" color="#ea2f4c" />
                    </div>
                    <div class="title_wrap">
                        <p>资金密码</p>
                        <span>6-16个字符</span>
                    </div>
                </div>
                <div @click="handleAlert('2','Secpass','资金密码')">资金密码</div>
            </li>
            <li>
                <div>
                    <div class="icon_bg">
                        <Icon type="ios-mail-outline" size="30" color="#ea2f4c" />
                    </div>
                    <div class="title_wrap">
                        <p>站内信</p>
                        <span>
                            <span style="color:#fbe5e5">{{unread}}</span>
                            条未读
                        </span>
                    </div>
                </div>
                <div @click="handleAlert('2','information','站内信')">查看站内信</div>
            </li>
            <li>
                <div>
                    <div class="icon_bg">
                        <Icon type="ios-list-box" size="30" color="#ea2f4c" />
                    </div>
                    <div class="title_wrap">
                        <p>密保设定</p>
                        <span>用于找回密码</span>
                    </div>
                </div>
                <div @click="handleAlert('2','bindquestion','密保设定')">修改密码设定</div>
            </li>
            <li>
                <div>
                    <div class="icon_bg">
                        <Icon type="md-volume-up" size="30" color="#ea2f4c" />
                    </div>
                    <div class="title_wrap">
                        <p>公告</p>
                        <span>请随时关注最新公告</span>
                    </div>
                </div>
                <div @click="handleAlert('2','notice','系统公告')">查看公告</div>
            </li>
        </ul>
        <Modal
            @on-visible-change="updateInformation"
            :class="{notice:alertComponent=='notice'}"
            :width="modelWidth"
            v-model="alert"
        >
            <p slot="header" class="alertHeader">
                <span>{{alertTitle}}</span>
            </p>
            <div>
                <component
                    v-if="alert"
                    :params="comParams"
                    :parent="`${this}`"
                    :is="alertComponent"
                ></component>
            </div>
            <div slot="footer"></div>
        </Modal>
        <notice ref="notice"></notice>
    </div>
</template>

<script>
import { Button, Icon, Modal } from 'iview'
import changePassword from '../userCenter/changePassword'
import bank from '../userCenter/bank'
import information from '../userCenter/information'
import bindquestion from '../userCenter/bindquestion'
import notice from '../userCenter/notice'
import Secpass from '../userCenter/secpass'
import Recharge from '../userCenter/recharge'
import Withdrawal from '@/components/userCenter/withdrawal'
import Transfer from '@/components/userCenter/transfer'
import { getunreadmessageamount, getsecpass } from '@/api/index'
export default {
    data() {
        return {
            alertComponent: '',
            alertTitle: '',
            alert: false,
            comParams: '',
            unread: 0,
            modelWidth: 640
        }
    },
    mounted() {
        this.updateInformation()
    },
    methods: {
        handleAlert(value, target, title) {
            if (target == 'notice') {
                this.$refs.notice.handleAlert(0)
                return
            }
            if (target == 'Secpass') {
                getsecpass().then(res => {
                    this.comParams = 2
                    this.alert = true
                    this.alertTitle = title
                    this.alertComponent = 'changePassword'
                })
            }
            if (target == 'bank') {
                getsecpass().then(res => {
                    this.comParams = value
                    this.alert = true
                    this.alertTitle = title
                    this.alertComponent = target
                })
                return
            }
            if (
                target == 'Transfer' ||
                target == 'Withdrawal' ||
                target == 'Recharge'
            ) {
                this.modelWidth = '820px'
            } else {
                this.modelWidth = '640'
            }

            this.comParams = value
            this.alert = true
            this.alertTitle = title
            this.alertComponent = target
        },
        //更新消息
        updateInformation(blo) {
            if (!blo) {
                getunreadmessageamount().then(res => {
                    this.unread = res.data.unreadamount
                    this.$store.dispatch(
                        'handleUnReadAmount',
                        res.data.unreadamount
                    )
                })
                this.modelWidth = '640px'
            }
        }
    },
    components: {
        Icon,
        Modal,
        changePassword,
        bank,
        information,
        bindquestion,
        notice,
        Secpass,
        Recharge,
        Withdrawal,
        Transfer
    }
}
</script>

<style lang="stylus" scoped>
>>>.ivu-modal-content
    border-radius 0
>>>.ivu-modal-header
    background #000
    p
        color #fff
        text-align center
.container
    background transparent !important
.personalMangagement
    width 100%
    .title
        display flex
        margin-bottom 18px
        align-items center
        &>div:nth-child(1)
            width 50%
            display flex
            background #202020
            color #b9b9b9
            height 50px
            line-height 50px
            font-size 16px
            padding 0 28px
            justify-content space-between
            margin-right 18px
            &>.name
                color #fff
            &>div
                span:nth-child(2)
                    color #ea2f4c
        .btns
            display flex
            span
                height 50px
                width 150px
                background linear-gradient(#fe5c57, #e6322d)
                border-radius 30px
                display flex
                justify-content center
                position relative
                &:nth-child(2)
                    margin 0 10px
                button
                    background none
                    border none
                    outline none
                    color #fff
                    font-size 18px
                    position absolute
                    top 50%
                    left 45%
                    transform translateY(-50%)
    .list
        width 100%
        display flex
        flex-wrap wrap
        li
            width 50%
            display flex
            align-items center
            justify-content space-between
            background #202020
            height 90px
            margin-bottom 18px
            border-radius 8px
            padding 10px 26px
            &:nth-child(odd)
                margin-right 18px
            &:nth-child(even)
                width calc(50% - 18px)
            &>div
                &:nth-child(1)
                    display flex
                    align-items center
                &:nth-child(2)
                    cursor pointer
                &>.icon_bg
                    background #fbe5e5
                    height 60px
                    width 60px
                    border-radius 50%
                    display flex
                    justify-content center
                    align-items center
                    margin-right 10px
                &>.title_wrap
                    display flex
                    flex-direction column
                    justify-content space-evenly
                    height 60px
                    p
                        color #fff
                        font-size 16px
                    span
                        color #b9b9b9
                &:nth-child(2)
                    text-decoration underline
                    color #ea2f4c
</style>
