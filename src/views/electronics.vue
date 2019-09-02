<template>
  <div>
      <div class="banner">
          <img src="../assets/images/thirdGames/dianzi/banner.png" heigth="100%" width="100%">
      </div>
      <div class="content">
          <ul class="nav">
              <li v-for="(item, index) in typeList" :key="index">
                  <span>{{item.ref_type.split('_')[0]}}</span>
                  <span>{{item.ref_name}}</span>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import {getgamelist} from '@/api/index'
export default {
  data () {
    return {
        typeList:[]
    }
  },
  methods: {
      
  },
  created(){
    //   getThirdMenu({
    //         device: 'PC'
    //     }).then(res => {
    //         this.typeList =res.data.filter((item)=>{
    //             return item.type_name=='棋牌'
    //         })
    //         console.log(this.typeList[0]);
    //     })
      getgamelist({
            device: 'PC',
            main_type:'board'
        }).then(res => {
            this.typeList = res.data
            console.log(this.typeList);
        })
  }
}
</script>

<style lang="stylus" scoped>
.banner
    margin-bottom 40px
.content
    border 1px solid #cda546
    background-color #34312e
    min-height 400px
    max-width 1200px
    box-sizing border-box
    margin 0 auto
    .nav
        display flex
        flex-wrap wrap
        box-shadow:0 5px 10px -5px #000;
        li
            width 25% 
            height 60px
            text-align center
            color #fff
            line-height 60px
            background-image url('../assets/images/thirdGames/nav_bg.png')
            background-position center
            background-repeat no-repeat
            background-size cover
            border-top 1px solid #545556
            border-right 1px solid #545556
            border-left 1px solid  #000
            border-bottom 1px solid #000
            &:nth-child(5),&:nth-child(6),&:nth-child(7),&:nth-child(8)
                border-bottom none
</style>
