// 随机洗牌算法
export function shuffle(source){
    const arr = source.slice()
    for (let i = 0; i < arr.length; i++) {
        const  j = getRanDomInt(i)
        swap(arr,i,j)
    }
    return arr
}
// 随机抽取一个整数
function getRanDomInt(max){
    return Math.floor(Math.random()*(max + 1))
}
// 交换元素
function swap(arr,i,j){
    const t = arr[i]
    arr[i] = arr[j]
    arr[j] = t
}

// 格式化时间
export function formatTime(interval){
    interval = interval | 0
    const minute = ((interval / 60 | 0) + '').padStart(2,'0')
    const second = (interval % 60 + '').padStart(2,'0')
    return `${minute}:${second}`
}