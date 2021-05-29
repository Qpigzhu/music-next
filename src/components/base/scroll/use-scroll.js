import Bscroll from '@better-scroll/core'
import ObserveDOM from "@better-scroll/observe-dom";
import  { ref,onMounted,onUnmounted } from  'vue'

Bscroll.use(ObserveDOM)

export default function useScroll(wrapperRef,options,emit){
    const scroll = ref(null)

    onMounted(()=>{
        const scrollVal = scroll.value = new Bscroll(wrapperRef.value,{
            observeDOM:true,
            ...options
        })

        // 大于0 监听滑动事件
        if(options.probeType > 0){
            scrollVal.on('scroll',(pos)=>{
                // 对外派发事件
                emit('scroll',pos)
            })
        }
    })

    onUnmounted(()=>{
        scroll.value.destroy()
    })
    return scroll
}