<template>
  <div class="music-list">
    <!-- 返回按钮-->
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <!-- 标题-->
    <h1 class="title">{{ title }}</h1>
    <!-- 背景图 -->
    <div
        class="bg-image"
        :style="bgImageStyle"
        ref="bgImage"
    >
      <!-- 随机播放按钮-->
      <div
          class="play-btn-wrapper"
          :style="playBtnStyle"
      >
        <div
            v-show="songs.length > 0"
            class="play-btn"
            @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>


      <!-- 背景图的遮罩层 -->
      <div class="filter" :style="filterStyle"></div>
    </div>
    <!-- 歌单列表 -->
    <scroll
        class="list"
        :style="scrollStyle"
        v-loading="loading"
        v-no-result:[noResultText]="noResult"
        :probe-type="3"
        @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";
import SongList from "@/components/base/song-list/song-list";
import  { mapActions } from 'vuex'
// 标题的高度
const RESERVED_HEIGHT = 40
export default {
  name: "music-list",
  components: {SongList, Scroll},
  props:{
    // 歌曲列表
    songs:{
      type:Array,
      default(){
        return []
      }
    },
    title:String,
    pic:String,
    loading:Boolean,
    noResultText:{
      type:String,
      default:'抱歉,没有找到可播放歌曲'
    }
  },
  data(){
    return {
      // 背景图片高度
      imageHeight:0,
      // 滑动的Y值
      scrollY:0,
      // 最大滑动的距离
      maxTransLateY:0
    }
  },
  computed:{
    noResult(){
      return !this.loading && !this.songs.length
    },
    // 随机按钮动态样式
    playBtnStyle(){
      let display = ''
      if(this.scrollY >= this.maxTransLateY){
        display = 'none'
      }
      return {
        display
      }
    },
    /*
    * 1.获取图片
    * 2.实现了往上推,并固定标题的效果
    * 3.实现往下拉时,图片放大效果
    * */
    bgImageStyle(){
      // 滑动的Y值
      const scrollY = this.scrollY
      // 默认的层级关系标题小于滑动列表
      let zIndex = 0
      // 默认图片比例的高度
      let paddingTop = '70%'
      // 默认图片的高度
      let height = 0
      // 兼容苹果端的手机
      let translateZ = 0

      // 滑动歌单到标题位置时
      if(scrollY > this.maxTransLateY){ // 当歌单滑动到大于最大滑动距离时
        // 层级关系变为滑动列表大于标题
        zIndex = 10
        // 图片比例为0
        paddingTop = 0
        // 图片高度设置为40px
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }

      // 歌单列表向下拉,放大效果
      let scale = 1
      if(scrollY<0){ // 当歌单列表往下拉时
        scale = 1+Math.abs(scrollY/this.imageHeight)
      }

      return {
        zIndex,
        paddingTop,
        height,
        // 兼容苹果端的手机
        transform: `scale(${scale})translateZ(${translateZ}px)`,
        backgroundImage: `url(${this.pic})`
      }
    },
    // 计算歌单列表向上推的,背景模糊效果
    filterStyle(){
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      if(scrollY >=0){
        blur = Math.min(this.maxTransLateY / imageHeight,  scrollY / imageHeight )  * 20
      }

      return {
        backdropFilter:`blur(${blur}px)`
      }

    },
    // 获取距离顶部的值
    scrollStyle(){
      return {
        top:`${this.imageHeight}px`
      }
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 获取歌单滑动最大的滑动距离
    this.maxTransLateY = this.imageHeight - RESERVED_HEIGHT
  },
  methods:{
    // 返回上一级
    goBack(){
      this.$router.back()
    },
    // 获取滑动事件的Y值
    onScroll(pos){
      this.scrollY = -pos.y
    },
    // 点击歌曲
    selectItem({song,index}){
      this.selectPlay({
        list:this.songs,
        index,
      })
    },
    // 随机播放
    random(){
      this.randomPlay(this.songs)
    },
    ...mapActions([
        'selectPlay',
        'randomPlay'
    ])
  }
}
</script>

<style lang="scss" scoped>
.music-list{
  position: relative;
  height: 100%;
  .back{
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image{
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }

      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>