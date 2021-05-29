<template>
  <div
      class="progress-bar"
      @click="onClick"
  >
    <div class="bar-inner">
      <!-- 进度条 -->
      <div
          class="progress"
          :style="progressStyle"
          ref="progress"
      ></div>
      <!-- 按钮 -->
      <div
          class="progress-btn-wrapper"
          :style="btnStyle"
          @touchstart.prevent = "onTouchStart"
          @touchmove.prevent = "onTouchMove"
          @touchend.prevent = "onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 按钮的宽度
const  progressBtnWidth = 16
export default {
  name: "progress-bar",
  emits:['progress-changing','progress-changed'],
  props:{
    // 进度条的百分比0-1之间
    progress:{
      type:Number,
      default:0
    }
  },
  data(){
    return {
      // 按钮的偏移量
      offset:0
    }
  },
  computed:{
    // 进度条样式
    progressStyle(){
      return `width:${this.offset}px`
    },
    // 按钮样式
    btnStyle(){
      return `transform:translate3d(${this.offset}px,0,0)`
    }
  },
  watch:{
    // 监测进度条,并计算出按钮的偏移量
    progress(newProgress){
      this.setOffset(newProgress)
    }
  },
  created() {
    this.touch = {}
  },
  methods:{
    // 拖动开始
    onTouchStart(e){
      // 开始拖动的位置
      this.touch.x1 = e.touches[0].pageX
      // 进度条的初始宽度
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    // 拖动过程
    onTouchMove(e){
      // 计算拖动的距离是多少,拖动的X值 - 开始拖动的X值
      const delta = e.touches[0].pageX - this.touch.x1
      // 拖动过后的进度条宽度
      const tempWidth = this.touch.beginWidth + delta
      // 计算进度条的宽度,用总长度 - 按钮长度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 计算进度条的进度
      const progress = Math.min(1,Math.max( tempWidth / barWidth,0))
      // 计算按钮和进度条偏移量
      this.offset = barWidth * progress
      this.$emit('progress-changing',progress)
    },
    // 拖动结束
    onTouchEnd(){
      // 计算进度条的宽度,用总长度 - 按钮长度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 计算进度条的进度,当前进度条宽度 / 总体的宽度
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed',progress)
    },
    // 点击进度条
    onClick(e){
      const rect = this.$el.getBoundingClientRect()
      // 进点击之后度条的宽度
      const offsetWidth = e.pageX - rect.left
      // 计算进度条的宽度,用总长度 - 按钮长度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 计算进度条的进度,当前进度条宽度 / 总体的宽度
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed',progress)
    },
    // 计算出进度条和按钮的偏移量
    setOffset(progress){
      // 计算进度条的宽度,用总长度 - 按钮长度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 计算按钮的偏移量
      this.offset = barWidth * progress

    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>