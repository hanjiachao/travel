<style scoped lang="less">
  .table-page{
    padding: 10px;
    .table-list{
      /deep/ .ivu-btn{
        padding: 5px 10px 6px;
      }
      /deep/ .el-table__expanded-cell{
        padding: 20px 10px;
      }
    }
  }
</style>
<template>
  <div class="table-page">
    <div v-if="searchAllow">
      <search-filter :searchShow="searchShow" :searchs="searchs" @screening="screening"></search-filter>
    </div>
    <div class="control-panel">
      <control-panel @save-success="getTableData" :config="config.controlConifg || {}" :controls="controls" :showItem="showItem" :searchs="searchs" @refresh="getTableData" @search-show-change="searchShowChange" @show-columns-change="showColumnsChange"></control-panel>
    </div>
    <div class="table-list">
      <el-table :data="tableData"
                ref="table"
                style="width: 100%"
                border
                :row-key="config.primaryKey || 'id'"
                @selection-change="tableSelect"
                @current-change="rowChange"
                v-loading="tableLoading"
                :highlight-current-row="config.highlight"
                stripe>
        <el-table-column
          type="selection"
          align="center"
          v-if="isBatch"
          width="55">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columns"
          :align="item.align || config.columnAlign || 'center'"
          :width="item.width || 'auto'"
          :min-width="item.minWidth || 'auto'"
          :key="index"
          show-overflow-tooltip
          :fixed="item.fixed"
          :label="item.label"
          :prop="item.value">
        </el-table-column>
        <el-table-column
          v-if="hasDetail"
          :align="config.columnAlign || 'center'"
          label="详情">
          <template slot-scope="scope">
            <el-button type="text" @click="detailShow(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :fixed="config.controlsFixed"
          v-if="means.operationAllow(powerList)"
          :width="means.operationWidth(powerList)">
          <template slot="header" slot-scope="scope">
            操作
            <span v-if="btnsFoldAble" style="color: #409EFF; cursor: pointer" @click="btnsFold = !btnsFold">
            (
            {{ btnsFold ? '更多' : '收起' }}<Icon v-if="btnsFold" color="#409EFF" type="ios-arrow-down" /><Icon v-else color="#409EFF" type="ios-arrow-up" />
            )
          </span>
          </template>
          <template slot-scope="scope">
            <span v-for="(control, controlIndex) in controls" :key="controlIndex">
              <!--v-if="means.hasPermission(control.auth)"-->
              <el-tooltip :content="control.title" placement="top" v-if="control.type === 'form' && control.selection !== 'none' && (!control.fold || !btnsFold)">
                <Button style="margin: 0 3px" @click="showForm(control, scope.row)">
                  <Icon :type="control.icon"></Icon>
                </Button>
              </el-tooltip>
              <Poptip
                transfer
                confirm
                :title="'确认要' + control.title || '操作' + '吗?'"
                @on-ok="sendHandle(control, scope.row)"
                ok-text="确定"
                v-if="control.type === 'handle' && control.selection !== 'none' && (!control.fold || !btnsFold)"
                cancel-text="取消">
                <el-tooltip :content="control.title" placement="top">
                  <Button style="margin: 0 3px">
                    <Icon :type="control.icon"></Icon>
                  </Button>
                </el-tooltip>
              </Poptip>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: right;" v-if="config.paging">
      <paging :config="config.pagingConfig" v-model="page" :total="pageData.total" :page-size="pageData.pageSize" @on-change="toPage" @refresh="getTableData"></paging>
    </div>
    <detail-modal v-if="hasDetail" ref="detailModal" :data="detailInfo" :title="detailTitle" :hideItem="hideItem || {}"></detail-modal>
    <form-modal v-model="forms" :config="config" @save-success="getTableData"></form-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import paging from '../smallComponents/paging'
import searchFilter from '../search/search-filter'
import detailModal from '../detail/detail-modal'
import controlsPanel from './control-panel'
import formModal from '../dataForm/form-modal.vue'

