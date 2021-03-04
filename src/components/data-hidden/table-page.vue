<style scoped>
  .table-list >>> .ivu-btn{
    padding: 5px 10px 6px;
  }
  .prin-list >>> .ivu-btn{
    padding: 5px 10px 6px;
  }
  .table-list >>> .el-table__expanded-cell{
    padding: 20px 10px;
  }
  .card-body{
    padding: 15px;
  }
  .card-list >>> .ivu-card-body{
    padding: 0;
  }
  .card-title{
    color: #4C8BD5;
    font-size: 15px;
    cursor: pointer;
  }
  .card-title .title-icon{
    color: #666;
    float: right;
  }
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
<style scoped lang="less">
  .seacher-control{
    float: right;
    padding: 20px 0;
    .seacher-btn{
      margin-left: 10px;
    }
  }
</style>
<template>
  <div>
    <div class="table-list">
      <el-table :data="tableData"
                ref="table"
                style="width: 100%"
                border
                :tree-props="{children: config.childrenName || 'children', hasChildren: 'hasChildren'}"
                :row-key="config.primaryKey"
                :lazy="config.lazy ? true : false"
                :load="load"
                @selection-change="tableSelect"
                stripe>
        <el-table-column
          type="selection"
          align="center"
          v-if="isBatch"
          width="55">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in showItem"
          :align="(config.firstColumnLeft && index === 0) ? 'left' : (config.columnAlign || 'center')"
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
            <el-button type="text" @click="toogleExpand(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :fixed="config.btnsFixed"
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
                title="确认要操作吗?"
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
    <div style="float: right; padding: 10px 0;" v-if="config.pageData">
      <Page :current="page" :total="pageData.total" :page-size="pageData.pageSize" @on-change="toPage"></Page>
    </div>
    <div style="clear: both"></div>
    <form-modal v-model="forms" :config="config" @save-success="getTableData"></form-modal>
    <single-form v-model="singleForms" :config="config" @save-success="getTableData"></single-form>
    <detail-modal v-if="hasDetail" ref="detailModal" :data="detailInfo" :title="detailTitle" :hideItem="hideItem || {}"></detail-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formModal from './form-page.vue'
import controlPanel from './control-panel.vue'
import singleForm from '../data-table/form-modal.vue'
import detailModal from './detail-modal.vue'
export default {
  name: 'table-page',
  components: {
    'form-modal': formModal,
    'control-panel': controlPanel,
    'single-form': singleForm,
    'detail-modal': detailModal
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
    },
    queryData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      means: means,
      primaryKey: 0,
      forms: {},
      singleForms: {},
      // 分页
      page: 1,
      pageData: {
        total: 0,
        pageSize: 20
      },
      tableData: [],
      // 查看详情需要改变的参数
      detailInfo: {},
      detailTitle: '',
      // 操作按钮过多时收起
      btnsFold: true,
      btnsFoldAble: false
    }
  },
  methods: {
    tableSelect (selection) {
      this.$emit('table-select', selection)
    },
    load (tree, treeNode, resolve) {
      let url = ''
      url = this.config.lazy.lazyUrl || this.config.url
      url = this.config.lazy.lazyUrlPrimary ? url + '/' + tree[this.config.lazy.lazyUrlPrimary] : url
      let method = this.config.lazy.method || this.config.method || 'get'
      let dataPosition = this.config.lazy.lazyDataPosition || this.config.dataPosition || ['result']
      ajax.request({
        url: url,
        method: method,
        userinfo: true
      }).then(res => {
        let list = res
        for (let i in dataPosition) {
          list = list[dataPosition[i]]
        }
        resolve(list)
      })
    },
    showForm (control, row) {
      let forms = { ...control }
      forms.defaultData = forms.defaultData || {}
      forms.url = forms.urlPrimary ? forms.urlInitial + '/' + row[forms.urlPrimary] : forms.urlInitial
      if (forms.formNeed) {
        if (forms.formNeed === 'allRow') {
          forms.defaultData = row
        } else {
          forms.defaultData[forms.formNeed] = row[forms.primaryKey]
        }
      }
      if (forms.classifyCard) {
        this.forms = { ...forms }
      } else {
        this.singleForms = { ...forms }
      }
    },
    sendHandle (control, row) {
      let _this = this
      let forms = { ...control }
      let data = {}
      let url = forms.urlPrimary ? forms.urlInitial + '/' + row[forms.urlPrimary] : forms.urlInitial
      data[_this.config.primaryKey] = row[_this.config.primaryKey]
      ajax.post({
        url: url,
        userinfo: true,
        data: data
      }).then(res => {
      })
    },
    toogleExpand (row) {
      this.detailInfo = row
      this.detailTitle = this.config.detailTitle ? row[this.config.detailTitle] : row.name
      this.$refs.detailModal.modalShow = true
    },
    toPage (page) {
      this.page = page
      this.getTableData()
    },
    getTableData () {
      let data = {
        page: this.page
      }
      if (this.config.extraData) {
        Object.assign(data, this.config.extraData)
      }
      Object.assign(data, this.queryData)
      let _this = this
      let url = _this.config.url
      let method = _this.config.method || 'get'
      ajax.request({
        url: url,
        method: method,
        userinfo: true,
        params: data,
        data: data
      }).then(res => {
        let list = res
        let pageData = res
        let dataPosition = _this.config.dataPosition || ['result', 'list']
        for (let i in dataPosition) {
          list = list[dataPosition[i]]
        }
        if (_this.config.pageData) {
          let pageDataPosition = _this.config.pageData.pageDataPosition || ['result', 'meta']
          for (let i in pageDataPosition) {
            pageData = pageData[pageDataPosition[i]]
          }
          let total = _this.config.pageData.totalValue ? pageData[_this.config.pageData.totalValue] : pageData.total
          let pageSize = _this.config.pageData.pageSizeValue ? pageData[_this.config.pageData.pageSizeValue] : pageData.per_page
          _this.pageData = {
            total: parseInt(total),
            pageSize: parseInt(pageSize)
          }
        }
        _this.tableData = list
      })
    },
    checkWhere (where, data) {
      if (where && !this.means.checkWhere(where, data)) {
        return true
      }
      return true
    },
    screening (queryData) {
      this.page = 1
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
    isBatch () {
      let controls = this.controls
      for (let i in controls) {
        if (['multiple', 'none'].indexOf(controls[i].selection) > -1 && controls[i].type === 'handle') {
          return true
        }
      }
      return false
    }
  },
  watch: {
    config: {
      handler () {
        if (this.config.url) {
          this.page = 1
          this.getTableData()
        }
      },
      deep: true,
      immediate: true
    },
    queryData: {
      handler () {
        this.page = 1
        this.getTableData()
      }
    }
  }
}
</script>
