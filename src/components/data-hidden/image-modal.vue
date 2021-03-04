<style scoped>
  .modal-box >>> .ivu-btn-text{
    display: none;
  }
  .img-box{
    text-align: center;
    height: 100%;
    width: 600px;
    overflow: auto;
    margin: 0 auto;
  }
  .modal-box >>> .ivu-modal-body{
    height: 400px;
    line-height: 400px;
    overflow-y: auto;
  }
  .modal-box >>> .el-carousel__container{
    height: 100%;
  }
  .image-box{
    height: 100%;
    text-align: center;
  }
  .switch-btn{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    z-index: 100000000;
    background-size: 100% 100%;
    cursor: pointer;
  }
  .prev-img{
    left: 50px;
    background-image: url("../../assets/images/previous.png");
  }
  .next-img{
    right: 50px;
    background-image: url("../../assets/images/next.png");
  }
</style>
<template>
  <Modal :mask-closable="false"
         class="modal-box"
         v-model="modalShow"
         width="700"
         :title="title">
    <div class="img-box">
      <div class="image-box">
        <img style="max-width: 100%; display: inline-block; vertical-align: middle;" :src="list[index]">
      </div>
      <div v-if="this.list.length > 1">
        <div class="switch-btn prev-img" @click="switchImage('prev')">
        </div>
        <div class="switch-btn next-img" @click="switchImage('next')">
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'image-modal',
  props: {
    imageInfo: {
      tyep: Object,
      default: () => {}
    }
  },
  data () {
    return {
      modalShow: false,
      pictureInfo: {},
      index: 0,
      list: [],
      title: ''
    }
  },
  methods: {
    switchImage (type) {
      let length = this.list.length
      let index = this.index
      if (type === 'prev') {
        index = index - 1
        if (index < 0) {
          index = length - 1
        }
      } else if (type === 'next') {
        index = index + 1
        if (index >= length) {
          index = 0
        }
      }
      this.index = index
    }
  },
  created () {},
  watch: {
    imageInfo: {
      handler () {
        this.index = this.imageInfo.index || 0
        this.list = this.imageInfo.list || []
        this.title = this.imageInfo.title || ''
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
