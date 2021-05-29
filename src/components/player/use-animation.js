/*
* 全屏切换动画
* */
import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation(){
    const cdWrapperRef = ref(null)
    let entering = false
    let leaving = false

    // 定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。
    function enter(el,done){
        if(leaving){
            afterLeave()
        }
        entering = true
        // 计算动画的X,Y,和放大与缩小比例
        const {x,y,scale} = getPosAndScale()
        // 定义动画
        const animation = {
            0: {
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            },
            100: {
                transform: 'translate3d(0, 0, 0) scale(1)'
            }
        }
        // 注册动画
        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
                duration: 600,
                easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
            }
        })

        // 运行动画
        animations.runAnimation(cdWrapperRef.value, 'move', done)
    }
    // 动画进入结束
    function afterEnter(){
        entering = false
        animations.unregisterAnimation('move')
        cdWrapperRef.value.style.animation = ''
    }
    // 动画离开
    function leave(el,done){
        if(entering){
            afterEnter()
        }
        leaving = true
        const { x, y, scale } = getPosAndScale()
        const cdWrapperEl = cdWrapperRef.value

        // 自定义动画
        cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
        cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        // 监听动画结束事件
        cdWrapperEl.addEventListener('transitionend', next)

        // 动画结束事件
        function next() {
            // 移除动画结束事件
            cdWrapperEl.removeEventListener('transitionend', next)
            done()
        }
    }
    // 动画离开结束
    function afterLeave(){
        leaving = false
        const cdWrapperEl = cdWrapperRef.value

        cdWrapperEl.style.transition = ''
        cdWrapperEl.style.transform = ''
    }

    // 计算动画的X,Y,和放大与缩小比例
    function getPosAndScale(){
        // 缩小后的CD大小
        const targetWidth = 40
        // 小CD距离左边的距离
        const paddingLeft = 40
        // 小CD距离底部的距离
        const paddingBottom = 30
        // 大CD距离头部的距离
        const paddingTop = 80
        // 大cd的宽度是屏幕百分之80
        const width = window.innerWidth * 0.8
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        const scale = targetWidth / width

        return {
            x,
            y,
            scale
        }
    }

    return {
        cdWrapperRef,
        enter,
        afterEnter,
        leave,
        afterLeave
    }

}