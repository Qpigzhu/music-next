/**
 * 计算标题的fiexd显示的标题
 * */
import  { ref,watch,computed,nextTick } from 'vue'
export default function useFixed (props){
    const TITLE_HEIGHT = 30
    // 拿到每个区间的歌手表单的整个Dom节点
    const groupRef = ref(null)
    // 保存每个区域的高度数据列表
    const listHeights = ref([])
    // 滑动的Y值
    const scrollY = ref(0)
    // 当前区域的索引
    const currentIndex = ref(0)
    // 两个区域的距离
    const distance = ref(0)

    // 计算拿到当前区域的标题
    const fixedTitle = computed(()=>{
        if(scrollY.value < 0){
            return  ''
        }
        const currentGroup = props.data[currentIndex.value]
        return currentGroup ? currentGroup.title : ''
    })

    // 计算偏移量
    const fixedStyle = computed(()=>{
        const distanceVal = distance.value
        const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
        return {
            transform:`translate3d(0,${diff}px,0)`
        }
    })

    // 当数据发生变化时,计算高度
    watch(()=>props.data,async ()=>{
        // 当Dom渲染完时,再计算高度
        await nextTick()
        calculate()
    })

    // 监听当滑动的Y值发生变化时,计算当前落到哪个区域内
    watch(scrollY,(newY)=>{
        const listHeightsVal = listHeights.value
        for (let i = 0; i < listHeightsVal.length - 1; i++) {
            const  heightTop = listHeightsVal[i]
            const  heightBottom = listHeightsVal[i+1]
            if(newY>=heightTop && newY <= heightBottom){
                currentIndex.value = i
                // 计算两个区域的距离
                distance.value = heightBottom - newY
            }
        }
    })


    // 计算每个高度的区间
    function calculate(){
        // 拿到每一个区域的Dom
        const list = groupRef.value.children
        const listHeightsVal = listHeights.value
        // 初始化操作,第一个区域为0
        let height = 0
        listHeightsVal.length = 0
        listHeightsVal.push(height)

        // 循环添加每个区域的高度
        for (let i = 0; i < list.length; i++) {
            // 获取每个区间高度,添加到高度数据列表中
            height += list[i].clientHeight
            listHeightsVal.push(height)
        }
    }

    // 当滑动滚动时
    function onScroll(pos){
        scrollY.value = -pos.y
    }

    return {
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex
    }
}