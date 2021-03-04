<style scoped lang="less">

</style>

<template>
  <Split v-model="split">
    <div slot="left">
      <Activite @row-change="rowChange"/>
    </div>
    <div slot="right">
      <EntryList :parentId="parentId"/>
    </div>
  </Split>
</template>

<script>
import Activite from './activite'
import EntryList from './entry-list'

export default {
  name: 'index',
  components: {
    Activite,
    EntryList
  },
  data () {
    return {
      split: 0.5,
      parentId: ''
    }
  },
  methods: {
    rowChange (row) {
      this.parentId = row.id
    }
  }
}
</script>
