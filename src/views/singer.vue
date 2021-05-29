<template>
  <div class="singer" v-loading="!singers.length">
    <index-list
        :data="singers"
        @select="selectSinger"
    >
    </index-list>

    <!-- 路由切换过度效果   -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger" />
      </transition>
    </router-view>


  </div>
</template>

<script>
import  { getSingerList } from "@/service/singer";
import IndexList from "@/components/base/index-list/index-list";
import storage from 'good-storage'
import {SINGER_KEY} from '@/assets/js/constant'

export default {
  components: {
    IndexList
  },
  data(){
    return {
      // 歌手列表数据
      singers:[],
      // 歌手详情数据
      selectedSinger:null
    }
  },
  async created(){
      const result = await getSingerList()
      this.singers = result.singers
  },
  methods:{
    // 点击某一个歌手
    selectSinger(singer){
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        path:`/singer/${singer.mid}`
      })
    },
    // 缓存本地歌手详情数据
    cacheSinger(singer){
      storage.session.set(SINGER_KEY,singer)
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>