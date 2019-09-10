<template>
    <div class="recharge">
        <p class="title">充值处理时间：7*24小时充值服务</p>
        <div class="description">
            <p>
                <span>选择充值银行：</span>
                <span>{{onOff.title}}</span>
                <span>如选择银行卡转账，请勿使用其他支付方式，否则充值将无法到账</span>
            </p>
        </div>
        <ul class="backList">
            <li
                v-for="(item,index) of typeList"
                :key="index"
                @click="chosenActive(item)"
                :class="{active:onOff.title==item.title}"
            >
                <i :class="handleClass(item.url)"></i>
                <span>{{item.title}}</span>
                <i class="active"></i>
            </li>
        </ul>
        <!-- <div class="wangyin" v-show="actionname=='dsfchongzhi'">
            <span class="selectBank">选择网银银行:</span>
            <Select v-model="selectedBank_code" style="width:200px">
                <Option v-for="item in banklist" :value="item.bank_code" :key="item.bank_code">{{ item.bank_name }}</Option>
            </Select>
        </div>-->
        <div class="money">
            <span>充值金额(人民币)</span>
            <InputNumber
                ref="inputNumber"
                v-model="money"
                :max="9999999.99"
                :min="0"
                type="number"
                style="width:260px;height:40px; vertical-align:top"
                placeholder="请输入金额"
                @on-change="NumberToChinese(money)"
            ></InputNumber>
            <span>元</span>
        </div>
        <p style="margin-left:180px">
            <span style="margin-right:20px">
                最小充值金额
                <span style="color:blue">{{alertmin}}</span>
            </span>
            <span>
                最大充值金额
                <span style="color:blue">{{alertmax}}</span>
            </span>
        </p>
        <div class="moneyDescription">
            <span>充值金额(大写):</span>
            <span>{{text}}</span>
        </div>
        <Divider></Divider>
        <Button class="submit" @click="handleRecharge" type="primary">充值</Button>
    </div>
</template>

<script>
import { unionpayaddcredit, getThreeDeposit } from '@/api/index'
import { Button, InputNumber, Divider, Select, Option } from 'iview'
export default {
    name: 'recharge',
    data() {
        return {
            typeList: [],
            alertmin: 0,
            alertmax: 0,
            money: null,
            aid: '',
            typename: '',
            bank_code: '',
            onOff: '云闪付',
            text: '',
            unit: new Array(
                '仟',
                '佰',
                '拾',
                '',
                '仟',
                '佰',
                '拾',
                '',
                '角',
                '分'
            ),
            actionname: '',
            selectedBank_code: '',
            banklist: []
        }
    },
    methods: {
        handleRecharge() {
            if(this.typeList==null||this.typeList.length<1){
                this.$Message.error('充值渠道维护中，请联系客服')
                return
            }
            if (this.money) {
                unionpayaddcredit(
                    {
                        flag: 'load',
                        aid: this.aid,
                        amount: this.money,
                        alertmin: this.alertmin,
                        alertmax: this.alertmax,
                        typename: this.typename,
                        bank_code:
                            this.actionname == 'dsfchongzhi'
                                ? this.selectedBank_code
                                : this.bank_code
                    },
                    this.onOff.url
                ).then(res => {
                    window.open(res.data, '_black')
                })
            } else {
                this.$Message.error('输入的金额不符合规则')
            }
        },
        chosenActive(item) {
            unionpayaddcredit('', item.url).then(res => {
                this.alertmin = res.data.loadmin
                this.alertmax = res.data.loadmax
                this.aid = res.data.aid
                this.alertmin = res.data.loadmin
                this.alertmax = res.data.loadmax
                this.typename = res.data.typename
                this.bank_code = res.data.banklist[0].bank_code
                this.actionname = res.data.actionname
                this.onOff = item
                if (this.actionname == 'dsfchongzhi') {
                    this.banklist = res.data.banklist
                    this.selectedBank_code = res.data.banklist[0].bank_code
                }
            })
        },
        toDx(n) {
            //阿拉伯数字转换函数
            switch (n) {
                case '0':
                    return '零'
                case '1':
                    return '壹'
                case '2':
                    return '贰'
                case '3':
                    return '叁'
                case '4':
                    return '肆'
                case '5':
                    return '伍'
                case '6':
                    return '陆'
                case '7':
                    return '柒'
                case '8':
                    return '捌'
                case '9':
                    return '玖'
            }
        },
        // 转换算法主函数
        NumberToChinese(m) {
            if (m && m != 0) {
                m = this.money = this.$refs.inputNumber.currentValue = Number(
                    `${m}`.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
                )
            }
            m *= 100
            m = parseFloat(m.toPrecision(12))
            m += ''
            var length = m.length

            var result = ''
            for (var i = 0; i < length; i++) {
                if (i == 2) {
                    result = '元' + result
                } else if (i == 6) {
                    result = '万' + result
                }
                if (m.charAt(length - i - 1) == 0) {
                    if (i != 0 && i != 1) {
                        if (
                            result.charAt(0) != '零' &&
                            result.charAt(0) != '元' &&
                            result.charAt(0) != '万'
                        ) {
                            result = '零' + result
                        }
                    }
                    continue
                }
                result =
                    this.toDx(m.charAt(length - i - 1)) +
                    this.unit[this.unit.length - i - 1] +
                    result
            }
            result += result.charAt(result.length - 1) == '元' ? '整' : ''
            this.text = result
        },
        handleClass(value) {
            let index = value.indexOf('/') + 1
            return value.substring(index)
        }
    },
    mounted() {
        getThreeDeposit().then(res => {
            this.typeList = res.data
            if(this.typeList==null){
                this.$Message.error('充值渠道维护中，请联系客服')
            }
        })
    },
    components: {
        Button,
        InputNumber,
        Divider
        // Select,
        // Option
    }
}
</script>

