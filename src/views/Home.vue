<template>
    <div class="home">
        <Oswiper />
        <List />
    </div>
</template>

<script>
import Oswiper from '@/components/home/homeSwiper'
import List from '../components/home/list'
export default {
    name: 'home',
    components: {
        List,
        Oswiper
    }
}
</script>
<style lang="stylus" scoped></style>
