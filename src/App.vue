<template>
    <div id="app">
        <Nav v-if="this.$route.name!='speedTest'&&this.$route.name!='history'" />
        <router-view />
        <Footer v-if="this.$route.name!='history'" />
        <BackTop>
            <div class="backtop">返回顶端</div>
        </BackTop>
    </div>
</template>
<script>
import Nav from '@/components/nav.vue'
import Footer from '@/components/footer.vue'
import { BackTop } from 'iview'
export default {
    name: 'app',
    components: {
        Nav,
        Footer,
        BackTop
    }
}
</script>
<style lang="stylus">
@import 'styles/rest.styl'

#app
    background url('./assets/images/homeBg.jpg')
    min-width 1200px
    .backtop
        background #ff0000
        color #fff
        padding 10px
        border-radius 10px
</style>
