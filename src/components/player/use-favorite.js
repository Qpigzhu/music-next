/*
* 收藏钩子函数
* */
import  { useStore} from "vuex";
import  { computed} from 'vue'
import { save,remove } from "@/assets/js/array-store";
import { FAVORITE_KEY } from '@/assets/js/constant'

export default  function useFavorite(){
    const store = useStore()
    const favoriteList = computed(()=> store.state.favoriteList)
    // 最大保存的长度
    const maxLen = 100

    // 计算显示的图标样式
    function getFavoriteIcon(song){
        return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    }

    // 点击按钮收藏或取消收藏
    function toggleFavorite(song){
        let list
        if(isFavorite(song)) {
            // 取消收藏
            list = remove(FAVORITE_KEY,compare)
        }else{
            // 收藏
            list = save(song,FAVORITE_KEY,compare,maxLen)
        }
        store.commit('setFavoriteList',list)

        // 判断该歌曲是否存在的规则
        function compare(item){
            return item.id === song.id
        }
    }


    // 判断是否已经收藏
    function isFavorite(song){
        return favoriteList.value.findIndex((item)=>{
            return item.id === song.id
        }) > -1
    }

    return {
        getFavoriteIcon,
        toggleFavorite
    }
}