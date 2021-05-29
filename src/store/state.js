import { PLAY_MODE,FAVORITE_KEY } from '@/assets/js/constant'
import  { load } from "@/assets/js/array-store";

const state = {
    // 顺序播放列表
    sequenceList:[],
    // 真实播放列表
    playlist:[],
    // 播放状态
    playing:false,
    // 播放模式
    playMode:PLAY_MODE.sequence,
    // 正在播放的歌曲索引
    currentIndex:0,
    // 播放器的True:收缩与False:放大
    fullScreen:false,
    // 收藏列表
    favoriteList:load(FAVORITE_KEY)
}

export default state