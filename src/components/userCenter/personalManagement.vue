<template>
    <div class="personalMangagement">
        <div class="title">
            <div>
                <span class="name">{{$store.state.nickname}}</span>
                <div>
                    <span>彩票返点：</span>
                    <span>7.8%</span>
                </div>
                <div>
                    <span>彩票余额：</span>
                    <span>{{$store.state.money}}</span>
                    <Icon
                        style="margin-top: -5px;margin-left: 5px;"
                        type="ios-refresh"
                        size="20"
                        color="#fff"
                    />
                </div>
            </div>
            <div class="btns">
                <span>
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
                <span>
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
                        <span>最多可绑定5张银行卡</span>
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
                        <p>提款密码</p>
                        <span>6-16个字符</span>
                    </div>
                </div>
                <div @click="handleAlert('2','changePassword','提款密码')">提款密码</div>
            </li>
            <li>
                <div>
                    <div class="icon_bg">
                        <Icon type="ios-mail-outline" size="30" color="#ea2f4c" />
                    </div>
                    <div class="title_wrap">
                        <p>站内信</p>
                        <span>
                            <span style="color:#fbe5e5">0</span>
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
        <Modal :class="{notice:alertComponent=='notice'}" width="640" v-model="alert">
            <p slot="header" class="alertHeader">
                <span>{{alertTitle}}</span>
            </p>
            <div>
                <component v-if="alert" :params="comParams" :is="alertComponent"></component>
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
export default {
    data() {
        return {
            alertComponent: '',
            alertTitle: '',
            alert: false,
            comParams: ''
        }
    },
    props: {
        marqueeIndex: {
            default: -1,
            type: Number
        }
    },
    methods: {
        handleAlert(value, target, title) {
            if (target == 'notice') {
                this.$refs.notice.handleAlert(0)
                return
            }
            this.comParams = value
            this.alert = true
            this.alertTitle = title
            this.alertComponent = target
        }
    },
    created() {
        if (this.marqueeIndex !== -1) {
            this.handleAlert(this.marqueeIndex, 'notice', '系统公告')
        }
    },
    components: {
        Icon,
        Modal,
        changePassword,
        bank,
        information,
        bindquestion,
        notice
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
                &:nth-child(1)
                    margin-right 20px
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
