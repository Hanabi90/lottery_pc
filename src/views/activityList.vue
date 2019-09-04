<template>
    <div class="box">
        <div ref="clock"></div>
        <div class="activityList">
            <Menu
                class="user"
                ref="user"
                mode="vertical"
                :active-name="activeName"
                @on-select="handleInfo"
            >
                <MenuItem
                    v-for="(item,index) of activityList"
                    :key="index"
                    :name="index"
                >{{item.title}}</MenuItem>
            </Menu>
            <div class="info">
                <img width="100%" :src="activityInfo.mb" alt />
                <div class="infoContent" v-html="activityInfo.content"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { getactivitylist, getactivityinfo } from '@/api/index'
import { Menu, MenuItem } from 'iview'
export default {
    name: 'activityList',
    props: ['navindex'],
    data() {
        return {
            activityList: [], //活动列表
            activityInfo: '', //活动详情
            onOff: false,
            activeName: 0
        }
    },
    mounted() {
        getactivitylist().then(res => {
            this.activityList = res.data.activitylist
            this.$nextTick(() => {
                this.$refs.user.updateOpened()
                this.$refs.user.updateActiveName()
            })
            if (this.$route.query.index) {
                this.handleInfo(this.$route.query.index)
                this.activeName = Number(this.$route.query.index)
            } else {
                this.handleInfo(0)
            }
        })
    },
    methods: {
        handleInfo(name) {
            getactivityinfo({ id: this.activityList[name].id }).then(res => {
                this.activityInfo = res.data.activityinfo
            })
        },
        back() {
            this.onOff = !this.onOff
        }
    },
    components: {
        Menu,
        MenuItem
    }
}
</script>

<style lang="stylus" scoped>
.box
    width 1200px
    margin auto
    overflow hidden
    margin-bottom 40px
    .activityList
        border-radius 3px
        overflow hidden
        position relative
        z-index 0
        display flex
        padding-top 20px
        .user
            flex 0.2
        >>>.ivu-menu-light
            background none
            &::after
                width 0
                height 0
            .ivu-menu-item
                border 1px solid #333333
                border-radius 5px
                margin-bottom 10px
                background #202020
                color #fff
        >>>.ivu-menu-item-active:not(.ivu-menu-submenu)
            background #ea2f4c
            color #ffefc1
        .info
            flex 0.8
            line-height 30px
            overflow hidden
            font-size 14px
            padding 20px
            margin-left 10px
            background #e0cb9f
            .infoContent>>>table
                width 100%
</style>
