/*
* 封装创建自定义指令
* */
import {createApp} from 'vue'
import {addClass, removeClass} from "@/assets/js/dom";

const relativeCls = 'g-relative'

export default function createLoadingLikeDirective(Comp) {
    return {
        /*
         * 当对应元素被插入到 DOM 的父元素时触发
         */
        mounted(el, binding) {
            // 创建一个DOM对象
            const app = createApp(Comp)
            const instance = app.mount(document.createElement('div'))
            // 拿到组件名称
            const  name = Comp.name
            // 创建对应的组件的自定义对象,以免发送冲突
            if(!el[name]){
                el[name] = {}
            }
            el[name].instance = instance
            // 拿到标题参数,设置Loading标题
            const title = binding.arg
            if (typeof title !== 'undefined') {
                instance.setTitle(title)
            }
            // 把DOM挂载到el上
            if (binding.value) {
                append(el)
            }
        },
        /*
         * 当元素更新时，这个钩子会被触发（此时元素的后代元素还没有触发更新）。
         */
        updated(el, binding) {
            // 拿到组件名称
            const  name = Comp.name
            // 拿到标题参数,设置Loading标题
            const title = binding.arg
            if (typeof title !== 'undefined') {
                el[name].instance.setTitle(title)
            }
            if (binding.value !== binding.oldValue) {
                binding.value ? append(el) : remove(el)
            }
        }
    }

    // 添加Dom元素的方法
    function append(el) {
        /*
        * loading组件有absolute定位,父节点需要满足定位才可正常运行样式
        * 所以动态添加css的定位保证样式正常运行
        * 1.先拿到父节点的样式是否存在定位
        * 2.不存在则添加,存在则不需要添加
        * */
        // 拿到组件名称
        const  name = Comp.name
        const style = getComputedStyle(el)
        if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
            addClass(el, relativeCls)
        }
        el.appendChild(el[name].instance.$el)
    }

// 删除Dom元素
    function remove(el) {
        const  name = Comp.name
        removeClass(el, relativeCls)
        el.removeChild(el[name].instance.$el)
    }


}

