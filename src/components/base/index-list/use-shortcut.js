/**
 * 右侧的快速导航入口
 * */

import {computed, ref} from 'vue'

export default  function useShortcut(props,groupRef){
    // 每个区域的高度
    const  ANCHOR_HEIGHT = 18
    // 拿到scroll组件实例
    const  scrollRef = ref(null)
    // 获取每个区域的标题,保存到数据列表
    const shortcutList = computed(()=>{
        return props.data.map((group)=>{
            return group.title
        })
    })

    // 保存拖动时与拖动结束的值
    const touch = {}

    // 点击监听事件
    function onShortcutTouchStart(e){
        // 拿到点击区域到的索引
        const anchorIndex = parseInt(e.target.dataset.index)
        // 拖动开始时的值
        touch.y1 = e.touches[0].pageY
        // 保存开始拖动的索引
        touch.anchorIndex = anchorIndex
        // 滚动到对应的区域
        scrollTo(anchorIndex)
    }

    // 监听手指拖动事件
    function onShortcutTouchMove(e){
        // 拖动结束的值
        touch.y2 = e.touches[0].pageY
        /*
        * 计算落在哪个区间内
        * 计算公式:(结束拖动的值 - 开始拖动的值) / 每个区域的高度
        * */
        const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
        const anchorIndex = touch.anchorIndex + delta
        // 滚动到对应的区域
        scrollTo(anchorIndex)
    }
    // 滚动到对应的区域
    function scrollTo(index){
        if(isNaN(index)){
            return
        }
        // 限定在0与数据列表索引之间
        index = Math.max(0,Math.min(shortcutList.value.length - 1,index))
        // 拿到索引对应的区域的Dom
        const targetEl = groupRef.value.children[index]
        // 拿到scroll实例
        const scroll = scrollRef.value.scroll
        // 滚动到对应区域
        scroll.scrollToElement(targetEl,0)
    }


    return {
        shortcutList,
        scrollRef,
        onShortcutTouchStart,
        onShortcutTouchMove
    }
}