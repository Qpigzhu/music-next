/*
* 中间滑动层的逻辑
* */
import {ref} from 'vue'
export default function useMiddleInteractive(){
    // 显示cd或歌词
    const currentShow = ref('cd')
    // cd的样式
    const  middleLStyle = ref(null)
    // 歌词的样式
    const middleRStyle = ref(null)

    const touch = {}
    // 当前视图的位置
    let currentView = 'cd'
    // 拖动开始
    function onMiddleTouchStart(e){
        // 开始的X位置
        touch.startX = e.touches[0].pageX
        touch.startY = e.touches[0].pageY
        // 方向锁
        touch.directionLocked = ''
    }
    // 拖动过程
    function onMiddleTouchMove(e){
        // 相差的距离
        const deltaX = e.touches[0].pageX - touch.startX
        const deltaY = e.touches[0].pageY - touch.startY

        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)
        if(!touch.directionLocked){ // 方向锁，限制为X
            touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
        }

        if(touch.directionLocked === 'v'){
            return
        }

        const left = currentView === 'cd' ? 0 : -window.innerWidth
        // 偏移量
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        // 偏移比例
        touch.percent = Math.abs(offsetWidth / window.innerWidth)
        if(currentView === 'cd'){ // 当cd切换到歌词
            if(touch.percent > 0.2){
                currentShow.value = 'lyric'
            }else{
                currentShow.value = 'cd'
            }
        }else{ // 当歌词切换到cd
            if(touch.percent < 0.8){
                currentShow.value = 'cd'
            }else{
                currentShow.value = 'lyric'
            }
        }
        middleLStyle.value = {
            opacity:1 - touch.percent,
        }

        middleRStyle.value = {
            transform:`translate3d(${offsetWidth}px, 0, 0)`,
        }
    }
    // 拖动结束
    function onMiddleTouchEnd(){
        let offsetWidth
        let opacity
        if (currentShow.value === 'cd'){
            currentView = 'cd'
            offsetWidth = 0
            opacity = 1
        }else{
            currentView = 'lyric'
            offsetWidth = -window.innerWidth
            opacity = 0
        }
        // 动画时长
        const duration = 300
        // 修改cd视图的样式
        middleLStyle.value = {
            opacity,
            transitionDuration:`${duration}ms`
        }
        // 修改歌词视频的样式
        middleRStyle.value = {
            transform:`translate3d(${offsetWidth}px,0,0)`,
            transitionDuration:`${duration}ms`
        }
    }

    return {
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd
    }
}