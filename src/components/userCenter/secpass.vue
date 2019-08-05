<template>
    <div class="secpass">
        <Input
            v-model="value"
            placeholder="请输入资金密码"
            clearable
            style="width: 200px;margin-right:10px"
        />
        <Button type="primary" @click="setSecpass">确定</Button>
    </div>
</template>

<script>
import { Input, Button } from 'iview'
import { checksecpass, RSAencrypt, setsecpass } from '@/api/index'
import md5 from 'js-md5'
export default {
    name: 'secpass',
    props: ['show'],
    data() {
        return {
            value: ''
        }
    },
    methods: {
        checkpass() {
            checksecpass({ secpass: RSAencrypt(md5(this.value)) })
        },
        setSecpass() {
            setsecpass({
                secpass: this.value
            }).then(res => {
                this.$Message.success('提款密码设置成功')
            })
        }
    },
    components: {
        Input,
        Button
    }
}
</script>

<style lang="stylus" scoped></style>
