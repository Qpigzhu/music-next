<template>
    <div class="recommend" v-loading="loading">
      <scroll class="recommend-content">
        <div>
          <!-- 轮播图 -->
          <div class="slider-wrapper">
            <div class="slider-content">
              <!-- 轮播图组件 -->
              <slider v-if="sliders.length" :sliders="sliders"></slider>
            </div>
          </div>
          <!--  推荐歌单 -->
          <div class="recommend-list">
             <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
             <ul>
               <li class="item" v-for="item in albums" :key="item.id">
                 <div class="icon">
                   <img width="60" height="60"  v-lazy="item.pic">
                 </div>
                 <div class="text">
                   <h2 class="name">
                     {{ item.username }}
                   </h2>
                   <p class="title">
                     {{item.title}}
                   </p>
                 </div>
               </li>
             </ul>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script>
import { getRecommend } from '../service/recommend'
import Slider from '@/components/base/slider/slider'
import Scroll from "@/components/base/scroll/scroll";
export default {
  components: {
    Scroll,
    Slider
  },
  computed:{
    loading(){
      return !this.sliders.length && !this.albums.length
    }
  },
  data(){
    return {
      // 轮播图列表数据
      sliders:[],
      // 歌单列表数据
      albums:[],
    }
  },
  async created() {
     const result =  await getRecommend()
     this.sliders = result.sliders
     this.albums = result.albums
  }
}
</script>

<style lang="scss" scoped>
.recommend{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }

        .name {
          margin-bottom: 10px;
          color: $color-text;
        }

        .title {
          color: $color-text-d;
        }
      }
    }
  }
}
</style>