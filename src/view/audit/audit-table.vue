<style scoped>
  ul,li{
    list-style: none;
  }
  .table-list >>> .ivu-btn{
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
  .card-list >>> .ivu-card {
    margin-bottom: 10px;
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
  .material-list .material-item{
    padding: 10px 0;
  }
  .material-image-list{
    padding: 10px 0;
  }
  .material-image-list .material-image{
    padding: 0 5px;
    width: 100px;
    height: 100px;
  }
  .seacher-control{
    float: right;
    padding: 20px 0;
  }
  .seacher-control .seacher-btn{
    margin-left: 10px;
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
  .member-detail-box >>> .el-form-item__content{
    width: calc(100% - 160px);
  }
  .member-detail-box >>> .ivu-modal-body{
    height: 600px;
    overflow-y: auto;
  }
  .member-detail-box >>> .ivu-btn-text{
    display: none;
  }
</style>
<template>
  <div style="padding: 0 10px;">
    <div class="seacher-box" v-show="seacherBox" v-if="searchs.length > 0">
      <search-panel @screening="screening" :searchs="searchs"></search-panel>
    </div>
    <div style="padding-bottom: 10px" v-if="currentQuery.length > 0">
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
    <div style="padding-bottom: 10px;">
      <div class="fr" style="padding-left: 10px;">
        <Button type="primary" @click="getTableData">刷新</Button>
      </div>
      <div v-if="searchs.length > 0" class="fr">
        <Button icon="ios-search" @click="seacherBox = !seacherBox" :type="seacherBox?'primary':'default'"></Button>
      </div>
      <div class="fl">
        <RadioGroup v-model="currentStatus" type="button" @on-change="statusChange">
          <Radio label="审核中">审核中</Radio>
          <Radio label="通过">已通过</Radio>
          <Radio label="驳回">已驳回</Radio>
          <Radio label="全部">全部</Radio>
        </RadioGroup>
      </div>
      <div class="clear"></div>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
        ref="table"
        style="width: 100%"
        border
        v-loading="tableLoading"
        stripe>
        <el-table-column
          v-for="(item, index) in showItem"
          align="center"
          :key="index"
          show-overflow-tooltip
          :label="item.label"
          :prop="item.value">
        </el-table-column>
        <el-table-column
          align="center"
          v-if="hasDetail"
          label="详情">
          <template slot-scope="scope">
            <el-button type="text" @click="toogleExpand(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          v-if="auditInfo && means.operationAllow([auditInfo.auth])"
          :width="means.operationWidth([auditInfo.auth])">
          <template slot-scope="scope">
            <el-tooltip content="审核" v-if="means.hasPermission(auditInfo.auth)" placement="top">
              <Button :disabled="getStatus(scope.row, auditInfo.statusName, auditInfo.allowValue)" style="margin: 0 3px" @click="audit(scope.row)">
                <Icon type="md-checkbox-outline" />
              </Button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :total="pageData.total" v-model="page" :pageSize="pageData.pageSize" @on-change="toPage"></paging>
    <div style="clear: both"></div>
    <from-modal :config="{}" v-model="forms" @save-success="getTableData"></from-modal>
    <detail-modal v-if="hasDetail" :history="history" ref="detailModal" :data="detailInfo" :title="detailTitle" :hideItem="hideItem || {}"></detail-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import detailModal from './detail/detail-modal.vue'
import fromModal from '../../components/data-table/form-modal.vue'
import searchPanel from './search-panel.vue'
import paging from '@/components/data-hidden/paging'

export default {
  name: 'audit-table',
  components: {
    'detail-modal': detailModal,
    'from-modal': fromModal,
    'search-panel': searchPanel,
    paging
  },
  props: {
    searchs: {
      type: Array,
      default: () => []
    },
    showItem: {
      type: Array,
      default: () => []
    },
    hideItem: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      default: () => {}
    },
    auditInfo: {
      type: Object,
      default: () => {}
    },
    history: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      detailInfo: {},
      detailTitle: '',
      forms: {},
      means: means,
      // table表格部分参数
      tableData: [],
      currentStatus: '审核中',
      // pager分页部分参数
      page: 1,
      pageData: {
        total: 0,
        pageSize: 20
      },
      // seacher搜索部分参数
      seacherBox: false,
      queryData: {},
      tableLoading: false
    }
  },
  methods: {
    getStatus (row, statusName, allowValue) {
      statusName = statusName || 'audit_status'
      allowValue = allowValue || '审核中'
      if (allowValue instanceof Array && allowValue.length > 0) {
        for (let i in allowValue) {
          if (means.getKeyValue(statusName, row) === allowValue[i]) {
            return false
          }
        }
      } else if (means.getKeyValue(statusName, row) === allowValue) {
        return false
      }
      return true
    },
    // 分页方法
    toPage (page) {
      this.page = page
      this.getTableData()
    },
    screening (data) {
      this.page = 1
      let queryData = JSON.parse(JSON.stringify(data))
      this.queryData = queryData
      this.getTableData()
    },
    statusChange () {
      this.page = 1
      this.getTableData()
    },
    // table表格部分方法
    getTableData () {
      let _this = this
      this.detailInfo = {}
      this.tableLoading = true
      let data = {}
      let queryData = this.queryData
      Object.keys(queryData).forEach((key) => {
        data[key] = queryData[key].value
      })
      if (this.config.extraData) {
        for (let i in this.config.extraData) {
          data[this.config.extraData[i].valueName] = this.config.extraData[i].value
        }
      }
      data.page = this.page
      data.status = this.currentStatus
      let url = this.config.url
      ajax.get({
        url: url,
        timeout: 10000,
        params: data,
        userinfo: true
      }).then(res => {
        let list = res
        let dataPosition = _this.config.dataPosition || ['result', 'list']
        for (let i in dataPosition) {
          list = list[dataPosition[i]]
        }
        _this.pageData = {
          total: parseInt(res.result.meta.total),
          pageSize: parseInt(res.result.meta.per_page)
        }
        _this.tableData = list
        this.tableLoading = false
      })
    },
    toogleExpand (row) {
      if (this.detailUrl) {
      } else {
        this.detailInfo = row
        let namePosition = this.config.namePosition || 'name'
        this.detailTitle = means.getKeyValue(namePosition, row)
        this.$refs.detailModal.modalShow = true
      }
    },
    // 按钮操作部分方法
    audit (data) {
      let forms = {}
      forms.formItems = [{
        type: 'radio',
        label: '审核结果',
        name: 'result',
        options: [{
          label: '通过',
          value: '通过'
        }, {
          label: '驳回',
          value: '驳回'
        }],
        rules: ['required']
      }, {
        type: 'textarea',
        label: '审核意见',
        placeholder: '若驳回，则该项必填',
        name: 'opinion',
        requiredOn: [{
          value: '驳回',
          valueName: 'result'
        }]
      }]
      forms.method = this.auditInfo.method || 'post'
      forms.url = this.auditInfo.url + '/' + data.id
      forms.title = this.auditInfo.title
      this.forms = { ...forms }
    }
    // seacher搜索部分方法
  },
  computed: {
    hasDetail () {
      return this.hideItem && this.hideItem.itemList && this.hideItem.itemList.length > 0
    },
    currentQuery () {
      let queryData = this.queryData
      let currentQuery = []
      let index = 0
      Object.keys(queryData).forEach((key) => {
        currentQuery[index] = {
          value: queryData[key].value,
          label: queryData[key].label
        }
        index++
      })
      return JSON.parse(JSON.stringify(currentQuery))
    },
    detailUrl () {
      return this.config.detailUrl || ''
    }
  },
  created () {
    this.getTableData()
  }
}
</script>
