<template>
    <div>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
            <FormItem label="旧密码" prop="oldPasswd">
                <Input type="password" v-model="formCustom.oldPasswd" string></Input>
            </FormItem>
            <FormItem label="新密码" prop="passwd">
                <Input type="password" v-model="formCustom.passwd" string></Input>
            </FormItem>
            <FormItem label="重复新密码" prop="passwdCheck">
                <Input type="password" v-model="formCustom.passwdCheck" string></Input>
            </FormItem>
            <FormItem>
                <Button shape="circle" type="primary" @click="handleSubmit('formCustom')">修改</Button>
                <Button
                    shape="circle"
                    @click="handleReset('formCustom')"
                    style="margin-left: 8px"
                >清空</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import { Form, FormItem, Input, Button } from 'iview'
import md5 from 'js-md5'
import {
    RSAencrypt,
    changeuserloginpass,
    changeusersecpass
} from '@/api/index.js'
export default {
    name: 'changePassword',
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.formCustom.passwdCheck !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formCustom.validateField('passwdCheck')
                }
                callback()
            }
        }
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.formCustom.passwd) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback()
            }
        }
        const validateOldPasswd = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入旧密码'))
            } else {
                callback()
            }
        }

        return {
            formCustom: {
                oldPasswd: '',
                passwd: '',
                passwdCheck: ''
            },
            ruleCustom: {
                oldPasswd: [{ validator: validateOldPasswd, trigger: 'blur' }],
                passwd: [{ validator: validatePass, trigger: 'blur' }],
                passwdCheck: [{ validator: validatePassCheck, trigger: 'blur' }]
            },
            navIndex: 1
        }
    },
    created() {
        this.navIndex = this.params
    },
    props: ['params'],
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    let oJson = {
                        oldpass: md5(this.formCustom.oldPasswd),
                        newpass: md5(this.formCustom.passwd),
                        confirm_newpass: md5(this.formCustom.passwdCheck)
                    }
                    if (this.navIndex == 1) {
                        changeuserloginpass({
                            json: RSAencrypt(JSON.stringify(oJson))
                        }).then(res => {
                            this.$Message.success(res.msg)
                        })
                    } else {
                        changeusersecpass({
                            json: RSAencrypt(JSON.stringify(oJson))
                        }).then(res => {
                            this.$Message.success(res.msg)
                        })
                    }
                } else {
                    this.$Message.error('信息输入不完整!')
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields()
        },
        changeContent(value) {
            ;(this.formCustom = {
                oldPasswd: '',
                passwd: '',
                passwdCheck: ''
            }),
                (this.navIndex = value)
        }
    },
    components: {
        Form,
        FormItem,
        Input,
        Button
    }
}
</script>

<style lang="stylus" scoped>
>>>.ivu-btn-primary
    background #f85654
    border-color #f85654
    outline none
    color #fff
>>>.ivu-btn
    width 108px
</style>
