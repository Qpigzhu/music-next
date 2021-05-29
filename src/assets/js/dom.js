/*
* 封装了Dom节点的操作方法
* */


/*
* 添加Dom的Class方法
* */
export function addClass(el,className){
    if(el.classList.contains(className)){
        el.classList.add(className)
    }
}

/*
* 删除Dom的Class方法
* */
export function removeClass(el,className){
    el.classList.remove(className)
}