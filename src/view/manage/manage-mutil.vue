<template>
  <div>
    <data-table :columns="config.columns" :search="config.search" :controls="controls" :config="config.config"></data-table>
  </div>
</template>

<script>
import dataTable from '_c/data-table/index.vue'
import config from '@/config/datatable'
import means from '@/libs/means'

export default {
  name: 'manage',
  components: {
    'data-table': dataTable
  },
  data () {
    return {
      config: {}
    }
  },
  created () {
    this.config = config[this.$route.params.name]
  },
  beforeRouteUpdate (to, from, next) {
    this.config = config[to.params.name]
    next()
  },
  computed: {
    controls () {
      if (this.config.controls) {
        return this.config.controls.filter((item) => {
          if (item.auth) {
            return means.hasPermission(item.auth)
          } else {
            return true
          }
        })
      } else {
        return []
      }

    }
  }
}
</script>

<style scoped>

</style>
