<template>
  <div class="singer-detail">
    <music-list :loading="loading" :songs="songs" :pic="pic" :title="title"></music-list>
  </div>
</template>

<script>
import  { getSingerDetail } from "@/service/singer";
import  { processSongs } from "@/service/song";
import MusicList from "@/components/music-list/music-list";
import storage from 'good-storage'
import {SINGER_KEY} from '@/assets/js/constant'

export default {
  name: "singer-detail",
  components: {MusicList},
  props:{
    singer:Object
  },
  data(){
    return {
      songs: [],
      loading:true
    }
  },
  computed:{
    // 获取歌手详情数据
    computedSinger(){
      let ret = null
      const singer = this.singer
      if(singer){ //看是否在详情页面刷新
        ret = singer
      }else{ // 从缓存里拿到歌手详情数据
        const cachedSinger = storage.session.get(SINGER_KEY)
        if(cachedSinger && cachedSinger.mid === this.$route.params.id){
          ret = cachedSinger
        }
      }
      return ret
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title(){
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created(){
    if(!this.computedSinger){
      // 一级路由
      const path = this.$route.matched[0].path
      this.$router.push({
        path,
      })
      return
    }
    const result = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(result.songs)
    this.loading = false
  }
}
</script>

<style scoped lang="scss">
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>