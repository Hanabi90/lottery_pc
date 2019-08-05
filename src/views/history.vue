<template>
    <div class="history">
        <iframe
            class="box"
            src="https://www.obolbetonline.com/history/?controller=game&action=bonuscode&crumid=50&issuecount=30"
            frameborder="0"
        ></iframe>
    </div>
</template>

<script>
export default {
    name: 'history'
}
</script>

<style lang="stylus" scoped>
.box
    height 100vh
    width 100vw
</style>
