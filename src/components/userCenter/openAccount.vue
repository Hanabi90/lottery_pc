<template>
    <div>
        <Form
            ref="addUserList"
            :model="addUserList"
            :rules="ruleAddUserList"
            :label-width="80"
            class="user"
        >
            <FormItem label="用户名" prop="userName">
                <Input
                    type="text"
                    ref="userInput"
                    v-model="addUserList.userName"
                    placeholder="请输入用户名"
                    :readonly="readonly"
                    @on-focus="removeInputReadonly"
                ></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input type="password" v-model="addUserList.password" placeholder="请输入密码"></Input>
            </FormItem>
            <!-- <FormItem label="奖金组">
                <Slider
                    :min="Number(bonusGroup.minodds)"
                    :max="Number(bonusGroup.maxodds)"
                    v-model="addUserList.bonus"
                    :step="2"
                    show-input
                    :active-change="false"
                    input-size="small"
                ></Slider>
            </FormItem> -->
            <FormItem label="用户类型">
                <RadioGroup v-model="addUserList.userType">
                    <Radio label="1">代理</Radio>
                    <Radio label="0">会员</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit">
                    <span v-if="!loading">添加用户</span>
                    <span v-else>创建用户中...</span>
                </Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
// import { Form, FormItem, Input, Button, Slider, RadioGroup, Radio } from 'iview'
import { Form, FormItem, Input, Button, RadioGroup, Radio } from 'iview'
import { addnewuser, RSAencrypt, getreglink } from '@/api/index'
export default {
    name: 'openAccountLine',
    data() {
        return {
            loading: false,

            readonly: true, //解决浏览器默认密码输入
            bonusGroup: {
                curodds: 0,
                maxodds: 2000,
                minodds: 1300,
                tuiguan: [],
                userid: 0
            }, //个人信息、奖金组，用户id
            addUserList: {
                bonus: 1500,
                userName: '',
                password: '',
                userType: '1' //1-代理| 0-会员
            },
            ruleAddUserList: {
                userName: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        removeInputReadonly() {
            this.readonly = false
        },
        //提交
        handleSubmit() {
            this.$refs.addUserList.validate(valid => {
                if (valid) {
                    this.loading = true
                    let dataJson = {
                        onekeyodds: this.bonusGroup.maxodds, //奖金
                        usertype: this.addUserList.userType, //用户类型
                        username: this.addUserList.userName, //用户名
                        userpass: this.addUserList.password //密码
                    }
                    addnewuser({
                        ...dataJson,
                        pdata: RSAencrypt(JSON.stringify(dataJson))
                    })
                        .then(res => {
                            this.loading = false
                            this.$Message.success(res.msg)
                            this.$refs.addUserList.resetFields()
                        })
                        .catch(error => {
                            this.loading = false
                            this.$Message.error(error.msg)
                        })
                } else {
                    this.loading = false
                    this.$Message.error('信息输入不完整!')
                }
            })
        }
    },
    mounted() {
        getreglink().then(res => {
            this.bonusGroup.minodds = res.data.minodds
            this.bonusGroup.maxodds = res.data.maxodds
        })
    },
    components: {
        Form,
        FormItem,
        Input,
        Button,
        // Slider,
        RadioGroup,
        Radio
    }
}
</script>
<style lang="stylus" scoped>
>>>.ivu-form-item-label
    color #515a6e !important
</style>
