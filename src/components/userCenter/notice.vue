<template>
    <div class="notice">
        <!-- <Collapse v-model="activeIndex" accordion>
            <Panel
                :style="{'fontSize':'12px',}"
                v-for="(item,value) of list"
                :key="value"
                :name="`${value}`"
            >
                {{item.subject}}
                <p slot="content" v-html="item.content"></p>
            </Panel>
        </Collapse> -->
        <!-- <CellGroup @on-click="handleTab">
            <Cell ref="noticeList" :selected="value==activeIndex" v-for="(item,value) of list" :title="item.subject" :key="value" :extra="item.sendday" :name=value />
        </CellGroup> -->
        <ul class="main">
            <li v-for="(item,value) of list" :class="{selected:activeIndex==value}" :key="value" class="cell" @click="handleTab(value,item)">
                <div class="left">{{item.subject}}</div>
                <div class="right">{{item.sendday}}</div>
            </li>
        </ul>
        <div class="content">
            <p class="header">{{currentItem.subject}}</p>
            <div class="text">
                {{currentItem.content}}
            </div>
        </div>
    </div>
</template>

<script>
import { getnotice } from '@/api/index'
import { Collapse, Panel,CellGroup,Cell } from 'iview'
export default {
    name: 'notice',
    data() {
        return {
             list: [],
            activeIndex: '0',
            currentItem:null
        }
    },
    methods:{
        handleTab(value,item){
            this.activeIndex = value
            this.currentItem = item
        }
    },
    mounted() {
        getnotice().then(res => {
            this.list = res.data.results
            this.currentItem = this.list[0]
        })
    },
    components: {
        Collapse,
        Panel,
        CellGroup,
        Cell
    }
}
</script>

<style lang="stylus" scoped>
>>>.ivu-modal
    width: 370px;
    margin: 0 440px;
    position: relative;
>>>.ivu-cell-title
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
.cell
    display flex
    justify-content space-between
    padding 10px 2px
    &:hover,&.selected
        background #ffeeee
        color #eb445b
    .left
        max-width 180px
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        left 370px
        background #fff
        height 100%
        padding 30px
        .header
            padding 0px 0 20px 0px
            text-align center
            color #ea2f4c
            font-size 18px
            border-bottom 2px solid #eee
            margin-bottom 30px
        .text
            text-indent 30px
</style>
