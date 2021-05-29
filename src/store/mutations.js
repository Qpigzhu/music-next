const mutations = {
    // 播放状态
    setPlayingState(state,playing){
        state.playing = playing
    },
    // 顺序播放列表
    setSequenceList(state,list){
        state.sequenceList = list
    },
    // 设置真实播放列表
    setPlayList(state,list){
        state.playlist = list
    },
    // 设置播放模式
    setPlayMode(state,mode){
        state.playMode = mode
    },
    // 修改当前播放索引
    setCurrentIndex(state,index){
        state.currentIndex = index
    },
    // 设置播放界面
    setFullScreen(state,fullScreen){
        state.fullScreen = fullScreen
    },
    // 修改收藏列表
    setFavoriteList(state,list){
        state.favoriteList = list
    },
    // 给一个歌曲添加歌词
    addSongLyric(state,{song,lyric}){
        state.sequenceList.map((item)=>{
            if(item.mid === song.mid){
                item.lyric = lyric
            }
            return item
        })
    }
}

export default  mutations