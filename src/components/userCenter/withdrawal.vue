<template>
    <div class="withdrawal">
        <Secpass v-if="secpassShow" />
        <Steps class="steps" :current="step">
            <Step title="设置提款请求" content></Step>
            <Step title="确认提款信息" content></Step>
            <Step title="完成申请" content></Step>
        </Steps>
        <p
            class="description"
        >** 注意：每天限制提款{{list.times}}次，您已提款{{list.count}}次，提款时间为 00:01 至 00:00 您今日剩余提款额度为{{list.availablebalance}}元</p>
        <ul class="list">
            <li v-if="step!=2">
                <span>用户账号</span>
                <span>{{userName}}</span>
            </li>
            <li v-if="step==0">
                <span>可提款额度</span>
                <span>{{list.availablebalance}}</span>
            </li>
            <li v-if="step!=2">
                <span>提款金额</span>
                <InputNumber
                    v-if="step==0"
                    class="inputStyle"
                    :max="list.max_money"
                    :min="list.min_money"
                    v-model="money"
                    placeholder="请输入金额"
                    :active-change="false"
                ></InputNumber>
                <span v-if="step==1">{{money}}</span>
            </li>
            <li v-if="step==0">
                <span></span>
                <span>单笔最低提现金额：{{list.min_money}}元</span>
                <span>最高：{{list.max_money}}元</span>
            </li>
            <li v-if="step!=2">
                <span>收款银行卡</span>
                <span>{{bankNumber}}</span>
            </li>

            <li v-if="step==1">
                <span>收款银行卡</span>
                <span>中国工商银行</span>
            </li>
            <li v-if="step==1">
                <span>开户行所在地</span>
                <span>{{province}}</span>
            </li>
            <li v-if="step==1">
                <span>开户名</span>
                <span>{{accountName}}</span>
            </li>
            <li v-if="step==2" class="finsh">
                <Icon type="ios-checkmark-circle" />
                <div>
                    <p>账号提款申请成功</p>
                    <p @click="step=0">还要提现</p>
                </div>
            </li>
            <li>
                <Button
                    v-if="list.times-list.count"
                    class="submit"
                    @click="HandleSubmint"
                    type="primary"
                >下一步</Button>
            </li>
        </ul>
    </div>
</template>

<script>
import { Steps, Step, InputNumber, Icon } from 'iview'
import { handleThreeWithdraw } from '@/api/index'
import Secpass from './secpass.vue'
export default {
    name: 'withdrawal',
    data() {
        return {
            secpassShow: true,
            money: null,
            bank: null,
            step: 0,
            bankNumber: '',
            bankName: '',
            accountName: '',
            province: '',
            list: '',
            userName: ''
        }
    },
    methods: {
        HandleSubmint() {
            if (this.step == 1) {
                handleThreeWithdraw({
                    flag: 'withdraw',
                    bankinfo: `${this.list.banks[0].id}#${this.list.banks[0].bank_id}`,
                    money: this.money
                }).then(res => {
                    this.list = res.data
                    this.$Message.success(res.msg)
                    this.$store.dispatch(
                        'handleMoney',
                        res.data.availablebalance
                    )
                    this.step++
                })
            } else {
                this.step++
            }
        }
    },
    mounted() {
        this.$parent.$parent.modalWidth = '800px'
        handleThreeWithdraw().then(res => {
            this.bankNumber = res.data.banks[0].account
            this.bankName = res.data.banks[0].bank_name
            this.accountName = res.data.banks[0].account_name
            this.province = res.data.banks[0].province
            this.list = res.data
            this.userName = res.data.user.username
        })
    },
    components: {
        Steps,
        Step,
        InputNumber,
        Icon,
        Secpass
    }
}
</script>

<style lang="stylus" scoped>
.withdrawal
    .steps
        width 960px
        margin auto
    .description
        color #ff0000
        border 1px solid #f5e187
        line-height 40px
        width 680px
        margin 20px auto
        border-radius 6px
        text-align center
    .list
        li
            color #333
            width 400px
            margin 20px auto
            span
                display inline-block
            span:nth-child(1)
                width 100px
                text-align right
                padding-right 20px
    .submit
        background #e93934
        height 40px
        border none
        font-size 20px
        padding 0
        line-height 40px
        width 200px
        display block
        margin auto
        margin-top 20px
        color #fff
        border none
    .inputStyle
        width 200px
    >>>.ivu-icon-ios-checkmark
        color #ff0000 !important
    >>>.ivu-steps-status-finish
        .ivu-steps-head-inner
            border-color #ff0000 !important
        .ivu-steps-title
            color #ff0000
        .ivu-steps-tail>i:after
            background #ff0000
    >>>.ivu-steps-status-process
        .ivu-steps-head-inner
            border-color #ff0000 !important
            background-color #fff
            span
                color #ff0000
        .ivu-steps-title
            color #ff0000
    >>>.ivu-steps-title
        margin-top -4px
        font-size 24px
    .finsh
        width 780px !important
        height 300px
        background #f7fff4
        border 1px solid #dcebd7
        display flex
        justify-content center
        align-items center
        i
            font-size 80px
            color #48ac3e
        p
            font-size 20px
            &:nth-child(1)
                color #48ac3e
            &:nth-child(2)
                text-decoration underline
</style>
