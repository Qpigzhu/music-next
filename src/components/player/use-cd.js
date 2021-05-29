import { useStore } from "vuex";
import { computed,ref,watch } from 'vue'
export default function useCd(){

    const cdImageRef = ref(null)
    const cdRef = ref(null)

    // vuex
    const store = useStore()
    // 歌曲状态
    const playing = computed(()=>store.state.playing)

    // computed
    // 计算cd是否旋转
    const cdCls = computed(()=>{
        return playing.value ? 'playing':''
    })

    // watch
    // 监听歌曲状态
    watch(playing,(newPlaying)=>{
        if(!newPlaying){ // 暂停时,同步cd旋转角度
            syncTransform(cdRef.value,cdImageRef.value)
        }
    })

    // 同步角度
    function syncTransform(wrapper,inner){
        const wrapperTransfrom = getComputedStyle(wrapper).transform
        // 拿到内层的transform
        const innerTransfrom = getComputedStyle(inner).transform
        // 角度叠加
        wrapper.style.transform = wrapperTransfrom === 'none'?
            innerTransfrom:innerTransfrom.concat('',wrapperTransfrom)
    }

    return {
        cdImageRef,
        cdRef,
        cdCls
    }
}