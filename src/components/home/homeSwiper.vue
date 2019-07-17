<template>
    <div id="certify">
        <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide>
                <img src="../../assets/images/demo.jpg" />
            </swiper-slide>
            <swiper-slide>
                <img src="../../assets/images/demo_one.jpg" />
            </swiper-slide>
            <swiper-slide>
                <img src="../../assets/images/demo_two.jpg" />
            </swiper-slide>

            <!-- Optional controls -->
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
            <div class="swiper-scrollbar" slot="scrollbar"></div>
        </swiper>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    name: 'homeSwiper',
    data() {
        return {
            swiperOption: {
                watchSlidesProgress: true,
                slidesPerView: 'auto',
                centeredSlides: true,
                loop: true,
                autoplay: true,
                loopedSlides: 5,
                autoplay: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on: {
                    progress: function(progress) {
                        console.log(this.slides.eq(1))
                        for (let i = 0; i < this.slides.length; i++) {
                            let slide = this.slides.eq(i)
                            let slideProgress = this.slides[i].progress
                            let modify = 1
                            if (Math.abs(slideProgress) > 1) {
                                modify = (Math.abs(slideProgress) - 1) * 0.2 + 1
                            }
                            let translate = slideProgress * modify * 980 + 'px'
                            let scale = 1 - Math.abs(slideProgress) / 7
                            let zIndex =
                                999 - Math.abs(Math.round(10 * slideProgress))
                            slide.transform(
                                'translateX(' +
                                    translate +
                                    ') scale(' +
                                    scale +
                                    ')'
                            )
                            slide.css('zIndex', zIndex)
                            slide.css('opacity', 1)
                            if (Math.abs(slideProgress) > 3) {
                                slide.css('opacity', 0)
                            }
                        }
                    },
                    setTransition: function(transition) {
                        for (let i = 0; i < this.slides.length; i++) {
                            let slide = this.slides.eq(i)
                            slide.transition(transition)
                        }
                    }
                }
            }
        }
    },
    methods: {
        callback() {
            console.log(12132)
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    mounted() {
        // current swiper instance
        // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
        console.log('this is current swiper instance object', this.swiper)
        this.swiper.slideTo(3, 1000, false)
    },
    components: {
        swiper,
        swiperSlide
    }
}
</script>

<style lang="stylus" scoped>
#certify
    position relative
    width 1200px
    margin 20px auto
    .swiper-container
        padding-bottom 10px
    .swiper-slide
        width 90%
        height 500px
        background #fff
        box-shadow 0px 2px 12px 0px #191919
        img
            width 100%
            height 100%
    .swiper-slide
        img
            display block
    .swiper-slide p
        line-height 98px
        padding-top 0
        text-align center
        color #636363
        font-size 1.1em
        margin 0
    .swiper-pagination
        width 100%
        bottom 20px
    .swiper-pagination-bullets
        .swiper-pagination-bullet
            margin 0 5px
            border 3px solid #fff
            background-color #d5d5d5
            width 10px
            height 10px
            opacity 1
    .swiper-pagination-bullets
        .swiper-pagination-bullet-active
            border 3px solid #00aadc
            background-color #fff
</style>
