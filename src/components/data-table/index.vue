<template>
  <div style="padding: 18px 10px;">
    <div>
      <search-panel :config="config" @query="query" @empty="empty" :options="search" v-show="searchPanelShow"></search-panel>
    </div>
    <div>
      <control-panel @save-success="saveSuccess" :options="usableControls" :config="config"  :search="search" :columns="columns" :selections="selections" :primaryKey="config.primaryKey" @show-columns-change="showColumnsChange" @search-show-change="searchPanelShowChange"></control-panel>
    </div>
    <div>
      <data-table ref="dataTable" @data-refresh="dataRefresh" @save-success="saveSuccess" @row-click="rowClick" :columns="columns" :show-columns="showColumns" :controls="usableControls" :config="config" @on-selection-change="selectionChange"></data-table>
    </div>
  </div>
</template>

<script>
import dataFrom from './form.vue'
import searchPanel from './search-panel.vue'
import controlPanel from './control-panel.vue'
import dataTable from './data-table.vue'
import means from '@/libs/means'

export default {
  name: 'dataTable',
  components: {
    'data-form': dataFrom,
    'search-panel': searchPanel,
    'control-panel': controlPanel,
    'data-table': dataTable
  },
  props: {
    controls: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    search: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showData: false,
      selections: [],
      searchPanelShow: false,
      showColumns: []
    }
  },
  methods: {
    dataRefresh () {
      this.showData = true
      this.$emit('data-refresh')
    },
    empty (searchForms) {
      let loadParams = this.config.loadParams ? { ...this.config.loadParams } : {}
      loadParams = Object.assign(loadParams, searchForms)
      this.$set(this.config, 'loadParams', loadParams)
    },
    query (searchForms) {
      let loadParams = this.config.loadParams ? { ...this.config.loadParams } : {}
      loadParams = Object.assign(loadParams, searchForms)
      this.$set(this.config, 'loadParams', loadParams)
    },
    saveSuccess (id) {
      this.$refs.dataTable.getTableData()
    },
    rowClick (row, index) {
      this.$emit('row-click', row, index)
    },
    showColumnsChange (columns) {
      this.showColumns = columns
    },
    searchPanelShowChange (searchPanelShow) {
      this.searchPanelShow = searchPanelShow
    },
    selectionChange (selections, controls) {
      this.selections = selections
    }
  },
  computed: {
    usableControls () {
      return this.controls.filter((item) => {
        if (item.auth) {
          return means.hasPermission(item.auth)
        } else {
          return true
        }
      })
    }
  },
  created () {
    // this.initSearchOptions(this.searchConfig)
    // this.getTableData()
  }
}
</script>

<style scoped>
</style>
