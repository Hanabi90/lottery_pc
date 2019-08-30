<template>
    <div class="transfer">
        <div class="left">
            <ul class="list">
                <li>
                    <Button type="primary">切换为自动转账模式</Button>
                </li>
                <li>
                    <span>转账从</span>
                    <Select v-model="type1" style="width:200px">
                        <Option
                            v-for="(item,index) in contentList"
                            :value="item.wallet_code"
                            :key="index"
                        >{{ item.wallet_name }}</Option>
                    </Select>
                </li>
                <li>
                    <span>转账至</span>
                    <Select v-model="type2" style="width:200px">
                        <Option
                            v-for="(item,index) in contentList"
                            :value="item.wallet_code"
                            :key="index"
                        >{{ item.wallet_name }}</Option>
                    </Select>
                </li>
                <li>
                    <span>转出金额</span>
                    <Input v-model="money" placeholder="金额" style="width: 200px" />
                </li>

                <li>
                    <Button @click="handleSubmit" type="error" style="width:290px">确认并提交</Button>
                </li>
            </ul>
        </div>
        <div class="right">
            <ul class="title">
                <!-- <li class="active">全部</li>
                <li>
                    <img src="../../assets/images/football.png" alt /> 体育
                </li>
                <li>
                    <img src="../../assets/images/lottery.png" alt /> 彩票
                </li>
                <li>
                    <img src="../../assets/images/qipai.png" alt />棋牌
                </li>
                <li>
                    <img src="../../assets/images/laohuji_icon.png" alt />老虎机
                </li>-->
                <li @click="chosenType(' ')" :class="{active:!active}">全部</li>
                <li
                    @click="chosenType(item.type_code)"
                    v-for="(item,index) of typeList"
                    :key="index"
                >
                    <img src alt />
                    {{item.type_name}}
                </li>
            </ul>
            <ul class="list">
                <li v-for="(item,index) of contentList" :key="index">
                    <p>{{item.wallet_name}}</p>
                    <p>
                        <span>{{item.wallet_balance}}</span>

                        <Icon
                            @click="handleRefresh(item.wallet_code,index)"
                            type="ios-refresh"
                            size="30"
                        />
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Select, Option, Input, Button, Icon } from 'iview'
import {
    getuserwallet,
    getThirdMenu,
    updatewallet,
    deposit,
    withdraw
} from '@/api/index'
export default {
    name: 'transfer',
    data() {
        return {
            type1: '',
            type2: '',
            money: '',
            typeList: [],
            contentList: [],
            active: ''
        }
    },
    methods: {
        chosenType(type_code) {
            getuserwallet({
                typecode: type_code
            }).then(res => {
                this.contentList = res.data
            })
        },
        handleRefresh(walletcode, index) {
            updatewallet({
                walletcode
            }).then(res => {
                this.$set(
                    this.contentList[index],
                    'wallet_balance',
                    res.data.wallet_balance
                )
            })
        },
        handleSubmit() {
            if (this.type1 == '_main' && this.type2 != '_main') {
                //转入
                deposit({
                    amount: this.money,
                    walletcode: this.type2
                }).then(res => {
                    this.$Message.success('转账成功')
                    for (
                        let index = 0;
                        index < this.contentList.length;
                        index++
                    ) {
                        const element = this.contentList[index]
                        if (element.wallet_code == '_main') {
                            this.$set(
                                this.contentList[index],
                                'wallet_balance',
                                res.data.main_wallet_balance
                            )
                        }
                        if (element.wallet_code == res.data.wallet_code) {
                            this.$set(
                                this.contentList[index],
                                'wallet_balance',
                                res.data.wallet_balance
                            )
                        }
                    }
                })
            } else if (this.type1 != '_main' && this.type2 == '_main') {
                //转出
                withdraw({
                    amount: this.money,
                    walletcode: this.type1
                }).then(res => {
                    this.$Message.success('转账成功')
                    for (
                        let index = 0;
                        index < this.contentList.length;
                        index++
                    ) {
                        const element = this.contentList[index]
                        if (element.wallet_code == '_main') {
                            this.$set(
                                this.contentList[index],
                                'wallet_balance',
                                res.data.main_wallet_balance
                            )
                        }
                        if (element.wallet_code == res.data.wallet_code) {
                            this.$set(
                                this.contentList[index],
                                'wallet_balance',
                                res.data.wallet_balance
                            )
                        }
                    }
                })
            } else {
                this.$Message.error('第三方不能互相转账')
            }
        }
    },
    mounted() {
        getuserwallet().then(res => {
            this.contentList = res.data
        })
        getThirdMenu({
            device: 'PC'
        }).then(res => {
            this.typeList = res.data
        })
    },
    components: {
        Select,
        Input,
        Option,
        Button,
        Icon
    }
}
</script>

<style lang="stylus" scoped>
.transfer
    display flex
    .left
        width 300px
        .list
            li
                margin-bottom 20px
                span
                    display inline-block
                    width 80px
                    padding-right 20px
                    text-align right
    .right
        margin-left 20px
        .title
            display flex
            margin-bottom 10px
            li
                width 90px
                line-height 40px
                text-align center
                background #333333
                color #fff
                margin-right 10px
                border-radius 6px
                &.active
                    background #999
                img
                    vertical-align middle
                    margin-right 4px
                &:last-child
                    img
                        margin-top -6px
        .list
            display flex
            flex-wrap wrap
            li
                border 1px solid #ddd
                width 138px
                line-height 38px
                margin-bottom 20px
                &:nth-child(3n+2)
                    margin 0 20px 20px
                p:nth-child(1)
                    background #f5f5f5
                    border-bottom 1px solid #ddd
                    text-align center
                p:nth-child(2)
                    text-align center
                    i
                        cursor pointer
</style>
