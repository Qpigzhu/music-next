import { PLAY_MODE } from '@/assets/js/constant'
import  { shuffle } from '@/assets/js/util'
// 点击播放
export function selectPlay({commit},{list,index}){
    commit('setPlayMode',PLAY_MODE.sequence)
    commit('setSequenceList',list)
    commit('setPlayingState',true)
    commit('setFullScreen',true)
    commit('setPlayList',list)
    commit('setCurrentIndex',index)
}

// 随机播放
export function randomPlay({commit},list){
    commit('setPlayMode',PLAY_MODE.random)
    commit('setSequenceList',list)
    commit('setPlayingState',true)
    commit('setFullScreen',true)
    commit('setPlayList',shuffle(list))
    commit('setCurrentIndex',0)
}

// 切换播放模式
export function changeMode({ commit,state,getters},mode){
    // 当前歌曲播放的id
    const currentId = getters.currentSong.id

    if(mode===PLAY_MODE.random){ // 随机播放模式
        commit('setPlayList',shuffle(state.sequenceList))
    }else{
        commit('setPlayList',state.sequenceList)
    }

    const index = state.playlist.findIndex((song)=>{
        return song.id === currentId
    })
    commit('setCurrentIndex',index)
    commit('setPlayMode',mode)
}