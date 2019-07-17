<template>
    <div class="newSwiper">
        <div class="carousel" :style="{height:`${size}px`}">
            <div class="comp-carousel-container has-transition" @mouseenter="ctrl('stop')" @mouseleave="ctrl('start')">
                <div class="child-slide" :class="[{clone:item.clone,active:item.active,pre:item.pre,next:item.next}]" v-for="(item, index) in imgs" :key="index">
                    <div
                        class="banner-image"
                        :style="{backgroundImage:`url(${item.url})`}"
                    ></div>
                </div>
                
                <div class="pagination">
                    <div  @click="test(i)" v-for="i in imgs.length/2" :class="{active:currentIndex==i}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getactivitylist} from '../../api/index.js'
export default {
    data() {
        return {
            imgs: [],
            index:3,
            haha:false,
            currentIndex:1,
            timeIndex:1,
            timer:null,
            realLen:0,
            imgsArr:[]
        };
    },
    props:{
        /* imgsArr: {
            type: Array,
            required: true
        }, */
        size:{
            type:Number,
            default:1170
        }
    },
    methods: {
        test(i) {
            this.currentIndex = i
            var realLen = this.imgs.length/2
            // console.log(realLen);
            // console.log(this.currentIndex);
            if(i<=realLen/2){
                this.index = Math.ceil(i+2)
            }else{
                this.index = Math.ceil(realLen/2 + i)
            }
                console.log(this.index);

            for (let i = 0; i < this.imgs.length; i++) {
                this.imgs[i].active = false
                this.imgs[i].pre = false
                this.imgs[i].next = false
            }
            this.imgs[this.index+1].next = true
            this.imgs[this.index].active = true
            this.imgs[this.index-1].pre = true
            if(this.index%2==0){
                this.index+=1
            }else{
                this.index-=1
            }
        },
        ctrl(type){
            if(type=='stop'){
                this.stop = true
                clearInterval(this.timer)
            }else{
                this.stop = false
                this.timer = setInterval(()=>{
                    this.test(this.timeIndex)
                    this.timeIndex++
                    if(this.timeIndex>this.realLen){
                        this.timeIndex=1
                    }
                },2000)
            }
        }
    },
    created(){
        getactivitylist().then((res)=>{
            var url = 'http://tapi.hoyibet.com/'
            console.log(res);
            for (let i = 0; i < res.data.activitylist.length; i++) {
                var imgurl = res.data.activitylist[i].frontend_banner_picture.split('./')[1]
                this.imgsArr.push(url+imgurl)
            }
            for (let i = 0; i < this.imgsArr.length; i++) {
            this.imgs.push({url:this.imgsArr[i],active:false,pre:false,clone:false,next:false})
            }
            var arr = this.imgs
            var arrCopy = JSON.parse(JSON.stringify(arr))
            arr = arr.concat(arrCopy)
            for (let i = 0; i < arr.length; i++) {
                if(i<=1||i>=arr.length-2){
                    arr[i].clone = true
                }
                
            }
            this.imgs = arr
            this.realLen = this.imgs.length/2
        })
        
    },
    mounted() {
        var realLen = this.imgs.length/2
        this.timeIndex++
        this.timer = setInterval(()=>{
            this.test(this.timeIndex)
            this.timeIndex++
            if(this.timeIndex>realLen){
                this.timeIndex=1
            }
        },2000)
    }
};
</script>


<style>
.newSwiper{
    display: flex;
    justify-content: center;
    background: #000;
}
.carousel {
    width: 65%;
    height: 400px;
    margin-bottom: 26px;
}
.comp-carousel-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.comp-carousel-container.has-transition .child-slide {
    transition: opacity 0.5s cubic-bezier(0.17, 0.67, 0.55, 1.43),
        transform 0.5s cubic-bezier(0.17, 0.67, 0.55, 1.43);
}

.comp-carousel-container .child-slide {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transform: scale(0.9);
    height: 100%;
    cursor: pointer;
}

.comp-carousel-container .child-slide.child-clone {
    z-index: 0;
    opacity: 0;
}

.comp-carousel-container .child-slide.pre {
    display: block;
    opacity: 0.3;
    z-index: 0;
    transform: translateX(-5%) scale(0.9);
}

.comp-carousel-container .child-slide.active {
    display: block;
    opacity: 1;
    z-index: 1;
    transform: scale(0.94);
}

.comp-carousel-container .child-slide.next {
    display: block;
    opacity: 0.3;
    z-index: 0;
    transform: translateX(5%) scale(0.9);
}

.comp-carousel-container .child-slide img {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.comp-carousel-container .carousel {
    float: left;
    width: 768px;
    height: 320px;
    padding: 0 40px;
    margin: 30px 0 40px;
}

.comp-carousel-container .carousel .banner-image {
    width: 680px;
    height: 330px;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: cover;
}

.comp-carousel-container .pagination {
    position: absolute;
    right: 48px;
    text-align: center;
    bottom: 16px;
    z-index: 2;
}

.comp-carousel-container .pagination > div {
    display: inline-block;
    cursor: pointer;
    height: 8px;
    width: 8px;
    background-color: #bbb;
    border-radius: 8px;
    transition: width 0.6s ease;
    margin: 0 2px;
}

.comp-carousel-container .pagination > div.active {
    width: 36px;
}


.carousel .banner-image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}
</style>
