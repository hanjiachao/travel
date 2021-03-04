<style scoped>
  .detail-modal >>> .ivu-btn-text{
    display: none;
  }
  .detail-modal >>> .ivu-modal-body{
    overflow-y: auto;
  }
  .detail-modal-card >>> .ivu-modal-body{
    height: 600px;
  }
  .detail-modal-form >>> .ivu-modal-body{
    height: 500px;
  }
</style>
<template>
  <div>
    <Modal :mask-closable="false"
           v-model="modalShow"
           class="detail-modal"
           :class="detailType === 'card' ? 'detail-modal-card' : 'detail-modal-form'"
           :title="title || ''"
           width="750px;">
      <modal-card @big-image="bigImage" v-if="detailType === 'card'" :history="history" :data="data" :hideItem="hideItem"></modal-card>
      <modal-form @big-image="bigImage" v-else :data="data" :hideItem="hideItem"></modal-form>
      <image-modal ref="imageModal" :imageInfo="imageInfo"></image-modal>
    </Modal>
  </div>
</template>

<script>
import modalCard from './detail-modal-card.vue'
import modalForm from './detail-modal-form.vue'
import imageModal from '../../../components/data-hidden/image-modal.vue'
export default {
  name: 'detail-modal-audit',
  components: {
    'modal-card': modalCard,
    'modal-form': modalForm,
    'image-modal': imageModal
  },
  props: {
    history: {
      type: Object,
      default: () => {}
    },
    hideItem: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      modalShow: false,
      imageInfo: {}
    }
  },
  methods: {
    bigImage (title, list, index) {
      this.imageInfo = {
        title: title,
        list: list,
        index: index
      }
      this.$refs.imageModal.modalShow = true
    }
  },
  computed: {
    detailType () {
      return this.hideItem.type || 'form'
    }
  }
}
</script>
