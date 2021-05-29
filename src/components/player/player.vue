<template>
  <div class="player" v-show="playlist.length">
    <transition
        name="normal"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave"
    >
      <div
        class="normal-player"
        v-show="fullScreen"
    >
      <!--  背景图  -->
      <div class="background">
        <img :src="currentSong.pic">
      </div>
      <!--  头部位置  -->
      <div class="top">
        <!--  返回键  -->
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <h1 class="subtitle">{{currentSong.singer}}</h1>
        <!--  歌曲旋转CD  -->
        <div
            class="middle"
            @touchstart.prevent = "onMiddleTouchStart"
            @touchmove.prevent = "onMiddleTouchMove"
            @touchend.prevent = "onMiddleTouchEnd"
        >
          <div :style="middleLStyle"  class="middle-l">
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div
                  class="cd"
                  ref="cdRef"
              >
                <img
                    ref="cdImageRef"
                    class="image"
                    :src="currentSong.pic"
                    :class="cdCls"
                >
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!--  歌词  -->
          <scroll
              class="middle-r"
              ref="lyricScrollRef"
              :style="middleRStyle"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                    class="text"
                    :class="{'current': currentLineNum ===index}"
                    v-for="(line,index) in currentLyric.lines"
                    :key="line.num"
                >
                  {{line.txt}}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
      </div>
      <!--  底部控制位置  -->
      <div class="bottom">
        <!--  指示点  -->
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow==='cd'}"></span>
          <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
        </div>
        <!-- 进度条  -->
        <div class="progress-wrapper">
          <span class="time time-l">{{formatTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
            >
            </progress-bar>
          </div>
          <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
        </div>
        <!-- 歌曲操作区域  -->
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div  class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <mini-player :progress="progress" :togglePlay="togglePlay"></mini-player>
    <audio
        ref="audioRef"
        @pause="pause"
        @canplay="ready"
        @error="error"
        @timeupdate="updateTime"
        @ended="end"
    ></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import {computed, watch, ref, nextTick} from 'vue'
import useMode from "@/components/player/use-mode";
import useFavorite from "@/components/player/use-favorite";
import ProgressBar from "@/components/player/progress-bar";
import useCd from "@/components/player/use-cd";
import useLyric from "@/components/player/use-lyric";
import useMiddleInteractive from "@/components/player/use-middle-interactive";
import useAnimation from "@/components/player/use-animation";
import Scroll from "@/components/base/scroll/scroll";
import MiniPlayer from "@/components/player/mini-player";
import {formatTime} from '@/assets/js/util'
import { PLAY_MODE } from "@/assets/js/constant";


export default {
  name: "player",
  components: {
    MiniPlayer,
    ProgressBar,
    Scroll
  },
  setup(){
    // data
    const audioRef = ref(null)
    // 进度条实例
    const barRef = ref(null)
    // 歌曲是否已经缓冲完成
    const songReady = ref(false)
    // 当前播放时间
    const currentTime = ref(0)
    // 是否在拖动进度条
    let progressChanging = false


    // vuex
    const store = useStore()
    // 是否收缩播放器
    const fullScreen = computed(()=> store.state.fullScreen)
    // 当前播放的歌曲
    const currentSong = computed(()=> store.getters.currentSong)
    // 播放状态
    const playing = computed(()=> store.state.playing)
    // 当前播放歌曲的索引
    const currentIndex = computed(()=> store.state.currentIndex)
    // 当前的播放模式
    const playMode = computed(()=> store.state.playMode)


    // hooks
    // 切换歌曲模式
    const {modeIcon,changeMode} = useMode()
    // 收藏与取消收藏的函数
    const {getFavoriteIcon,toggleFavorite} = useFavorite()
    // 歌曲cd
    const {cdImageRef,cdRef,cdCls} = useCd()
    // 歌词获取
    const {lyricScrollRef,lyricListRef,currentLyric,currentLineNum,
      stopLyric,playLyric,pureMusicLyric,playingLyric} = useLyric({songReady,currentTime})
    // 中间切换逻辑
    const { currentShow, middleLStyle, middleRStyle,
      onMiddleTouchStart, onMiddleTouchMove,
      onMiddleTouchEnd} = useMiddleInteractive()
    // 过渡动画
    const {cdWrapperRef, enter, afterEnter, leave, afterLeave} = useAnimation()

    // computed
    // 播放列表
    const playlist = computed(()=>store.state.playlist)

    // 计算中间的按钮是暂停还是播放
    const playIcon = computed(()=>{
      return playing.value ? 'icon-pause':'icon-play'
    })

    // 计算进度条位置
    const progress = computed(()=>{
      return currentTime.value / currentSong.value.duration
    })


    // 当缓存没有时,禁用按钮
    const disableCls = computed(()=>{
      return songReady.value ? '':'disable'
    })


    // watch
    // 监听播放歌曲
    watch(currentSong,(newSong)=>{
      if(!newSong.id || !newSong.url){
        return
      }
      currentTime.value = 0
      // 歌曲发生变化时,缓存状态变为False
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })
    // 监听歌曲暂停或播放
    watch(playing,(newPlaying)=>{
      if(!songReady.value){
        return
      }
      const audioEl = audioRef.value
      if(newPlaying){
        audioEl.play()
        playLyric()
      }else{
        audioEl.pause()
        stopLyric()
      }
    })

    // 监测播放器处于展开或缩小状态
    watch(fullScreen,async (newFullScreen)=>{
      if(newFullScreen){
        await nextTick()
        // 展开播放器时,主动计算一次进度条
        barRef.value.setOffset(progress)
      }
    })


    //methods
    // 返回上级
    function goBack(){
      store.commit('setFullScreen',false)
    }
    // 播放或暂停歌曲
    function togglePlay(){
      if(!songReady.value){
        return
      }
      store.commit('setPlayingState',!playing.value)
    }
    // 歌曲为暂停状态时
    function pause(){
      store.commit('setPlayingState',false)
    }
    // 监听点击上一首
    function prev(){
      const list = playlist.value

      if(!songReady.value || !list.length){
        return
      }

      if(list.length === 1){ // 当播放列表只有一首歌时,循环播放
        loop()
      }else{
        let index = currentIndex.value - 1
        // 当前歌曲为第一首歌时,就跳到最后一首歌
        if(index === -1){
          index = list.length - 1
        }
        store.commit('setCurrentIndex',index)
        // 歌曲暂停状态时,就改为开始播放
        if(!playing.value){
          store.commit('setPlayingState',true)
        }
      }
    }
    // 监听点击下一首
    function next(){
      const list = playlist.value

      if(!songReady.value || !list.length){
        return
      }

      if(list.length === 1){ // 当播放列表只有一首歌时,循环播放
        loop()
      }else{
        let index = currentIndex.value + 1
        // 当前歌曲为最后一首歌时,就跳到最第一首歌
        if(index === list.length){
          index = 0
        }
        store.commit('setCurrentIndex',index)
        // 歌曲暂停状态时,就改为开始播放
        if(!playing.value){
          store.commit('setPlayingState',true)
        }
      }
    }
    // 循环播放
    function loop(){
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState',true)
    }
    // 监听歌曲完成缓存状态
    function ready(){
      if(songReady.value){
        return
      }
      songReady.value = true
      playLyric()
    }
    // 监听歌曲出错
    function error(){
      songReady.value = true
    }
    // 监听歌曲时间更新
    function updateTime(e){
      if(!progressChanging){
        currentTime.value = e.target.currentTime
      }
    }
    // 进度条拖动时
    function onProgressChanging(progress){
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
      playLyric()
      stopLyric()
    }
    // 进度条拖动结束
    function onProgressChanged(progress){
      progressChanging = false
      // 修改歌曲播放时间
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      // 如果是歌曲正在暂停,改为播放
      if(!playing.value){
        store.commit('setPlayingState',true)
      }
      playLyric()
    }
    // 监听一首歌曲结束
    function end(){
      // 当前播放时间设置为0
      currentTime.value = 0
      if(playMode.value === PLAY_MODE.loop){ // 循环播放模式
        loop()
      }else{
        next()
      }

    }

    return {
      audioRef,
      barRef,
      fullScreen,
      playlist,
      currentTime,
      currentSong,
      playIcon,
      disableCls,
      progress,
      goBack,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      error,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      // mode
      modeIcon,
      changeMode,
      // favorite
      getFavoriteIcon,
      toggleFavorite,
      // cd
      cdImageRef,
      cdRef,
      cdCls,
      // lyric
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      currentLyric,
      currentLineNum,
      playingLyric,
      // middle
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      // animation
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active {
      transition: all .6s;
      .top, .bottom {
        transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from, &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0)
      }
    }
  }
}
</style>