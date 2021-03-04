<style scoped lang="less">
  *{
    margin: 0;
  }
  .welfare{
    padding: 15px;
    font-size: 15px;
    .add-principal{
      width: 100%;
    }
    .welfare-list{
      .welfare-item{
        box-sizing: border-box;
        padding-top: 15px;
        .welfare-father{
          border-radius: 10px;
          background: #fff;
          padding: 0 15px;
          box-shadow: 0 10px 20px #efefef;
          box-sizing: border-box;
          position: relative;
          .half-circle{
            position: absolute;
            width: 20px;
            height: 20px;
            background: #F5F7F9;
            z-index: 11;
            border-radius: 50%;
            top: 70px;
          }
          .left-half{
            left: -10px;
          }
          .right-half{
            right: -10px;
          }
          .welfare-bg{
            position: absolute;
            right: 0;
            bottom: 0;
            img{
              display: block;
              width: 80px;
            }
          }
          .dashed-line{
            height: 1px;
            background-size: 15px 1px;
            background-repeat: repeat-x;
            left: 0;
            right: 0;
          }
          .father-dashed-line{
            position: absolute;
            top: 80px;
          }
          .top-half{
            padding: 10px 0;
            position: relative;
            position: relative;
            z-index: 10;
            .content{
              margin: 0 100px 0 30px;
              p{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 13px;
                color: #888;
              }
              .name{
                color: #666;
                font-size: 15px;
                font-weight: 600;
              }
            }
            .top-icon{
              width: 20px;
            }
            .operation-item{
              width: 50%;
              box-sizing: border-box;
              text-align: center;
              padding-right: 5px;
            }
          }
          .bottom-half{
            padding: 10px 0 10px 30px;
            font-size: 13px;
            color: #888;
            position: relative;
            z-index: 10;
            p{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .rule-icon{
              display: inline-block;
              width: 18px;
              height: 18px;
              cursor: pointer;
              transform: translateY(-2px);
              margin-left: 5px;
              vertical-align: middle;
              background-size: 100% 100%;
              background-image: url('../../assets/images/rules-icon.png');
            }
            .children-hide{
              cursor: pointer;
              margin-left: 10px;
              transition: .5s;
            }
            .children-show{
              transform: rotate(180deg);
            }
          }
          .welfare-children{
            background: #fff;
            position: absolute;
            top: 156px;
            left: 10px;
            right: 10px;
            padding: 0 15px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            z-index: 12;
            box-shadow: 0 10px 30px #eee;
            .children-item{
              padding-bottom: 10px;
            }
          }
        }
      }
    }
  }
</style>
<template>
  <div class="welfare">
    <div>
      <Button class="add-principal" type="success" @click="add" size="large" v-if="means.hasPermission('add_ticket')">新增福利券</Button>
    </div>
    <div v-if="ticketList.length < 1" style="font-size: 16px;text-align: center;padding-top: 150px;">
      暂无已启用的福利券
    </div>
    <div v-else>
      <div class="welfare-list">
        <Row :gutter="20">
          <Col class="welfare-item" :xs="24"  :sm="12" :md="12" :lg="8" v-for="(ticket, ticketIndex) in ticketList" :key="ticketIndex">
            <div class="welfare-father">
              <div class="welfare-bg">
                <img :src="ticket.background">
              </div>
              <div class="dashed-line father-dashed-line" :style="borderStyle(ticket.theme_color)"></div>
              <div class="half-circle left-half"></div>
              <div class="half-circle right-half"></div>
              <div class="top-half">
                <div class="fl">
                  <img class="top-icon" :src="ticket.icon">
                </div>
                <div class="fr" style="width: 60px; padding-top: 5px;">
                  <ul>
                    <li class="fl operation-item" v-if="means.hasPermission('receive_records')">
                      <el-tooltip content="查看领取记录" placement="top">
                        <Icon size="20" style="cursor: pointer" type="md-eye" :color="'rgb(' + ticket.theme_color + ')'" @click="lookRecords(ticket)"/>
                      </el-tooltip>
                    </li>
                    <li class="fl operation-item" v-if="means.hasPermission('edit_ticket')">
                      <el-tooltip content="编辑" placement="top">
                        <Icon size="20" style="cursor: pointer" type="ios-brush" :color="'rgb(' + ticket.theme_color + ')'" @click="edit(ticket)"/>
                      </el-tooltip>
                    </li>
                    <li class="fl operation-item" v-if="means.hasPermission('change_status_ticket')">
                      <Poptip
                        transfer
                        confirm
                        title="确认要停用吗?"
                        @on-ok="blockUp(ticket)"
                        ok-text="确定"
                        cancel-text="取消">
                        <el-tooltip content="停用" placement="top">
                          <Icon size="20" style="cursor: pointer" type="ios-alert" :color="'rgb(' + ticket.theme_color + ')'"/>
                        </el-tooltip>
                      </Poptip>
                    </li>
                    <li class="fl operation-item" v-if="means.hasPermission('delete_ticket') && !ticket.receive_num">
                      <Poptip
                        transfer
                        confirm
                        title="确认要删除吗?"
                        @on-ok="sendDel(ticket)"
                        ok-text="确定"
                        cancel-text="取消">
                        <el-tooltip content="删除" placement="top">
                          <Icon size="20" style="cursor: pointer" type="md-trash" :color="'rgb(' + ticket.theme_color + ')'"/>
                        </el-tooltip>
                      </Poptip>
                    </li>
                    <div class="clear"></div>
                  </ul>
                </div>
                <div class="content">
                  <p class="name">
                    {{ ticket.ticket_name }}
                  </p>
                  <p class="intro">
                    {{ ticket.intro }}
                  </p>
                  <p class="partner" style="height: 19px;">
                    <!--合作商: {{ ticket.cooperator.company_name }}-->
                  </p>
                </div>
                <div class="clear"></div>
              </div>
              <div class="bottom-half">
                <div style="margin-right: 70px;">
                  <p>
                    领取时间: {{ ticket.start_time }} ~ {{ ticket.end_time }}
                  </p>
                  <p class="receive-rule">
                    领取规则: {{ ticket.receive_number + '次/' + ticket.receive_cycle }}
                  </p>
                  <p>
                    已领取/已核销: {{ ticket.receive_num + '/' + ticket.used_num }}
                  </p>
                </div>
                <div style="position: absolute; right: 0; top: 40px;text-align: left;width: 60px;">
                  <el-popover
                    placement="top"
                    width="200">
                    <p style="text-align: center">使用规则</p>
                    <div v-html="ticket.use_rule"></div>
                    <i slot="reference" class="rule-icon" @click="childrenShow[ticket.id] = false"></i>
                  </el-popover>
                  <Icon v-if="ticket.child_tickets && ticket.child_tickets.length > 0" class="children-hide" :class="childrenShow[ticket.id] ? 'children-show' : ''" @click="childrenShow[ticket.id] = !childrenShow[ticket.id]" :color="'rgb(' + ticket.theme_color + ')'" type="ios-arrow-down" size="24"/>
                </div>
              </div>
              <ul v-if="childrenShow[ticket.id]" class="welfare-children">
                <li class="children-item" v-for="(child, childIndex) in ticket.child_tickets" :key="childIndex">
                  <div style="height: 10px;" v-if="childIndex === 0"></div>
                  <div class="dashed-line" style="margin-bottom: 10px;" v-if="childIndex !== 0" :style="borderStyle(ticket.theme_color)"></div>
                  <div class="fl">
                    <img style="display: block; width: 50px; height: 50px;" :src="child.image">
                  </div>
                  <div class="fr" style="line-height: 50px;">
                    X1
                  </div>
                  <div style="margin: 0 40px 0 60px; line-height: 25px;">
                    <p style="color: #666; font-weight: 600; font-size: 15px;">
                      {{ child.name }}
                    </p>
                    <p style="color: #999; font-size: 13px;">
                      {{ child.intro }}
                    </p>
                  </div>
                  <div class="clear"></div>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
      <paging v-model="page" :page-size="pageData.pageSize" :total="pageData.total" @on-change="toPage"></paging>
    </div>
    <form-draw v-model="forms" @save-success="getTicketList"></form-draw>
  </div>
</template>

<script>
import formDraw from './form-draw.vue'
import ajax from '@/libs/ajax'
import means from '@/libs/means'
import paging from '@/components/data-hidden/paging'

export default {
  name: 'newWelfare',
  components: {
    'form-draw': formDraw,
    paging
  },
  data () {
    return {
      means: means,
      // 福利券数据
      ticketList: [],
      childrenShow: {},
      // 添加和编辑的表单
      forms: {},
      classify: [{
        title: '福利券信息',
        showCase: 'ticketCase',
        defaultCase: true,
        formItems: [{
          value: 'cooperator_ids',
          label: '合作商',
          type: 'selectMutli',
          config: {
            url: 'cooperators/all',
            valuePosition: ['result'],
            valueKey: 'id',
            labelKey: 'company_name'
          },
          options: '合作商',
          rules: ['requiredArray']
        }, {
          value: 'ticket_name',
          label: '福利券名称',
          editAble: true,
          rules: ['required']
        }, {
          value: 'intro',
          label: '简介',
          placeholder: '请尽量保持在15个字以内',
          editAble: true,
          rules: ['required']
        }, {
          value: 'receive_cycle',
          label: '领取周期',
          editAble: true,
          type: 'select',
          options: '领取周期',
          rules: ['required']
        }, {
          value: 'receive_number',
          label: '每周期可领取次数',
          editAble: true,
          placeholder: '小于或等于0代表无限制',
          rules: ['required', 'number']
        }, {
          value: 'meanwhile_max',
          label: '同时可领取数量',
          editAble: true,
          placeholder: '小于或等于0代表无限制',
          rules: ['number']
        }, {
          value: 'receive_max',
          label: '最多可领取数量',
          editAble: true,
          placeholder: '小于或等于0代表无限制',
          rules: ['number']
        }, {
          value: 'theme_color',
          label: '主题色',
          placeholder: '请输入一个rgb值',
          editAble: true,
          rules: ['required']
        }, {
          value: 'releaseTime',
          label: '发放时间',
          type: 'daterange',
          groupBy: ['start_time', 'end_time'],
          editAble: true,
          format: 'yyyy/MM/dd',
          rules: ['requiredArray']
        }, {
          value: 'valid_days',
          label: '领取后的有效天数',
          editAble: true,
          explain: '-1表示当周有效, -2表示当月有效, -3表示当年有效, 0或-4以下 表示在领取的周期内有效',
          rules: ['required', 'number']
        }, {
          value: 'write_off_method',
          label: '核销方式',
          type: 'select',
          editAble: true,
          options: [{
            label: '商家后台核销',
            value: '商家后台核销'
          }, {
            label: '商家密码核销',
            value: '商家密码核销'
          }, {
            label: '用户核销',
            value: '用户核销'
          }],
          rules: ['required']
        }, {
          value: 'use_rule',
          label: '使用规则',
          type: 'textarea',
          row: 4,
          span: 24,
          editAble: true,
          rules: ['required']
        }, {
          value: 'icon',
          label: '券的图标',
          type: 'image',
          span: 12,
          editAble: true,
          rules: ['required'],
          attention: '(图标尺寸42 x 50)'
        }, {
          value: 'background',
          label: '券的背景图',
          type: 'image',
          span: 12,
          editAble: true,
          rules: ['required'],
          attention: '(背景图尺寸182 x 232)'
        }]
      }],
      // 分页器数据
      page: 1,
      pageData: {
        pageSize: 20,
        total: 0
      }
    }
  },
  methods: {
    // 获取福利券列表
    getTicketList () {
      let _this = this
      ajax.get({
        url: 'tickets',
        userinfo: true,
        params: {
          page: _this.page,
          status: '启用'
        }
      }).then(res => {
        _this.ticketList = res.result.list.map((item) => {
          item.cooperator_ids = item.cooperator_ids.split(',')
          return item
        })
        _this.pageData = {
          pageSize: parseInt(res.result.meta.per_page),
          total: parseInt(res.result.meta.total)
        }
      })
    },
    initShowChildren () {
      let _this = this
      let childrenShow = {}
      this.ticketList.map(item => {
        if (item.child_tickets) {
          childrenShow[item.id] = false
        }
      })
      _this.childrenShow = childrenShow
    },
    // 福利券操作按钮
    toPage (page) {
      this.page = page
      this.getTicketList()
    },
    add () {
      let forms = {}
      forms.url = 'ticket'
      forms.title = '新增福利券'
      forms.classify = [ ...this.classify ]
      this.forms = forms
    },
    edit (ticket) {
      let forms = {}
      forms.url = 'ticket/' + ticket.id
      forms.title = '编辑福利券'
      forms.method = 'patch'
      let classify = JSON.parse(JSON.stringify(this.classify))
      forms.classify = classify.map(classifyItem => {
        classifyItem.formItems = classifyItem.formItems.filter(item => {
          return item.editAble
        })
        return classifyItem
      })
      ticket.receive_number = ticket.receive_number + ''
      ticket.receive_max = ticket.receive_max + ''
      ticket.meanwhile_max = ticket.meanwhile_max + ''
      ticket.valid_days = ticket.valid_days + ''
      forms.defaultData = ticket
      this.forms = forms
    },
    blockUp (ticket) {
      let _this = this
      let url = 'ticket/change_status/' + ticket.id
      ajax.patch({
        url: url,
        userinfo: true
      }).then(res => {
        _this.getTicketList()
        _this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: res.result
        })
      })
    },
    sendDel (ticket) {
      let _this = this
      let url = 'ticket/' + ticket.id
      ajax.delete({
        url: url,
        userinfo: true
      }).then(res => {
        _this.getTicketList()
        _this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '删除成功'
        })
      })
    },
    // 查看记录
    lookRecords (ticket) {
      this.$emit('look-records', ticket)
    },
    // 设置虚线
    borderStyle (color) {
      let image = 'linear-gradient(to right, rgb(' + color + ') 0%, rgb(' + color + ') 50%, transparent 50%)'
      return {
        backgroundImage: image
      }
    }
  },
  created () {
    this.getTicketList()
  },
  watch: {
    ticketList: {
      handler () {
        this.initShowChildren()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
