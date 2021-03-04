<style scoped>
  .modal-box >>> .ivu-btn-text{
    display: none;
  }
  .modal-box >>> .ivu-modal-body{
    height: 300px;
    overflow-y: auto;
  }
  .modal-box >>> ul,li{
    list-style: none;
  }
  .members-list >>> .el-table__expanded-cell{
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
</style>
<style>
  .members-list .ivu-btn{
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
<template>
  <div style="padding: 10px;">
    <div class="seacher-box" v-if="seacherBox">
      <div style="width: 50%">
        <Input v-model="skey" size="large" placeholder="查询" />
      </div>
      <div class="seacher-control">
        <Button class="seacher-btn" @click="query" type="primary">查询</Button>
        <Button class="seacher-btn" @click="empty" type="default">清空</Button>
      </div>
      <div style="clear: both"></div>
    </div>
    <!--<div>-->
      <!--<div  style="float: right;padding-bottom: 10px;">-->
        <!--<Button icon="ios-search" @click="seacherBox = !seacherBox" :type="seacherBox?'primary':'default'"></Button>-->
      <!--</div>-->
    <!--</div>-->
    <div class="members-list">
      <el-table
        :data="tableData"
        ref="table"
        style="width: 100%"
        border
        stripe>
        <el-table-column
          v-for="(item, index) in showItem"
          align="center"
          :key="index"
          show-overflow-tooltip
          :label="paramsMap[item]"
          :prop="item">
        </el-table-column>
        <el-table-column
          align="center"
          label="登记表">
          <template slot-scope="scope">
            <el-button type="text" @click="toogleExpand(scope.row)">查看登记表</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="申报材料">
          <template slot-scope="scope">
            <el-button type="text" @click="lookMaterail(scope.row)">查看申报材料</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <!--v-if="means.hasPermission('Staff/quit')"-->
            <el-tooltip content="查看记录" placement="top">
              <Button style="margin: 0 3px" @click="record(scope.row)">
                <Icon type="ios-eye" />
              </Button>
            </el-tooltip>
            <Poptip
              transfer
              confirm
              title="确认要删除吗?"
              @on-ok="delete(scope.row)"
              ok-text="确定"
              cancel-text="取消">
              <el-tooltip content="删除" placement="top">
                <Button style="margin: 0 3px" :disabled="scope.row.status === '离职'">
                  <Icon type="md-trash"></Icon>
                </Button>
              </el-tooltip>
            </Poptip>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="1" class="test">
          <template slot-scope="props">
            <div class="card-list">
              <Card v-for="(cardItem, cardIndex) in hideItemForm" :key="cardIndex" style="margin-bottom: 10px;">
                <div slot="title" class="card-title" @click="showCase[cardItem.showCase] = !showCase[cardItem.showCase]">
                  {{ cardItem.title }}
                  <Icon v-if="showCase[cardItem.showCase]" class="title-icon" type="ios-arrow-down" />
                  <Icon v-else class="title-icon" type="ios-arrow-forward" />
                </div>
                <div v-show="showCase[cardItem.showCase]" class="card-body">
                  <el-form label-position="right" inline class="demo-table-expand">
                    <el-form-item label-width="100px" v-for="(item, index) in cardItem.formItems" :label="paramsMap[item] + ':'"  :key="index" v-if="props.row[item]">
                      <span>{{ props.row[item] }}</span>
                    </el-form-item>
                  </el-form>
                </div>
              </Card>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right; padding: 10px 0;">
      <Page :total="pageData.total" :page-size="pageData.pageSize" @on-change="toPage"></Page>
    </div>
    <div style="clear: both"></div>
    <Modal class="modal-box"
           v-model="imageClassifyShow"
           title="申报材料"
           :mask-closable="false">
      <ul v-if="imageClassify.length > 0">
        <li v-for="(classify, classIndex) in imageClassify" :key="classIndex">
          <p>
            {{ classify.name }}
          </p>
          <p>
            <img @click="bigImage(classify.name, classify.list, imageIndex)" style="width: 30px; height: 30px;padding: 5px 10px; cursor: pointer" v-for="(image, imageIndex) in classify.list" :src="image" :key="imageIndex">
          </p>
        </li>
      </ul>
    </Modal>
    <record-modal ref="modal" :config="{}"></record-modal>
    <image-modal ref="imageModal" :imageInfo="imageInfo"></image-modal>
  </div>
</template>

<script>
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import formDraw from './drawer.vue'
import recordModal from './registration-record-modal.vue'
import imageModal from './image-modal.vue'
export default {
  name: 'archive',
  components: {
    'form-draw': formDraw,
    'record-modal': recordModal,
    'image-modal': imageModal
  },
  data () {
    return {
      means: means,
      // form表单部分参数
      config: {},
      forms: {},
      imageInfo: {},
      imageClassifyShow: false,
      imageClassify: [],
      // table表格部分参数
      tableData: [],
      showItem: ['name', 'sex', 'mobile', 'status', 'auditTime'],
      hideItem: [
        {
          title: '个人基本信息',
          showCase: 'perinfo',
          defaultCase: true,
          formItems: ['name', 'sex', 'nation', 'education', 'birthday', 'idcard', 'home_address', 'mobile', 'email', 'other_mobile']
        },
        {
          title: '工作情况',
          showCase: 'materialCase',
          type: 'imageList',
          formItems: ['workPlace', 'income']
        }
      ],
      paramsMap: {
        name: '姓名',
        sex: '性别',
        mobile: '手机号',
        idcard: '身份证号',
        status: '审核状态',
        auditTime: '审核时间',
        rejectReason: '驳回原因',
        workPlace: '工作单位',
        income: '月工资',
        materail1: '材料一',
        materail2: '材料二',
        materail3: '材料三'
      },
      mustShow: [{
        keyName: 'auditTime',
        nullValue: '未提交审核或暂未审核完成'
      }],
      showCase: {},
      showCaseBak: {},
      // pager分页部分参数
      page: 1,
      pageData: {
        total: 0,
        pageSize: 20
      },
      // seacher搜索部分参数
      seacherBox: false,
      skey: ''
    }
  },
  methods: {
    // 分页方法
    toPage (page) {
      this.page = page
    },
    // table表格部分方法
    getTableData () {
      let tableData = [{
        id: 1,
        name: '任勇',
        sex: '男',
        mobile: '18804604790',
        idcard: '342623199508292314',
        auditTime: '2019-05-16',
        status: '审核通过',
        workPlace: '盘古科技',
        income: '5000',
        materail1: ['test', 'test', 'test'],
        materail2: ['test', 'test'],
        materail3: ['test', 'test', 'test']
      }, {
        id: 2,
        name: '黄振东',
        sex: '男',
        mobile: '13820140965',
        idcard: '34262319961105231X',
        status: '审核中',
        workPlace: '盘古科技',
        income: '5000',
        materail1: ['test', 'test', 'test'],
        materail2: ['test', 'test'],
        materail3: ['test', 'test', 'test']
      }, {
        id: 3,
        name: '李建东',
        sex: '男',
        mobile: '13820140965',
        idcard: '659001199201081879',
        auditTime: '2019-05-16',
        status: '驳回申请',
        workPlace: '盘古科技',
        income: '5000',
        materail1: ['test', 'test', 'test'],
        materail2: ['test', 'test'],
        materail3: ['test', 'test', 'test']
      }]
      let mustShow = [ ...this.mustShow ]
      tableData.map(dataItem => {
        mustShow.map(mustItem => {
          if (!dataItem[mustItem.keyName]) {
            dataItem[mustItem.keyName] = mustItem.nullValue
          }
        })
        return dataItem
      })
      this.tableData = [ ...tableData ]
    },
    toogleExpand (row) {
      let $table = this.$refs.table
      this.showCase = { ...this.showCaseBak }
      this.tableData.map((item) => {
        if (row.id !== item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    },
    lookMaterail (row) {
      let mapList = ['materail1', 'materail2', 'materail3']
      let imageClassify = []
      for (let i in mapList) {
        let classify = {
          name: this.paramsMap[mapList[i]],
          list: row[mapList[i]]
        }
        imageClassify.push(classify)
      }
      this.imageClassify = [ ...imageClassify ]
      this.imageClassifyShow = true
    },
    bigImage (title, list, index) {
      this.imageInfo = {
        title: title,
        list: list,
        index: index
      }
      this.$refs.imageModal.modalShow = true
    },
    // 按钮操作部分方法
    record (row) {
      this.$refs.modal.modalShow = true
    },
    delete (row) {
    },
    // form表单部分方法
    saveSuccess () {},
    // seacher搜索部分方法
    query () {
    },
    empty () {
    }
  },
  computed: {
    hideItemForm () {
      let _this = this
      let forms = _this.hideItem
      let showCase = {}
      forms.map(cardItem => {
        if (cardItem.defaultCase) {
          showCase[cardItem.showCase] = true
        } else {
          showCase[cardItem.showCase] = false
        }
        return cardItem
      })
      _this.showCase = { ...showCase }
      _this.showCaseBak = { ...showCase }
      return forms
    }
  },
  created () {
    this.getTableData()
  }
}
</script>

<style scoped>

</style>
