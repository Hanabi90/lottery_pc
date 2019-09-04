<template>
    <div id="app" ref="app">
        <Nav v-if="this.$route.name!='speedTest'&&this.$route.name!='history'" />
        <router-view />
        <Footer v-if="this.$route.name!='history'" />
    </div>
</template>
<script>
import Nav from '@/components/nav.vue'
import Footer from '@/components/footer.vue'
export default {
    name: 'app',
    data() {
        return {
            alert: false
        }
    },
    methods: {
        IsPC() {
            var userAgentInfo = navigator.userAgent
            var Agents = new Array(
                'Android',
                'iPhone',
                'SymbianOS',
                'Windows Phone',
                'iPad',
                'iPod'
            )
            var flag = true
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false
                    break
                }
            }
            return flag
        }
    },
    mounted() {
        let url = `https://m${window.location.href.substring(
            window.location.href.indexOf('//www') + 5
        )}`
        if (!this.IsPC()) {
            window.open(url, '_self')
        }
    },
    components: {
        Nav,
        Footer
    }
}
</script>
<style lang="stylus">
@import 'styles/rest.styl'

#app
    background url('./assets/images/homeBg.jpg')
    min-width 1200px
#lim_mini
    display none !important
</style>
