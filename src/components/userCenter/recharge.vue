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
                <i></i>
                <span>{{item.title}}</span>
                <i class="active"></i>
            </li>
        </ul>
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
import { Button, InputNumber, Divider } from 'iview'
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
            )
        }
    },
    methods: {
        handleRecharge() {
            if (this.money) {
                unionpayaddcredit(
                    {
                        flag: 'load',
                        aid: this.aid,
                        amount: this.money,
                        alertmin: this.alertmin,
                        alertmax: this.alertmax,
                        typename: this.typename,
                        bank_code: this.bank_code
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
                this.onOff = item
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
        }
    },
    mounted() {
        getThreeDeposit().then(res => {
            this.typeList = res.data
        })
    },
    components: {
        Button,
        InputNumber,
        Divider
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
    ul
        display flex
        margin 20px 0
        li
            width 154px
            height 40px
            border 1px solid #dcdcdc
            text-align left
            line-height 40px
            margin 0 16px
            border-radius 6px
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
    li:nth-child(1)
        i:nth-child(1)
            display inline-block
            width 45px
            height 40px
            background url('../../assets/images/zhifubao.png') no-repeat center
            vertical-align top
    li:nth-child(2)
        i:nth-child(1)
            display inline-block
            width 45px
            height 40px
            background url('../../assets/images/yinlianzhifu.png') no-repeat center
            vertical-align top
    li:nth-child(3)
        i:nth-child(1)
            display inline-block
            width 74px
            height 40px
            background url('../../assets/images/yunshanfu.png') no-repeat center
            vertical-align top
    li:nth-child(4)
        i:nth-child(1)
            display inline-block
            width 45px
            height 40px
            background url('../../assets/images/weixinzhifu.png') no-repeat center
            vertical-align top
    .money
        span:nth-child(1)
            font-size 20px
            margin-right 20px
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
