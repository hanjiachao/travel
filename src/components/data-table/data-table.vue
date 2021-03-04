<template>
  <div>
    <Table class="data-form" border :highlight-row="highlightRow" :data="data.tableData" @on-row-click="rowClick" :columns="tableColumns" stripe :loading="tableConfig.loading" @on-sort-change="orderData" @on-selection-change="selectionChange"></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="data.pageData.total" :page-size="data.pageData.pageSize" show-elevator show-total @on-change="toPage"></Page>
      </div>
    </div>
    <form-modal :config="config" v-model="formProps" @save-success="saveSuccess"></form-modal>
  </div>
</template>

<script>
import ajax from '../../libs/ajax'
import formModal from './form-modal.vue'
import means from '@/libs/means'
export default {
  name: 'data-table',
  components: {
    'form-modal': formModal
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    controls: {
      type: Array,
      default: () => []
    },
    showColumns: {
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
      canLoad: false,
      data: {
        tableData: [],
        pageData: {
          total: 0,
          pageSize: 20,
          currentPage: 1
        }
      },
      loadParams: {
        page: 1
      },
      formProps: {},
      tableConfig: {
        loading: false,
        page: 1
      },
      sendingItem: {
        index: -1,
        title: ''
      }
    }
  },
  methods: {
    rowClick (row, index) {
      this.$emit('row-click', row, index)
    },
    saveSuccess: function () {
      this.$emit('save-success')
    },
    getRender (renderType) {
      if (renderType === 'image') {
        return (h, params) => {
          return h('img', {
            style: {
              maxWidth: '50px',
              maxHeight: '40px'
            },
            attrs: {
              src: means.getKeyValue(params.column.key, params.row)
            }
          })
        }
      } else if (renderType === 'imageList') {
        return (h, params) => {
          return h('div', means.getKeyValue(params.column.key, params.row).map((item) => {
            return h('img', {
              style: {
                maxWidth: '30px',
                maxHeight: '40px',
                marginRight: '3px'
              },
              attrs: {
                src: item
              }
            })
          }))
        }
      } else if (renderType === 'join') {
        return (h, params) => {
          return h('div', params.column.key.split(', ').map((item) => {
            return means.getKeyValue(item, params.row)
          }).join(params.column.joinSymbol) || '')
        }
      } else if (renderType === 'array') {
        return (h, params) => {
          return h('div', means.getKeyValue(params.column.key, params.row).map((item) => {
            return h('span', {
              style: {
                padding: '0 5px'
              }
            }, item[params.column.arrayKey])
          }))
        }
      } else if (['date', 'datetime', 'time'].indexOf(renderType) > -1) {
        return (h, params) => {
          let row = means.getKeyValue(params.column.key, params.row)
          let index = ['date', 'datetime', 'time'].indexOf(renderType)
          let format = ['yyyy-MM-dd', 'yyyy-MM-dd hh:mm:ss', 'hh:mm:ss']
          row = new Date(isNaN(row) ? row : parseInt(row) * 1000)
          return h('span', row.Format(format[index]))
        }
      } else if (!renderType) {
        return (h, params) => {
          return h('span', means.getKeyValue(params.column.key, params.row))
        }
      }
    },
    getTableData () {
      let _this = this
      this.tableConfig.loading = true
      let method = this.config.method ? this.config.method : 'get'
      let params = { ...this.loadParams }
      ajax.request({
        url: this.config.url,
        method: method,
        params: params,
        userinfo: true,
        finishCallback () {
          _this.tableConfig.loading = false
        }
      }).then((res) => {
        let list = res.result.list
        _this.data.tableData = list
        _this.$emit('data-refresh')
        if (list.length > 0 && _this.highlightRow) {
          res.result.list[0]._highlight = true
          _this.rowClick(res.result.list[0], 0)
        }
        _this.data.pageData.total = res.result.meta.total
        _this.data.pageData.pageSize = res.result.meta.per_page
        if (page) {
          _this.tableConfig.page = page
        }
      }).catch((error) => {
        _this.data.pageData.currentPage = _this.tableConfig.page
        if (error.errorMessage) {
          _this.$Message.error(error.errorMessage)
        }
      })
    },
    orderData ({ column, key, order }) {
      if (order === 'normal') {
        this.delete('loadParams.orderBy')
        this.delete('loadParams.orderType')
      } else {
        this.$set(this.loadParams, 'orderBy', key)
        this.$set(this.loadParams, 'orderType', key)
      }
    },
    toPage (page) {
      this.$set(this.loadParams, 'page', page)
    },
    renderControls (h, param) {
      let buttons = []
      let _this = this
      for (let item of this.controls) {
        item = { ...item }
        if (item.selection === 'single' || item.selection === 'multiple') {
          let disabled = _this.sendingItem.index > -1
          if (item.where && !means.checkWhere(item.where, param.row)) {
            disabled = true
          }
          if (item.type === 'del' && !item.icon) {
            item.icon = 'md-trash'
          }
          let loading = _this.sendingItem.index === param.index && _this.sendingItem.title === item.title
          let buttonObj = {
            props: {
              type: item.style || (item.type === 'del' ? 'error' : 'default'),
              icon: item.icon,
              disabled: disabled && !loading,
              loading: loading
            },
            style: {
              marginRight: '5px'
            },
            on: {
              click (event) {
                _this.controlClick(item, param)
              }
            }
          }
          let button = h('Button', buttonObj, item.icon ? null : item.title)
          if (item.icon && item.type !== 'del' && item.type !== 'general') {
            button = h('Tooltip', {
              props: {
                content: item.title,
                placement: 'top'
              }
            }, [button])
          } else if (item.type === 'general') {
            button = h('span', {
              style: {
                display: 'inline-block',
                height: '100%'
              },
              on: {
                click (event) {
                  if (_this.sendingItem.index > -1) {
                    event.stopPropagation()
                  }
                }
              }
            }, [button])
            button = h('Poptip', {
              props: {
                title: '确认要操作?',
                placement: 'top',
                confirm: true,
                transfer: true
              },
              on: {
                'on-ok': function (event) {
                  _this.del(item, param)
                }
              }
            }, [button])
            button = h('Tooltip', {
              props: {
                content: item.title,
                placement: 'top'
              }
            }, [button])
          } else if (item.type === 'del') {
            button = h('span', {
              style: {
                display: 'inline-block',
                height: '100%'
              },
              on: {
                click (event) {
                  if (_this.sendingItem.index > -1) {
                    event.stopPropagation()
                  }
                }
              }
            }, [button])
            button = h('Poptip', {
              props: {
                title: '确认要操作?',
                placement: 'top',
                confirm: true,
                transfer: true
              },
              on: {
                'on-ok': function (event) {
                  _this.del(item, param)
                }
              }
            }, [button])
          }
          buttons.push(button)
        }
      }
      return h('div', {
        class: 'table-column-controls',
        on: {
          click (event) {
            event.stopPropagation()
          }
        }
      }, buttons)
    },
    del (item, param) {
      let _this = this
      this.sendingItem.title = item.title
      this.sendingItem.index = param.index
      let data = {}
      if (this.config.primaryKey) {
        data[this.config.primaryKey] = param.row[this.config.primaryKey]
      } else {
        data = {
          id: param.row.id
        }
      }
      ajax.post({
        url: item.url,
        userinfo: true,
        data: data
      }).then(res => {
        _this.getTableData()
        _this.sendingItem.title = ''
        _this.sendingItem.index = -1
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功'
        })
      }).catch((err) => {
        this.$Notice.error({
          title: '系统提示',
          duration: 3,
          desc: err.errorMessage
        })
      })
    },
    controlClick (item, param) {
      if (item.type === 'form') {
        let formProps = item
        if (item.selection === 'single') {
          formProps.defaultData = param.row
        } else if (item.selection === 'multiple') {
          formProps.defaultData = {
            [this.config.primaryKey]: [param.row[this.config.primaryKey]]
          }
        }
        this.formProps = { ...formProps }
      } else if (item.type === 'del' && this.sendingItem.index > -1) {
      }
    },
    selectionChange (selections) {
      this.$emit('on-selection-change', selections, this.controls)
    },
    mergeParams (params) {
      params = params || {}
      let loadParams = { ...this.loadParams }
      loadParams = Object.assign(loadParams, params)
      loadParams.page = 1
      this.$set(this, 'loadParams', { ...loadParams })
    }
  },
  computed: {
    tableColumns () {
      let _this = this
      let columns = this.columns.map(item => {
        item = { ...item }
        item.align = 'center'
        if (item.type || item.key.indexOf('.') > -1) {
          item.render = _this.getRender(item.type)
        }
        if (item.sortable) {
          item.sortable = 'custom'
        }
        if (_this.showColumns.indexOf(item.key) < 0) {
          return null
        }
        item.tooltip = true
        return item
      }).filter(item => {
        return item
      })
      columns.unshift({
        type: 'index',
        width: 60,
        align: 'center'
      })
      if (this.canMultiple) {
        columns.unshift({
          type: 'selection',
          width: 60,
          align: 'center'
        })
      }
      if (this.columnExistControl) {
        columns.push({
          title: '操作',
          align: 'center',
          render: this.renderControls
        })
      }
      return columns
    },
    canMultiple () {
      for (let item of this.controls) {
        if (item.selection === 'multiple') {
          return true
        }
      }
      return false
    },
    columnExistControl () {
      for (let item of this.controls) {
        if (item.selection === 'multiple' || item.selection === 'single') {
          return true
        }
      }
      return false
    },
    highlightRow () {
      return this.config.split ? true : false // eslint-disable-line
    }
  },
  watch: {
    config: {
      handler (value) {
        this.mergeParams(this.config.loadParams)
      },
      deep: true,
      immediate: true
    },
    loadParams: {
      handler (value) {
        if (this.config.foreignKey && !this.loadParams[this.config.foreignKey]) {
          return false
        }
        this.getTableData()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
  .img-preview >>> .ivu-modal-header{
    border-bottom: none;
  }
  .img-preview >>> .ivu-modal-footer{
    border-top: none;
  }
  .data-form >>> .table-column-controls .ivu-btn{
    padding: 2px 6px 1px;
  }
</style>
