/*
* 封装了使用storage存储到本地
* 可使用于把喜欢列表,播放历史存储到本地缓存
* **/

import storage from "good-storage";

// 添加元素到数组中
function inertArray(arr,val,compare,maxLen){
    const index = arr.findIndex(compare)
    if(index > -1){
        return
    }
    arr.unshift(val)
    // 超过最大保存长度
    if(maxLen && arr.length > maxLen){
        arr.pop()
    }
}

// 删除元素
function deleteFromArray(arr,compare){
    const index = arr.findIndex(compare)
    if(index > -1){
        arr.splice(index,1)
    }
}


// 添加数据到本地缓存
export function save(item,key,compare,maxLen){
    const items = storage.get(key,[])
    inertArray(items,item,compare,maxLen)
    storage.set(key,items)
    return items
}

// 移除数据
export function remove(key,compare){
    const items = storage.get(key,[])
    deleteFromArray(items,compare)
    storage.set(key,items)
    return items
}

// 获取缓存的数据
export function load(key){
    return storage.get(key,[])
}