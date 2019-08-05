<template>
    <div class="openLine">
        <Form ref="addUserLine" :model="addUserLine" :label-width="80">
            <FormItem label="奖金组">
                <Slider
                    :min="Number(bonusGroup.minodds)"
                    :max="Number(bonusGroup.maxodds)"
                    v-model="addUserLine.keepodds"
                    :step="2"
                    show-input
                    input-size="small"
                ></Slider>
            </FormItem>
            <FormItem label="用户类型">
                <RadioGroup v-model="addUserLine.usertype">
                    <Radio label="1">代理</Radio>
                    <Radio label="0">会员</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('addUserLine')">生成链接</Button>
            </FormItem>
        </Form>
        <Table
            stripe
            v-if="userLineData.length"
            height="280"
            width="1000px"
            border
            ref="selection"
            :columns="columns4"
            :data="userLineData"
        ></Table>
    </div>
</template>

<script>
import { Form, FormItem, Button, Slider, RadioGroup, Radio, Table } from 'iview'
import {
    getreglink,
    addnewuser,
    RSAencrypt,
    setreglink,
    delreglink
} from '@/api/index'
import QrcodeVue from 'qrcode.vue'
export default {
    name: 'openAccountLine',
    data() {
        return {
            bonusGroup: {
                curodds: 0,
                maxodds: 2000,
                minodds: 1300,
                tuiguan: [],
                userid: 0
            }, //个人信息、奖金组，用户id
            addUserLine: {
                keepodds: 1500,
                usertype: '1' //1-代理| 0-会员
            },
            userLineData: [
                //推广链接存放
            ],
            columns4: [
                {
                    title: '开户链接类型',
                    width: '110',
                    key: 'ztype'
                },
                {
                    title: '开户链接地址',
                    key: 'url'
                },
                {
                    title: '推广代码',
                    key: 'code'
                },
                {
                    title: '奖金组',
                    width: '70',
                    key: 'odds'
                },
                {
                    title: '二维码',
                    width: '130',
                    key: 'action',
                    render: (h, params) => {
                        let create = this.$createElement,
                            dom = create('QrcodeVue', {
                                ref: `img${params.index}`,
                                props: {
                                    value: params.row.url
                                }
                            })

                        return dom
                    }
                },
                {
                    title: '操作',
                    width: '250',
                    key: 'action',
                    render: (h, params) => {
                        let id = params.row.id,
                            index = params.index
                        return h('div', [
                            h(
                                Button,
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },

                                    on: {
                                        click: () => {
                                            this.doCopy(params.row.url)
                                        }
                                    }
                                },
                                '复制链接'
                            ),
                            h(
                                Button,
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        margin: '0 10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.downloadFile(
                                                params.index,
                                                params.row.odds
                                            )
                                        }
                                    }
                                },
                                '下载图片'
                            ),
                            h(
                                Button,
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleDelreglink(id, index)
                                        }
                                    }
                                },
                                '删除'
                            )
                        ])
                    }
                }
            ]
        }
    },
    methods: {
        //复制到剪贴蒙版
        doCopy(value) {
            this.$copyText(value).then(e => {
                this.$Message.success('已复制到剪贴蒙版')
            })
        },
        //下载图片
        downloadFile(index, odds) {
            let qrcodeUrl = this.$refs.img0.$refs['qrcode-vue'].toDataURL(),
                aLink = document.createElement('a')
            aLink.download = `推广二维码:奖金${odds}`
            aLink.href = qrcodeUrl
            aLink.click()
        },
        //删除推广链接
        handleDelreglink(id, index) {
            delreglink({ id }).then(res => {
                this.userLineData.splice(index, 1)
                this.$Message.success(res.msg)
            })
        },
        //提交
        handleSubmit(name) {
            setreglink(this.addUserLine).then(res => {
                if (res.data.length) {
                    this.userLineData = []
                    res.data.forEach(item => {
                        let ztype = item.ztype == 1 ? '代理' : '会员',
                            url = item.url + item.urlparam,
                            odds = item.odds,
                            id = item.id,
                            code = item.code
                        this.userLineData.push({
                            ztype,
                            url,
                            odds,
                            id,
                            code
                        })
                    })
                }
            })
        }
    },
    mounted() {
        getreglink().then(res => {
            for (const key in res.data) {
                this.$set(this.bonusGroup, key, res.data[key])
            }
            if (res.data.tuiguan.length) {
                this.userLineData = []
                res.data.tuiguan.forEach(item => {
                    let ztype = item.ztype == 1 ? '代理' : '会员',
                        url = item.url + item.urlparam,
                        odds = item.odds,
                        id = item.id,
                        code = item.code
                    this.userLineData.push({ ztype, url, odds, id, code })
                })
            }
        })
    },
    components: {
        Form,
        FormItem,
        Button,
        Slider,
        RadioGroup,
        Radio,
        Table,
        // eslint-disable-next-line
        QrcodeVue
    }
}
</script>
<style lang="stylus" scoped>
.openLine
    width 1000px
    overflow hidden
    >>>.ivu-table-cell
        span
            user-select all
    >>>.ivu-form-item-label
        color #515a6e !important
</style>
