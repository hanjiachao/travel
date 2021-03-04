<template>
  <div style="height:100%">
    <Split v-model="config[0].split" v-if="isSplit">
      <div slot="left">
        <data-table ref="dataTableL" @row-click="rowClick" :columns="config[0].columns" :search="config[0].search" :controls="config[0].controls" :config="config[0].config"></data-table>
      </div>
      <div slot="right">
        <data-table ref="dataTableR" :columns="config[1].columns" :search="config[1].search" :controls="config[1].controls" :config="config[1].config"></data-table>
      </div>
    </Split>
    <data-table ref="dataTable" v-else :columns="config.columns" :search="config.search" :controls="config.controls" :config="config.config"></data-table>
  </div>
</template>

<script>
import dataTable from '_c/data-table/index.vue'
import config from '@/config/datatable'

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
    this.init(this.$route.params.name)
  },
  beforeRouteUpdate (to, from, next) {
    if (to.path.indexOf('manage') > -1) {
      if (this.$refs.dataTable) {
        this.$refs.dataTable.showData = false
      } else {
        this.$refs.dataTableL.showData = false
        this.$refs.dataTableR.showData = false
      }
      this.init(to.params.name)
    }
    next()
  },
  methods: {
    init (name) {
      let tableConfig = config[name]
      if (tableConfig instanceof Array && !tableConfig[0].config.split) {
        tableConfig[0].config.split = 0.4
      }
      this.config = tableConfig
    },
    rowClick (row, index) {
      let config = this.config[1].config
      if (!config.loadParams || row.id !== config.loadParams[config.foreignKey]) {
        let loadParams = config.loadParams ? { ...config.loadParams } : {}
        loadParams[config.foreignKey] = row[this.config[0].config.primaryKey]
        this.$set(this.config[1].config, 'loadParams', loadParams)
      }
    }
  },
  computed: {
    isSplit () {
      return this.config instanceof Array
    }
  }
}
</script>

<style scoped>

</style>