<style lang="stylus" scoped>
.recharge
    .title
        width 234px
        line-height 30px
        background #e5f6ed
        color #00a854
        text-align center
        margin-bottom 20px
    .description
        span:nth-child(1)
            font-size 20px
            margin-right 30px
        span:nth-child(2)
            font-size 18px
            margin-right 30px
        span:nth-child(3)
            font-size 14px
            margin-right 30px
            color #ff0000
            &::before
                content '!'
                width 20px
                height 20px
                text-align center
                border-radius 30px
                background #ff0000
                color #fff
                display inline-block
                font-size 20px
                line-height 20px
    ul.backList
        display flex
        margin 20px 0
        flex-wrap wrap
        width 100%
        li
            height 40px
            border 1px solid #dcdcdc
            text-align left
            line-height 40px
            margin 0 4px
            border-radius 6px
            padding-right 10px
            margin-bottom 10px
            &.active
                border-color blue
                overflow hidden
                position relative
                i.active
                    background #2d8cf0
                    border-color #2d8cf0
                    position absolute
                    width 100px
                    height 20px
                    right -50px
                    bottom 0
                    transform rotate(-45deg)
                &::after
                    content ''
                    position absolute
                    border 1.5px solid #fff
                    width 6px
                    height 8px
                    right 2px
                    bottom 5px
                    border-top 0
                    border-left 0
                    transform rotate(45deg) scale(1)
    .alipayaddcredit
        display inline-block
        width 45px
        height 40px
        background url('../../assets/images/zhifubao.png') no-repeat center
        vertical-align top
    .unionpayaddcredit
        display inline-block
        width 45px
        height 40px
        background url('../../assets/images/yinlianzhifu.png') no-repeat center
        vertical-align top
    .yspayaddcredit
        display inline-block
        width 74px
        height 40px
        background url('../../assets/images/yunshanfu.png') no-repeat center
        vertical-align top
    .wechataddcredit
        display inline-block
        width 45px
        height 40px
        background url('../../assets/images/weixinzhifu.png') no-repeat center
        vertical-align top
    .quickpayaddcredit
        display inline-block
        width 45px
        height 40px
        background url('../../assets/images/kuaijiezhifu.png') no-repeat center
        vertical-align top
    .dsfchongzhi
        display inline-block
        width 45px
        height 40px
        background url('../../assets/images/wangyinzhifu.png') no-repeat center
        vertical-align top
    .money
        span:nth-child(1)
            font-size 20px
            margin-right 20px
            &.selectBank
                margin-right 48px
        input
            font-size 20px
    .wangyin
        margin-bottom 30px
        >>>.ivu-select-selection, >>>.ivu-select-selected-value
            height 40px
            line-height 40px
        span:nth-child(1)
            font-size 20px
            margin-right 20px
            &.selectBank
                margin-right 48px
        input
            font-size 20px
    .moneyDescription
        margin-top 20px
        font-size 20px
        span:nth-child(1)
            margin-right 20px
    .submit
        background #e93934
        height 40px
        border none
        font-size 20px
        padding 0
        width 200px
        display block
        margin auto
</style>