export default {
  name: 'table-page-collection',
  components: {
    paging,
    'search-filter': searchFilter,
    'detail-modal': detailModal,
    'control-panel': controlsPanel,
    'form-modal': formModal
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
      means: means,
      forms: {},
      // 分页
      page: 1,
      pageData: {
        total: 0,
        pageSize: 20
      },
      // table表格需要的参数
      tableLoading: true,
      tableData: [],
      columns: [],
      // 查看详情需要的参数
      detailInfo: {},
      detailTitle: '',
      // 操作按钮过多时收起
      btnsFold: true,
      btnsFoldAble: false,
      // 搜索表单是否展示
      searchShow: false,
      queryData: {}
    }
  },
  methods: {
    // 点击表格的方法
    tableSelect (selection) {
      this.$emit('table-select', selection)
    },
    rowChange (row) {
      this.$emit('row-change', row)
    },
    // 表格中按钮操作方法
    showForm (control, row) {
      let forms = { ...control }
      forms.defaultData = forms.defaultData || {}
      forms.url = forms.urlPrimary ? (forms.url + '/' + row[forms.urlPrimary]) : forms.url
      if (forms.formNeed) {
        if (forms.formNeed === 'allRow') {
          forms.defaultData = row
        } else {
          forms.defaultData[forms.formNeed] = row[forms.primaryKey]
        }
      }
      this.forms = { ...forms }
    },
    sendHandle (control, row) {
      let forms = { ...control }
      let data = {}
      let mothod = forms.method || 'delete'
      let url = forms.urlPrimary ? (forms.url + '/' + row[forms.urlPrimary]) : forms.url
      ajax.request({
        url: url,
        userinfo: true,
        method: mothod,
        data: data
      }).then(res => {
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: control.title + '成功'
        })
        this.getTableData()
      })
    },
    // 查看详情
    detailShow (row) {
      this.detailInfo = row
      let titlePosition = this.hideItem.titlePosition || 'name'
      this.detailTitle = row[titlePosition]
      this.$refs.detailModal.modalShow = true
    },
    // 跳页
    toPage (page) {
      this.page = page
      this.getTableData()
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      let data = {
        page: this.page
      }
      if (this.config.extraParams) {
        Object.assign(data, this.config.extraParams)
      }
      Object.assign(data, this.queryData)
      let url = this.config.url
      if (this.config.extraUrl) {
        url += '/' + this.config.extraUrl
      }
      let method = this.config.method || 'get'
      let userinfo = this.config.userinfo
      ajax.request({
        url: url,
        method: method,
        userinfo: userinfo,
        params: data,
        data: data
      }).then(res => {
        let dataPosition = this.config.dataPosition || 'result.list'
        let list = means.getKeyValue(dataPosition, res)
        // 分页时需要
        if (this.config.paging) {
          let pagePosition = this.pagingConfig.pagePosition || 'result.meta'
          let pageData = means.getKeyValue(pagePosition, res)
          let total = this.pagingConfig.total ? pageData[this.pagingConfig.total] : pageData.total
          let pageSize = this.pagingConfig.pageSize ? pageData[this.pagingConfig.pageSize] : pageData.per_page
          this.pageData = {
            total: parseInt(total),
            pageSize: parseInt(pageSize)
          }
        }
        if (this.config.dataChange) {
          list.map(item => {
            item[this.config.dataChange.changeTo] = this.config.dataChange.changeMap[item[this.config.dataChange.value]]
          })
        }
        this.tableData = list
        this.tableLoading = false
        if (this.config.highlight) {
          this.$refs.table.setCurrentRow(this.tableData[0])
        }
      })
    },
    // 搜索
    screening (queryData) {
      this.page = 1
      let data = {}
      Object.keys(queryData).forEach((key) => {
        data[key] = queryData[key].value
      })
      this.queryData = data
      this.getTableData()
    },
    searchShowChange (searchShow) {
      this.searchShow = searchShow
    },
    showColumnsChange (showColumns) {
      let columns = []
      for (let i in this.showItem) {
        for (let j in showColumns) {
          if (this.showItem[i].value === showColumns[j]) {
            columns.push(this.showItem[i])
            break
          }
        }
      }
      this.columns = columns
    }
  },
  computed: {
    hasDetail () {
      return this.hideItem && this.hideItem.itemList && this.hideItem.itemList.length > 0
    },
    powerList () {
      let _this = this
      let list = _this.showControlList
      let btns = []
      list.map(item => {
        if (!item.fold || !_this.btnsFold) {
          btns.push(item.auth)
        }
      })
      return btns
    },
    showControlList () {
      let _this = this
      let controls = this.controls
      let list = []
      for (let i in controls) {
        if (controls[i].fold) {
          _this.btnsFoldAble = true
        }
        if (controls[i].selection === 'none') {
          continue
        }
        list.push(controls[i])
      }
      return list
    },
    // 表格中是否展示checkbox
    isBatch () {
      let controls = this.controls
      for (let i in controls) {
        if (['multiple', 'none'].indexOf(controls[i].selection) > -1 && controls[i].type === 'handle') {
          return true
        }
      }
      return false
    },
    // 是否展示搜索按钮
    searchAllow () {
      return this.searchs.length > 0
    },
    pagingConfig () {
      return this.config.pagingConfig || {}
    }
  },
  watch: {
    config: {
      handler (config) {
        if (config.url) {
          this.page = 1
          this.getTableData()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
