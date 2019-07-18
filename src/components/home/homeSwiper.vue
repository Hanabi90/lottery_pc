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
                loop: {
                    loop: true,
                    loopedSlides: 3
                },
                autoplay: {
                    autoplay: true,
                    delay: 3000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },

                on: {
                    progress: function(progress) {
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
        callback() {}
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
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
        height 400px
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
        bottom 20px
        text-align right
        padding-right 100px
        >>>.swiper-pagination-bullet
            width 10px
            height 10px
            border-radius 4px
            background #bbbbbb
        >>>.swiper-pagination-bullet-active
            width 18px
            background #bbbbbb
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
