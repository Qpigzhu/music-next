import { useStore} from "vuex";
import {computed, ref, watch} from 'vue'
import { getLyric } from "@/service/song";
import Lyric from "lyric-parser";

export default  function useLyric({songReady,currentTime}){
    // data
    const currentLyric = ref(null)  // 歌词解析器的对象
    const currentLineNum = ref(0)  // 当播放歌词的行数
    const pureMusicLyric = ref('') // 处理纯音乐的文案
    const playingLyric = ref('') // 当前的播放歌词
    const lyricScrollRef = ref(null) // scroll对象
    const lyricListRef = ref(null) // 歌词的Dom对象

    //vuex
    const store = useStore()
    // 当前歌曲
    const currentSong = computed(()=> store.getters.currentSong)

    //watch
    // 监听当前歌曲的变化,切换歌词时,获取歌词
    watch(currentSong,async (newSong)=>{
        if(!newSong.url || !newSong.id){
            return
        }
        // 初始化操作
        stopLyric()
        currentLyric.value = null
        currentLineNum.value = 0
        pureMusicLyric.value = ''
        playingLyric.value = ''

        const lyric = await getLyric(newSong)
        // 给一个歌曲添加歌词,减少请求
        store.commit('addSongLyric',{
            song:newSong,
            lyric
        })
        // 当前的歌曲的歌曲不是当前歌词
        if(currentSong.value.lyric !== lyric){
            return
        }

        // 初始化歌词解析器对象
        currentLyric.value = new Lyric(lyric,handleLyric)
        // 判断是否纯音乐
        const hasLyric = currentLyric.value.lines.length
        if(hasLyric){
            // 播放歌词
            if(songReady.value){
                playLyric()
            }
        }else{
            playingLyric.value =  pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
        }

    })

    // 播放歌词
    function playLyric(){
        const currentLyricVal = currentLyric.value
        if(currentLyricVal){
            currentLyricVal.seek(currentTime.value*1000)
        }
    }
    // 暂停歌词
    function stopLyric(){
        const currentLyricVal = currentLyric.value
        if(currentLyricVal){
            currentLyricVal.stop()
        }
    }

    // 处理歌词播放的函数
    function handleLyric({lineNum,txt}){
        // 当前播放的行数
        currentLineNum.value = lineNum
        playingLyric.value = txt
        // scroll组件
        const scrollComp = lyricScrollRef.value
        // 歌词的Dom对象
        const listEl = lyricListRef.value
        if(!listEl){
            return
        }
        if(lineNum>5){ // 歌词大于5行就自动滚动
            const lineEl = listEl.children[lineNum - 5]
            scrollComp.scroll.scrollToElement(lineEl,1000)
        }else{
            scrollComp.scroll.scrollTo(0, 0, 1000)
        }
    }
    return {
        currentLyric,
        currentLineNum,
        playLyric,
        stopLyric,
        lyricScrollRef,
        lyricListRef,
        pureMusicLyric,
        playingLyric
    }
}