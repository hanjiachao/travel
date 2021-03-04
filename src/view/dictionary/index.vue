<template>
  <Split v-model="split">
    <div slot="left">
      <word-type @row-change="rowChange" ref="wordType"></word-type>
    </div>
    <div slot="right">
      <word-name @type-clear="typeClear" :type="type"></word-name>
    </div>
  </Split>
</template>

<script>
import wordType from './word-type.vue'
import wordName from './word-name.vue'
export default {
  name: 'dictionary',
  components: {
    'word-type': wordType,
    'word-name': wordName
  },
  data () {
    return {
      split: 0.5,
      foreignKey: '',
      type: ''
    }
  },
  methods: {
    rowChange (row) {
      if (row) {
        this.type = row.type
      } else {
        this.type = ''
      }
    },
    typeClear () {
      this.$refs.wordType.getList()
    }
  }
}
</script>

<style>
  .organization-list .ivu-btn{
    padding: 5px 10px 6px;
  }
</style>
