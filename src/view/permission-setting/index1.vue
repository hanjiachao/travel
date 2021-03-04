<script src="../../mock/data/org-data.js"></script>
<template>
  <!--<permission-setting :permissions="permissions" @save="tt" :loading="loading"></permission-setting>-->
  <data-table></data-table>
</template>
<script>
// import permissionSetting from '../../components/permission-setting/index.vue'
import dataTable from '../../components/data-table/index.vue'
export default {
  name: 'index',
  compon   'data-table': dataTableents: {
    // 'permission-setting': permissionSetting

  },
  data () {
    return {
      loading: false,
      permissions: [{
        name: '用户管理',
        children: [{
          name: '添加'
        }, {
          name: '编辑'
        }, {
          name: '删除'
        }, {
          name: '重置密码'
        }]
      }, {
        name: '课程管3理',
        children: [
          {
            name: '课种管理',
            children: [{
              name: '添加1'
            }, {
              name: '编辑1'
            }, {
              name: '删除2'
            }]
          },
          {
            name: '课节管理',
            children: [{
              name: '添加3'
            }, {
              name: '编辑2'
            }, {
              name: '删除3'
            }]
          }
        ]
      }, {
        name: '用户管理1',
        children: [{
          name: 'f添加'
        }, {
          name: '编f辑'
        }, {
          name: '删f除'
        }, {
          name: '重置f密码'
        }]
      }, {
        name: '课程管理1',
        children: [
          {
            name: '课种管理1',
            children: [{
              name: 'dd添加1'
            }, {
              name: '编dd辑1'
            }, {
              name: 'dd删除2'
            }]
          },
          {
            name: '课节管理1',
            children: [{
              name: '添44加3'
            }, {
              name: '编2辑2'
            }, {
              name: '删除223'
            }]
          }
        ]
      }, {
        name: '用户管理2',
        children: [{
          name: '添33加'
        }, {
          name: '编333辑'
        }, {
          name: '删444除'
        }, {
          name: '重置44密码'
        }]
      }, {
        name: '课程管理2',
        children: [
          {
            name: '课种1管理2',
            children: [{
              name: '添1加1'
            }, {
              name: '编1辑1'
            }, {
              name: '删1除2'
            }]
          },
          {
            name: '课节管理2',
            children: [{
              name: '222'
            }, {
              name: '编辑212'
            }, {
              name: '删除2123'
            }]
          }
        ]
      }, {
        name: '用户管理3',
        children: [{
          name: '添加22'
        }, {
          name: '编辑s'
        }, {
          name: '删除212'
        }, {
          name: '重置密码212'
        }]
      }, {
        name: '课程管理',
        children: [
          {
            name: '课种管理3',
            children: [{
              name: '添加11'
            }, {
              name: '编辑11'
            }, {
              name: '删除21'
            }]
          },
          {
            name: '课节管理4',
            children: [{
              name: '添加31'
            }, {
              name: '编辑21'
            }, {
              name: '删除31'
            }]
          }
        ]
      }]
    }
  },
  methods: {
    tt (v) {
      this.loading = true
      console.log(222)
      console.log(v)
      let _this = this
      setTimeout(() => {
        _this.loading = false
      }, 1500)
    }
  }
}
</script>

<style scoped>

</style>
