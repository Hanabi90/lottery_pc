<template>
    <div class="home">
        <!-- <Oswiper/> -->
        <newSwiper :size="400" />
        <Marquee/>
        <List/>
    </div>
</template>

<script>
import Marquee from '@/components/home/marquee.vue'
import Oswiper from '@/components/home/swiper'
import newSwiper from '@/components/home/newSwiper'
import List from '../components/home/list'
export default {
    name: 'home',
    components: {
        List,
        Oswiper,
        Marquee,
        newSwiper
    }
}
</script>
<style lang="stylus" scoped></style>
