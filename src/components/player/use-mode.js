/*
* 切换模式的钩子函数
* */

import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from "@/assets/js/constant";

export default function usrMode(){
    const  store = useStore()
    // 当前的播放模式
    const playMode = computed(()=> store.state.playMode)


    // 计算显示的播放图标
    const modeIcon = computed(()=>{
        const playModeVal = playMode.value
        return playModeVal === PLAY_MODE.sequence
        ? 'icon-sequence'
            : playModeVal === PLAY_MODE.random
        ? 'icon-random' :'icon-loop'
    })

    // 点击播放模式按钮，切换模式
    function changeMode(){
        const mode = (playMode.value + 1) % 3
        store.dispatch('changeMode',mode)
    }

    return {
        modeIcon,
        changeMode
    }

}