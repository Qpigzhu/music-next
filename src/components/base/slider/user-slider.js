/*
* 封装轮播图插件业务逻辑
* */
import Bscroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import  { ref,onMounted,onUnmounted } from  'vue'
// 使用轮播图插件
Bscroll.use(Slide)

export default  function useSilder(wrapperRef) {
    const slider = ref(null)
    //当前轮播图的位置
    const currentPageIndex = ref(0)
    // 组件创建完成时
    onMounted(()=>{
        /*
        * 创建Bscroll滑动对象
        * 第一参数为一个DOM对象,
        * 第二参数为配置项
        * */
        const sliderVal = slider.value = new Bscroll(wrapperRef.value,{
            click:true,
            scrollX:true,
            scrollY:true,
            momentum:false,
            bounce:false,
            probeType:2,
            slide:true
        })
        // 轮播图的切换事件
        sliderVal.on('slideWillChange',(page)=>{
            currentPageIndex.value = page.pageX
        })
    })

    // 组件销毁时
    onUnmounted(()=>{
        slider.value.destroy()
    })

    return {
        slider,
        currentPageIndex
    }
}