<template>
    <div v-if="alert" class="notice">
        <Modal v-model="alert" width="1040" style="height:500px">
            <p slot="header" class="alertHeader">
                <span>系统公告</span>
            </p>
            <ul class="main">
                <li
                    v-for="(item,value) of list"
                    :class="{selected:activeIndex==value}"
                    :key="value"
                    class="cell"
                    @click="handleTab(value,item)"
                >
                    <div class="left">{{item.subject}}</div>
                    <div class="right">{{item.sendday}}</div>
                </li>
            </ul>
            <div class="content">
                <template v-if="currentItem">
                    <p class="header">{{currentItem.subject}}</p>
                    <div class="text">{{currentItem.content}}</div>
                </template>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
import { getnotice } from '@/api/index'
import { Modal } from 'iview'
export default {
    name: 'notice',
    data() {
        return {
            list: [],
            activeIndex: '0',
            currentItem: null,
            alert: false
        }
    },
    methods: {
        handleTab(value, item) {
            this.activeIndex = value
            this.currentItem = item
        },
        handleAlert(index) {
            getnotice().then(res => {
                this.list = res.data.results
                this.activeIndex = index
                this.currentItem = this.list[index]
                this.alert = true
            })
        }
    },
    components: {
        Modal
    }
}
</script>

<style lang="stylus" scoped>
>>>.ivu-modal-content
    border-radius 0
>>>.ivu-modal-header
    background #000
    max-width 370px
    p
        color #fff
        text-align center
>>>.ivu-modal-body
    display flex
    padding 0
    .main
        width 370px
        height 500px
        overflow-y scroll
>>>.ivu-cell-title
    width 180px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
>>>.ivu-modal-footer
    border-top none
    padding 0
.cell
    display flex
    justify-content space-between
    padding 10px 10px 10px 0px
    &:hover, &.selected
        background #ffeeee
        color #eb445b
    .left
        max-width 180px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
.notice
    width 100%
    height 600px
    padding 10px 16px
    overflow-y auto
    overscroll-behavior-y contain
    p
        word-wrap break-word
.content
    width 670px
    position absolute
    top 0
    left 369px
    background #fff
    height 100%
    padding 0px 20px 10px 20px
    border-left 1px solid #eee
    .header
        text-align center
        color #ea2f4c
        font-size 18px
        border-bottom 2px solid #eee
        margin-bottom 30px
        padding 10px 0
    .text
        text-indent 30px
</style>
