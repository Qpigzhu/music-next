<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import useScroll from './use-scroll'
import  { ref } from 'vue'
export default {
  name: "scroll",
  props:{
    // 是否可以点击
    click:{
      type:Boolean,
      default:true
    },
    // 派发的事件,0为不派发
    probeType:{
      type:Number,
      default: 0
    }
  },
  // 自定义事件
  emits:['scroll'],
  setup(props,{ emit }){
    const rootRef = ref(null)
    const scroll = useScroll(rootRef,props,emit)
    return {
      rootRef,
      scroll
    }
  }
}
</script>

<style scoped>

</style>