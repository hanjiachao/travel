<style scoped lang="less">
  .records-modal{
    /deep/ .ivu-modal-body{
      height: 500px;
      overflow-y: auto;
    }
    /deep/ .ivu-btn-text{
      display: none;
    }
  }
</style>
<template>
  <Modal :mask-closable="false"
         v-model="modalShow"
         class="records-modal"
         :title="title || ''"
         width="750px;">
    <records-table :ticket="ticket"></records-table>
  </Modal>
</template>

<script>
import recordsTable from './records'
export default {
  name: 'recordsModal',
  components: {
    'records-table': recordsTable
  },
  props: {
    ticket: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      modalShow: false
    }
  },
  computed: {
    title () {
      return this.ticket.ticket_name || ''
    }
  }
}
</script>
