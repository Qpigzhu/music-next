import {ref, computed,nextTick, onMounted, onUnmounted, watch} from "vue";
import {useStore} from "vuex";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
BScroll.use(Slide)

export default function useMiniSlider(){
    const sliderWrapperRef = ref(null)
    const slider =ref(null)
    // vuex
    const store = useStore()
    const fullScreen = computed(()=>store.state.fullScreen)
    const playlist = computed(()=>store.state.playlist)
    const currentIndex = computed(()=>store.state.currentIndex)

    // slider显示条件,缩小状态,并且有歌曲
    const sliderShow = computed(()=>{
        return !fullScreen.value && !!playlist.value
    })

    onMounted(()=>{
        let sliderVal
        watch(sliderShow,async (newSliderShow)=>{
            if(newSliderShow){
                await nextTick()
                // 初始化滑动轮播
                if(!sliderVal){ // 没有初始化过
                    sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
                        click: true,
                        scrollX: true,
                        scrollY: false,
                        momentum: false,
                        bounce: false,
                        probeType: 2,
                        slide: {
                            autoplay: false,
                            loop: true
                        }
                    })
                    // 监听切换歌曲事件
                    sliderVal.on('slidePageChanged',({ pageX })=>{
                        store.commit('setCurrentIndex',pageX)
                        store.commit('setPlayingState',true)
                    })
                }else{ // 有初始化,重新计算
                    sliderVal.refresh()
                }
                // 显示当前歌曲对应的轮播
                sliderVal.goToPage(currentIndex.value, 0, 0)
            }
        })
        // 监听歌曲变化时
        watch(currentIndex,(newIndex)=>{
            if(sliderVal && sliderShow.value){
                sliderVal.goToPage(newIndex,0,0)
            }
        })
    })

    onMounted(()=>{
        if(slider.value){
            slider.value.destroy()
        }
    })
    return {
        slider,
        sliderWrapperRef
    }
}