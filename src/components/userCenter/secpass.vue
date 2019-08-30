<template>
    <div class="secpass">
        <Input
            v-model="value"
            placeholder="请输入资金密码"
            clearable
            style="width: 200px;margin-right:10px"
        />
        <Button type="primary" @click="handleSubmint">确定</Button>
    </div>
</template>

<script>
import { Input, Button } from 'iview'
import { checksecpass, RSAencrypt, setsecpass } from '@/api/index'
import md5 from 'js-md5'
export default {
    name: 'secpass',
    props: {
        params: {
            default: 1
        }
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        handleSubmint() {
            if (this.params == 1) {
                this.checkpass()
            } else {
                this.setSecpass()
            }
        },
        checkpass() {
            checksecpass({ secpass: RSAencrypt(md5(this.value)) }).then(res => {
                this.$parent.secpassShow = false
            })
        },
        setSecpass() {
            setsecpass({
                secpass: this.value
            }).then(res => {
                this.$Message.success('提款密码设置成功')
                this.$parent.$parent.alert = false
            })
        }
    },
    mounted() {},
    components: {
        Input,
        Button
    }
}
</script>

<style lang="stylus" scoped>
.secpass
    background rgba(0, 0, 0, 0.4)
    position absolute
    z-index 1000
    width 100%
    height calc(100% - 50px)
    left 0
    top 50px
    display flex
    align-items center
    justify-content center
</style>
