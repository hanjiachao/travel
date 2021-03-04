<template>
  <div class="conts">
    <div class="tit">选择占座</div>
    <div class="top">
      <div class="fl form-label" :title="'交通方式'" style="width: 60px;line-height: 36px;text-align: right">交通方式</div>
      <div class="fr" style="width: calc(100% - 70px);height: 36px;display: flex;align-items: center">
        <RadioGroup v-model="type" @on-change="radioChange">
          <Radio label="飞机"></Radio>
          <Radio label="大巴"></Radio>
        </RadioGroup>
      </div>
      <div class="clear"></div>
    </div>
    <div class="calendar">
      <el-calendar v-model="value" @click.native="changeDate">
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <div style="height: 100%;width: 100%;" @click.stop="pick(data.day)">
            <p style="text-align: center;font-size: 18px;" :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(2).join('') }}
            </p>
            <p style="text-align: center;line-height: 20px;font-size: 16px;">{{dateList[data.day]}}</p>
          </div>
        </template>
      </el-calendar>
    </div>
    <el-dialog title="占座" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="占座日期" :label-width="formLabelWidth">
          <el-input v-model="form.date" autocomplete="off" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="航空公司" v-if="type === '飞机' && companyList.length > 0" :label-width="formLabelWidth">
          <el-radio-group v-model="form.ai_id" style="margin-top: 5px;">
            <el-radio v-for="(item,index) in companyList" :label="item.ai_id" :key="index"><span v-html="item.msg"></span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="占座数量" :label-width="formLabelWidth">
          <el-input v-model="form.number" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 10px;" @click="dialogFormVisible = false">取 消</el-button>
        <el-popconfirm
          title="是否确认占座，确认后不可取消。不确认系统自动保存两小时。超出两小时系统自动取消。"
          @onConfirm="ok"
          @onCancel="cancel"
        >
          <el-button type="primary" slot="reference">保 存</el-button>
        </el-popconfirm>
      </div>
      <p style="text-align:center;">提示：占位后两小时在"提交页"点击确认即可生效，超出两小时未确认系统自动取消。</p>
    </el-dialog>
  </div>
</template>

<script>

import ajax from '@/libs/ajax'
import means from '@/libs/means'

export default {
  name: 'index',
  data () {
    return {
      means: means,
      type: '飞机',
      value: new Date(),
      dateList: {},
      dialogFormVisible: false,
      formLabelWidth: '120px',
      companyList: [],
      form: {}
    }
  },
  methods: {
    //获取座位列表
    getList () {
      ajax.post({
        url: '/Api/Seat/getCalendarList',
        userinfo: true,
        data: {
          type: this.type,
          year: this.value.getFullYear(),
          month: (this.value.getMonth() + 1 < 10) ? '0' + (this.value.getMonth() + 1) : this.value.getMonth() + 1,
        }
      }).then((res) => {
        var list = {}
        for (var i in res.result.list) {
            list[res.result.list[i].date] = '总' + res.result.list[i].count + '剩' +  res.result.list[i].number
        }
        this.dateList = list
      })
    },
    //获取航空公司座位数量
    getAirlineSeatList (date) {
        ajax.post({
            url: '/Api/Seat/getAirlineSeatList',
            userinfo: true,
            data: {
                date: date
            }
        }).then((res) => {
            var list = []
            for(var i in res.result.list){
                list.push({
                    label: res.result.list[i].ai_name,
                    ai_id: res.result.list[i].ai_id,
                    msg: res.result.list[i].ai_name + '<span style="margin-left: 20px;">可占位数量：</span>' + res.result.list[i].s_number
                })
            }
            this.companyList = list
        })
    },
    radioChange (e) {
      this.type = e
      this.getList()
    },
    pick (e) {
      if(means.hasPermission('ApplySeatOccupying')){
        this.dialogFormVisible = true
        this.form.date = e
        this.getAirlineSeatList(e)
      }
    },
    changeDate () {
      this.getList()
    },
    applySeatOccupying (status) {
        let data = this.form
        data.type = this.type
        data.status = status
          ajax.post({
              url: '/Api/Seat/applySeatOccupying',
              userinfo: true,
              data: data
          }).then((res) => {
              this.form = {}
          })
      },
    ok () {
      this.dialogFormVisible = false
      this.applySeatOccupying('确认')
    },
    cancel () {
      this.dialogFormVisible = false
      this.applySeatOccupying('取消')
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>
  .is-selected {
    color: #1989FA;
  }

  .conts {
    background: #fff;
    border-radius: 10px;
    margin: 20px;
  }

  .conts .tit {
    color: #000;
    font-weight: bold;
    font-size: 20px;
    padding: 40px;
    border-bottom: 1px solid #ccc;
  }

  .conts .top{
    padding: 40px;
  }
  .conts .calendar{
    padding: 20px;
  }
  .conts .calendar .el-calendar-day{
    text-align: center;
  }
</style>
