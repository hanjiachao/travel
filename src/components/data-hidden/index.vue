<template>
  <div style="padding: 10px;">
    <div>
      <search-panel :searchs="searchs" :config="config" v-if="searchPanelShow" @query="query"></search-panel>
    </div>
    <div style="padding-bottom: 10px" class="current-query" v-if="currentQuery.length > 0">
      <div style="color: #2D8CF0;padding-bottom: 5px;">
        当前筛选条件
      </div>
      <div v-for="(query, queryIndex) in currentQuery" :key="queryIndex" style="display: inline-block;padding-right: 15px;">
        <span style="color: #99a9bf;">
          {{ query.label + ': ' }}
        </span>
        <span>
          {{ query.value }}
        </span>
      </div>
    </div>
    <div v-if="config.screening" style="padding-bottom: 10px;">
      <RadioGroup v-model="screenValue" :type="config.screening.type || 'button'">
        <Radio v-for="(screen, screenIndex) in config.screening.items" :key="screenIndex" :label="screen.value">
          {{ screen.label }}
        </Radio>
      </RadioGroup>
    </div>
    <div>
      <control-panel :batchData="batchData" :searchs="searchs" :config="config" :controls="controls" @save-success="saveSuccess" @search-show-change="searchPanelShowChange"></control-panel>
    </div>
    <div>
      <form-table ref="table" :queryData="queryData" :config="config" :showItem="showItem" :hideItem="hideItem" :paramsMap="paramsMap" :controls="controls" :searchs="searchs" @table-select="tableSelect"></form-table>
    </div>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formModal from '@/components/data-table/form-modal.vue'
import formTable from './table-page.vue'
import controlPanel from './control-panel.vue'
import searchPanel from './search-panel.vue'
export default {
  name: 'index',
  components: {
    'form-modal': formModal,
    'form-table': formTable,
    'control-panel': controlPanel,
    'search-panel': searchPanel
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    showItem: {
      type: Array,
      default: () => []
    },
    hideItem: {
      type: Object,
      default: () => {}
    },
    paramsMap: {
      type: Object,
      default: () => {}
    },
    controls: {
      type: Array,
      default: () => []
    },
    searchs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchPanelShow: false,
      means: means,
      seacherBox: '',
      primaryKey: 0,
      forms: {},
      pageData: {
        total: 0,
        pageSize: 20
      },
      currentQuery: [],
      queryData: {},
      // 批量操作时用到
      batchData: []
    }
  },
  methods: {
    saveSuccess () {
      this.$refs.table.getTableData()
    },
    searchPanelShowChange (searchPanelShow) {
      this.searchPanelShow = searchPanelShow
    },
    query (queryData) {
      let currentQuery = []
      let data = {}
      let index = 0
      Object.keys(queryData).forEach((key) => {
        currentQuery[index] = {
          label: queryData[key].label,
          value: queryData[key].value
        }
        data[key] = queryData[key].value
        index++
      })
      this.currentQuery = currentQuery
      this.queryData = data
    },
    tableSelect (select) {
      this.batchData = select
    }
  },
  computed: {
    screenValue: {
      get () {
        if (this.config.extraData) {
          return this.config.extraData[this.config.screening.value] || ''
        }
        return ''
      },
      set (value) {
        this.$emit('change-screen', value)
      }
    }
  }
}
</script>

<style scoped>
  .control-panel >>> .fl button{
    margin-right: 10px;
  }
  .control-panel >>> .column-control{
    padding: 0;
  }
  .control-panel >>> .column-control .box{
    padding: 6px 10px;
    display: inline-block;
  }
  .control-panel >>> .column-control .ivu-dropdown-rel{
    height: 30px;
  }
  .stop-click {
    display: inline-block;
    height: 100%;
  }
  .column-show-filter {
    display: inline-block;
    width: 70px;
    text-align: left;
  }
  .organization >>> .el-table--border{
    z-index: 1!important;
  }
</style>
<style>
  .table-list .ivu-btn{
    padding: 5px 10px 6px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .prin-list .ivu-btn{
    padding: 5px 10px 6px;
  }
</style>
<style scoped lang="less">
  .seacher-control{
    float: right;
    padding: 20px 0;
    .seacher-btn{
      margin-left: 10px;
    }
  }
</style>
