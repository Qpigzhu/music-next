<template>
  <transition name="mini">
    <div @click="showNormalPlayer" class="mini-player" v-show="!fullScreen">
      <!--   cd   -->
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img ref="cdImageRef" width="40" height="40" :class="cdCls" :src="currentSong.pic">
        </div>
      </div>
      <!--  描述 -->
      <div ref="sliderWrapperRef" class="slider-wrapper">
        <div class="slider-group">
          <div
              class="slider-page"
              v-for="song in playlist"
              :key="song.id"
          >
            <h2 class="name">{{song.name}}</h2>
            <p class="desc">{{song.singer}}</p>
          </div>
        </div>
      </div>
      <!-- 右侧  -->
      <div class="control">
        <progress-circle
            :radius="32"
            :progress="progress"
        >
          <i @click.stop="togglePlay" class="icon-mini" :class="miniPlayIcon"></i>

        </progress-circle>
      </div>
    </div>
  </transition>
</template>

<script>
import {useStore} from 'vuex'
import { computed } from 'vue'
import useCd from "@/components/player/use-cd";
import useMiniSlider from "@/components/player/use-mini-slider";
import ProgressCircle from "@/components/player/progress-circle";
export default {
  name: "mini-player",
  components: {
    ProgressCircle
  },
  props:{
    progress:{
      type:Number,
      default:0
    },
    togglePlay:Function,
  },
  setup(){
    // vuex
    const store = useStore()
    const fullScreen = computed(()=>store.state.fullScreen)
    const currentSong = computed(()=>store.getters.currentSong)
    const playing = computed(()=> store.state.playing)
    const playlist = computed(()=> store.state.playlist)


    // hooks
    // 歌曲cd
    const {cdImageRef,cdRef,cdCls} = useCd()
    // 切换下一首或上一首歌
    const {sliderWrapperRef} = useMiniSlider()

    // computed
    const miniPlayIcon =  computed(()=>{
      return playing.value?'icon-pause-mini':'icon-play-mini'
    })

    //methos
    // 展开播放器
    function showNormalPlayer(){
      store.commit('setFullScreen',true)
    }

    return{
      fullScreen,
      currentSong,
      playlist,
      miniPlayIcon,
      showNormalPlayer,
      //cd
      cdImageRef,
      cdRef,
      cdCls,
      // slider
      sliderWrapperRef,
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0)
  }
}
</style>