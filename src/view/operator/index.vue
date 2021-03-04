<template>
  <div style="margin: 20px">
    <div class="info">
      <Row :gutter="20">
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">门店</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <label>
              <Select v-model="info.group.tr_id" @on-change="checkGroupData" placement="bottom" clearable filterable>
                <Option v-for="item in groupList" :value="item.tr_id" :key="item.tr_id">{{ item.tr_name }}</Option>
              </Select>
            </label>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">门店负责人</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input v-model="info.headName" clearable placeholder="自动生成"></Input>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">联系方式</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input v-model="info.tel" clearable placeholder="自动生成"></Input>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">团号</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input v-model="info.groupNo" clearable placeholder="自动生成"></Input>
          </div>
        </Col>
      </Row>
      <Row :gutter="20">
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">旅游路线</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Select v-model="info.routes.l_id" clearable @on-change="getRoutes">
              <Option v-for="item in routeList" :value="item.l_id" :key="item.l_id">{{ item.l_name }}</Option>
            </Select>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">人数</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Row :gutter="10">
              <Col span="8">
                <div class="fl" style="width: calc(100% - 35px);">
                  <InputNumber style="width: 100%;" @on-change="adultChange" :min="0"
                               v-model="info.adult_number"></InputNumber>
                </div>
                <div class="fr" style="width: 30px;line-height: 36px;">成人</div>
              </Col>
              <Col span="8">
                <div class="fl" style="width: calc(100% - 35px);">
                  <InputNumber style="width: 100%;" @on-change="childrenChange" :min="0"
                               v-model="info.children_number"></InputNumber>
                </div>
                <div class="fr" style="width: 30px;line-height: 36px;">儿童</div>
              </Col>
              <Col span="8">
                <div class="fl" style="width: calc(100% - 35px);">
                  <InputNumber style="width: 100%;" :min="0" v-model="info.leader_number"></InputNumber>
                </div>
                <div class="fr" style="width: 30px;line-height: 36px;">领队</div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">出发日期</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <DatePicker style="width: 100%;" format="yyyy-MM-dd" :value="info.start" type="date" placement="bottom-end"
                        placeholder="请选择出发日期" @on-change="changeDate"></DatePicker>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">回程日期</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <DatePicker style="width: 100%;" format="yyyy-MM-dd" :value="info.end" @on-change="info.end = $event"
                        type="date" placement="bottom-end" placeholder="请选择回程日期"></DatePicker>
          </div>
        </Col>
      </Row>
      <Row :gutter="20">
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">计调</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input v-model="info.operator" clearable placeholder="自动生成"></Input>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">出发交通</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input v-model="info.depart" clearable placeholder="请输入出发交通方式"></Input>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">返回交通</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input v-model="info.backhaul" clearable placeholder="请输入返回交通方式"></Input>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">接站信息</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input v-model="info.podong" clearable placeholder="请输入接站信息"></Input>
          </div>
        </Col>
      </Row>
      <Row :gutter="20">
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">外联</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Select v-model="info.outreach.ad_id" clearable>
              <Option v-for="item in outreachList" :value="item.ad_id" :key="item.ad_id">{{ item.ad_name }}</Option>
            </Select>
          </div>
        </Col>
        <Col :xs="20" :sm="10" :md="8" :lg="6">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">是否结款</div>
          <div class="fr" style="width: calc(100% - 70px);height: 36px;display: flex;align-items: center;">
            <RadioGroup size="large" v-model="info.money">
              <Radio label="已结款"></Radio>
              <Radio label="未结款"></Radio>
            </RadioGroup>
          </div>
        </Col>
      </Row>
    </div>
    <div class="info">
      <div class="tit">行程内容</div>
      <div class="tab">
        <el-table :highlight-current-row="true"
                  :data="tablist"
                  class="tab-list"
                  border
                  fit
                  style="width: 100%;"
                  stripe
                  row-key="id"
                  v-loading="tableLoading">
          <el-table-column v-for="(item , index) in itemList"
                           :key="index"
                           :label="item.label"
                           align="center"
                           :width="item.width"
                           :prop="item.value"></el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px;">
        <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">服务标准</div>
        <div class="fr" style="width: calc(100% - 70px);">
          <Input v-model="info.standard" type="textarea" :rows="4" placeholder="请输入备注"/>
        </div>
        <div class="clear"></div>
      </div>
      <div style="margin-top: 20px;">
        <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">备注</div>
        <div class="fr" style="width: calc(100% - 70px);">
          <Input v-model="info.note" type="textarea" :rows="4" placeholder="请输入备注"/>
        </div>
        <div class="clear"></div>
      </div>
      <div style="margin-top: 20px;">
        <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">其他</div>
        <div class="fr" style="width: calc(100% - 70px);">
          <Input v-model="info.other" type="textarea" :rows="4" placeholder="请输入备注"/>
        </div>
        <div class="clear"></div>
      </div>
      <div style="margin-top: 20px;">
        <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">费用不含项</div>
        <div class="fr" style="width: calc(100% - 70px);">
          <Input v-model="info.exclusive" type="textarea" :rows="4" placeholder="请输入备注"/>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <div class="info">
      <div class="tit">客人信息</div>
      <div class="total" style="margin-top: 20px;">
        <Row :gutter="40">
          <Col :xs="20" :sm="10" :md="8" :lg="6">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">总人数</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Row :gutter="10">
                <Col span="8">
                  <div class="fl" style="width: calc(100% - 35px);">
                    <Input v-model="info.adult_number" disabled></Input>
                  </div>
                  <div class="fr" style="width: 30px;line-height: 36px;">成人</div>
                </Col>
                <Col span="8">
                  <div class="fl" style="width: calc(100% - 35px);">
                    <Input v-model="info.children_number" disabled></Input>
                  </div>
                  <div class="fr" style="width: 30px;line-height: 36px;">儿童</div>
                </Col>
                <Col span="8">
                  <div class="fl" style="width: calc(100% - 35px);">
                    <Input v-model="info.leader_number" disabled></Input>
                  </div>
                  <div class="fr" style="width: 30px;line-height: 36px;">领队</div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="6">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">合计金额</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input disabled v-model="info.amount"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="6">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">客人备注</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input placeholder="请填写说明" v-model="info.state"></Input>
            </div>
          </Col>
        </Row>
      </div>
      <div class="adult" v-if="info.adultList.length > 0">
        <div class="tit">成人信息</div>
        <Row :gutter="20" v-for="(item,index) in info.adultList" :key="index">
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">姓名<span
              v-if="index == '0'" style="color: #f00">*</span></div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_name" placeholder="请输入姓名"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">电话</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_mobile" placeholder="请输入电话"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">客源地</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_origin" placeholder="请输入客源地"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">证件号</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_card_number" placeholder="请输入证件号"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">保险</div>
            <div class="fr" style="width: calc(100% - 70px);height: 36px;display: flex;align-items: center;">
              <RadioGroup size="large" v-model="item.od_insure">
                <Radio label="是"></Radio>
                <Radio label="否"></Radio>
              </RadioGroup>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">年龄</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_age" type="number" placeholder="请输入年龄"></Input>
            </div>
          </Col>
        </Row>
        <div class="btm" style="margin-top: 20px;padding-top: 20px;border-top: 1px solid #999999;">
          <Row :gutter="20" class="fr">
            <Col :xs="20" :sm="10" :md="8" :lg="5">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">成本增加</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.adult.increase" @on-change="adultIncrease" placeholder="请输入增加成本"></Input>
              </div>
            </Col>
            <Col :xs="20" :sm="10" :md="8" :lg="5">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">备注</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.adult.remark" placeholder="请输入备注增加成本"></Input>
              </div>
            </Col>
            <Col :xs="20" :sm="10" :md="8" :lg="5">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">附加费用</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.adult.additional" @on-change="adultAdditional"
                       placeholder="请输入附加成本"></Input>
              </div>
            </Col>
            <Col :xs="20" :sm="10" :md="8" :lg="5">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">保险</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.adult.insurance" @on-change="adultInsurance" placeholder="请输入单价"></Input>
              </div>
            </Col>
            <Col :xs="20" :sm="10" :md="8" :lg="4">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">单价</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.adult.price" @on-change="adultPrice" placeholder="请输入单价"></Input>
              </div>
            </Col>
          </Row>
          <div class="clear"></div>
        </div>
        <div class="fr" style="margin-top: 20px;">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">总计</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input disabled v-model="info.adult.total" placeholder="自动生成"></Input>
          </div>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="children" v-if="info.childrenList.length > 0">
        <div class="tit">儿童信息</div>
        <Row :gutter="20" v-for="(item,index) in info.childrenList" :key="index">
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">姓名</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_name" placeholder="请输入姓名"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">电话</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_mobile" placeholder="请输入电话"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">客源地</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_origin" placeholder="请输入客源地"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">证件号</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_card_number" placeholder="请输入证件号"></Input>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">保险</div>
            <div class="fr" style="width: calc(100% - 70px);height: 36px;display: flex;align-items: center;">
              <RadioGroup size="large" v-model="item.od_insure">
                <Radio label="是"></Radio>
                <Radio label="否"></Radio>
              </RadioGroup>
            </div>
          </Col>
          <Col :xs="20" :sm="10" :md="8" :lg="4">
            <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">年龄</div>
            <div class="fr" style="width: calc(100% - 70px);">
              <Input clearable v-model="item.od_age" type="number" placeholder="请输入年龄"></Input>
            </div>
          </Col>
        </Row>
        <div class="btm" style="margin-top: 20px;padding-top: 20px;border-top: 1px solid #999999;">
          <Row :gutter="20" class="fr">
            <Col :xs="20" :sm="10" :md="8" :lg="6">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">成本增加</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.children.increase" @on-change="childrenIncrease"
                       placeholder="请输入增加成本"></Input>
              </div>
            </Col>
            <Col :xs="20" :sm="10" :md="8" :lg="6">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">备注</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.children.remark" placeholder="请输入备注增加成本"></Input>
              </div>
            </Col>
            <Col :xs="20" :sm="10" :md="8" :lg="6">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">保险</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.children.insurance" @on-change="childrenInsurance"
                       placeholder="请输入单价"></Input>
              </div>
            </Col>
            <Col :xs="20" :sm="10" :md="8" :lg="6">
              <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">单价</div>
              <div class="fr" style="width: calc(100% - 70px);">
                <Input clearable v-model="info.children.price" @on-change="childrenPrice" placeholder="请输入单价"></Input>
              </div>
            </Col>
          </Row>
          <div class="clear"></div>
        </div>
        <div class="fr" style="margin-top: 20px;">
          <div class="fl form-label" style="width: 60px;line-height: 36px;text-align: right">总计</div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input disabled v-model="info.children.total" placeholder="自动生成"></Input>
          </div>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
      </div>
      <div style="text-align: center;padding: 40px 0;" v-if="!means.getQueryString('detail')">
        <Button type="primary" @click="submit">保存</Button>
      </div>
      <div style="text-align: center;padding: 40px 0;" v-if="means.getQueryString('detail')">
        <Button style="margin: 0 20px" :loading="loading" type="primary" @click="downloadReceipt">下载《同行确认单》</Button>
        <Button style="margin: 0 20px" :loading="loading1" type="primary" @click="downloadConfirm">下载《出团通知单》</Button>
        <Button style="margin: 0 20px" :loading="loading2" type="primary" @click="downloadConfirm2">下载《地接确认单》</Button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import ajax from '@/libs/ajax'
import means from '@/libs/means'

export default {
  name: 'index',
  inject: ['reload'],
  data () {
    return {
      means: means,
      or_id: '',
      detail: '',
      info: {
        group: {
          tr_name: '',
          tr_id: ''
        },
        headName: '',
        tel: '',
        groupNo: '',
        routes: {
          l_name: '',
          l_id: ''
        },
        start: '',
        end: '',
        adult_number: 0,
        children_number: 0,
        leader_number: 0,
        outreach: {
          ad_id: '',
          ad_name: ''
        },
        adultList: [],
        childrenList: [],
        adult: {
          increase: '0',
          remark: '',
          additional: '0',
          insurance: '0',
          price: '0',
          total: '0'
        },
        children: {
          increase: '0',
          remark: '',
          insurance: '0',
          price: '0',
          total: '0'
        },
        operator: '',
        depart: '',
        backhaul: '',
        podong: '',
        money: '',
        standard: '',
        note: '',
        other: '',
        exclusive: '',
        amount: '',
        state: ''
      },
      groupList: [],
      routeList: [],
      outreachList: [],
      itemList: [
        {
          value: 'leave_time',
          label: '日期',
          width: '180'
        },
        {
          value: 'ld_traffic',
          label: '交通',
          width: '100'
        },
        {
          value: 'ld_trip',
          label: '行程',
          width: ''
        },
        {
          value: 'ld_morning',
          label: '早',
          width: '60'
        },
        {
          value: 'ld_in',
          label: '中',
          width: '60'
        },
        {
          value: 'ld_night',
          label: '晚',
          width: '60'
        },
        {
          value: 'ld_hotel',
          label: '酒店',
          width: '180'
        }
      ],
      tableLoading: false,
      loading: false,
      loading1: false,
      loading2: false,
      tablist: []
    }
  },
  methods: {
    // 选择组团社
    checkGroupData (val) {
      let data = this.groupList.filter(function (item) {
        return item.tr_id === val
      })
      this.info.headName = data[0].tr_people
      this.info.tel = data[0].tr_mobile
    },
    // 成人信息
    adultChange () {
      this.info.adultList = []
      for (var i = 0; i < this.info.adult_number; i++) {
        this.info.adultList.push({
          name: '',
          mobile: '',
          origin: '',
          card_number: '',
          insure: '',
          age: ''
        })
      }
    },
    // 儿童信息
    childrenChange () {
      this.info.childrenList = []
      for (var i = 0; i < this.info.children_number; i++) {
        this.info.childrenList.push({
          name: '',
          mobile: '',
          origin: '',
          card_number: '',
          insure: '',
          age: ''
        })
      }
    },
    //选择路线
    getRoutes () {
      this.createTeamNumber()
    },
    // 选择出发日期
    changeDate (val) {
      if (this.info.routes.l_id === '') {
        this.$Notice.error({
          title: '请先选择旅游路线',
          duration: 3
        })
        return false
      }
      this.info.start = val
      if (val) {
        this.getLineDetailList(val)
      }
    },
    // 获取订单详情
    getOrderDetail () {
      let _this = this
      ajax.post({
        url: '/Api/Order/getOrderDetail',
        userinfo: true,
        data: {
          or_id: _this.or_id
        }
      }).then(res => {
        _this.info.group.tr_id = res.result.list.tr_id
        _this.info.group.tr_name = res.result.list.tr_name
        _this.info.headName = res.result.list.tr_people
        _this.info.tel = res.result.list.tr_mobile
        _this.info.groupNo = res.result.list.or_team_number
        _this.info.money = res.result.list.or_status
        _this.info.routes.l_id = res.result.list.l_id
        _this.info.routes.l_name = res.result.list.l_name
        _this.info.adult_number = Number(res.result.list.or_adult_number)
        _this.info.children_number = Number(res.result.list.or_children_number)
        _this.info.leader_number = Number(res.result.list.or_leader_number)
        _this.info.start = res.result.list.or_departure_date
        _this.info.end = res.result.list.or_return_date
        _this.info.operator = res.result.list.or_adname
        _this.info.depart = res.result.list.or_departure_traffic
        _this.info.backhaul = res.result.list.or_departure_traffic
        _this.info.podong = res.result.list.or_receiving_information
        _this.info.outreach.ad_id = res.result.list.or_sale_adid
        _this.tablist = res.result.list.line
        _this.info.standard = res.result.list.or_serve_rule
        _this.info.note = res.result.list.or_remark
        _this.info.other = res.result.list.or_other
        _this.info.exclusive = res.result.list.or_cost
        _this.info.amount = res.result.list.or_total_price
        _this.info.state = res.result.list.or_guest_remark
        _this.info.adultList = res.result.list.adult
        _this.info.childrenList = res.result.list.children
        _this.info.adult.increase = res.result.list.or_adult_cost_up
        _this.info.adult.remark = res.result.list.or_adult_remark
        _this.info.adult.additional = res.result.list.or_adult_additional_cost
        _this.info.adult.insurance = res.result.list.or_adult_insure
        _this.info.adult.price = res.result.list.or_adult_unit_price
        _this.info.adult.total = res.result.list.or_adult_total_price
        _this.info.children.increase = res.result.list.or_children_cost_up
        _this.info.children.remark = res.result.list.or_children_remark
        _this.info.children.insurance = res.result.list.or_children_insure
        _this.info.children.price = res.result.list.or_children_unit_price
        _this.info.children.total = res.result.list.or_children_total_price
      })
    },
    // 获取旅行社
    getTravelAgencyAllList () {
      let _this = this
      ajax.post({
        url: '/Api/Travel/getTravelAgencyAllList',
        userinfo: true
      }).then(res => {
        _this.groupList = res.result.list
      })
    },
    // 获取人员列表
    getPeopleList () {
      let _this = this
      ajax.post({
        url: '/Api/Order/getPeopleList',
        userinfo: true,
        data: {
          role: '销售'
        }
      }).then(res => {
        _this.outreachList = res.result.list
      })
    },
    // 生成团号
    createTeamNumber () {
      let _this = this
      ajax.post({
        url: '/Api/Order/createTeamNumber',
        data: {
          l_id: _this.info.routes.l_id
        },
        userinfo: true
      }).then(res => {
        _this.info.groupNo = res.result.number
      })
    },
    // 获取线路
    getLineList () {
      let _this = this
      ajax.post({
        url: '/Api/Order/getLineList',
        userinfo: true
      }).then(res => {
        _this.routeList = res.result.list
      })
    },
    // 获取线路详情
    getLineDetailList (val) {
      let _this = this
      ajax.post({
        url: '/Api/Order/getLineDetailList',
        userinfo: true,
        data: {
          l_id: _this.info.routes.l_id,
          departure_date: val
        }
      }).then(res => {
        _this.tablist = res.result.list
        _this.info.end = res.result.list[res.result.list.length - 1].leave_time
      })
    },
    // 自动生成费用
    adultIncrease () {
      this.info.adult.total = Number(this.info.adult.increase) +
          Number(this.info.adult.additional) +
          Number(this.info.adult.insurance) +
          Number(this.info.adult.price) * this.info.adult_number
      this.info.amount = Number(this.info.adult.total) + Number(this.info.children.total)
    },
    adultAdditional () {
      this.info.adult.total = Number(this.info.adult.increase) +
          Number(this.info.adult.additional) +
          Number(this.info.adult.insurance) +
          Number(this.info.adult.price) * this.info.adult_number
      this.info.amount = Number(this.info.adult.total) + Number(this.info.children.total)
    },
    adultInsurance () {
      this.info.adult.total = Number(this.info.adult.increase) +
          Number(this.info.adult.additional) +
          Number(this.info.adult.insurance) +
          Number(this.info.adult.price) * this.info.adult_number
      this.info.amount = Number(this.info.adult.total) + Number(this.info.children.total)
    },
    adultPrice () {
      this.info.adult.total = Number(this.info.adult.increase) +
          Number(this.info.adult.additional) +
          Number(this.info.adult.insurance) +
          Number(this.info.adult.price) * this.info.adult_number
      this.info.amount = Number(this.info.adult.total) + Number(this.info.children.total)
    },
    childrenIncrease () {
      this.info.children.total = Number(this.info.children.increase) +
          Number(this.info.children.insurance) +
          Number(this.info.children.price) * this.info.children_number
      this.info.amount = Number(this.info.adult.total) + Number(this.info.children.total)
    },
    childrenInsurance () {
      this.info.children.total = Number(this.info.children.increase) +
          Number(this.info.children.insurance) +
          Number(this.info.children.price) * this.info.children_number
      this.info.amount = Number(this.info.adult.total) + Number(this.info.children.total)
    },
    childrenPrice () {
      this.info.children.total = Number(this.info.children.increase) +
          Number(this.info.children.insurance) +
          Number(this.info.children.price) * this.info.children_number
      this.info.amount = Number(this.info.adult.total) + Number(this.info.children.total)
    },

    // 提交订单信息
    submit () {
      let that = this
      let url = ''
      let data = {}
      data.tr_id = that.info.group.tr_id
      data.team_number = that.info.groupNo
      data.l_id = that.info.routes.l_id
      data.adult_number = that.info.adult_number
      data.children_number = that.info.children_number
      data.leader_number = that.info.leader_number
      data.departure_date = that.info.start
      data.return_date = that.info.end
      data.departure_traffic = that.info.depart
      data.return_traffic = that.info.backhaul
      data.receiving_information = that.info.podong
      data.sale_adid = that.info.outreach.ad_id
      data.status = that.info.money
      data.serve_rule = that.info.standard
      data.remark = that.info.note
      data.other = that.info.other
      data.cost = that.info.exclusive
      data.total_price = that.info.amount
      data.guest_remark = that.info.state
      data.adult_cost_up = that.info.adult.increase
      data.adult_remark = that.info.adult.remark
      data.adult_additional_cost = that.info.adult.additional
      data.adult_insure = that.info.adult.insurance
      data.adult_unit_price = that.info.adult.price
      data.adult_total_price = that.info.adult.total
      data.children_cost_up = that.info.children.increase
      data.children_remark = that.info.children.remark
      data.children_insure = that.info.children.insurance
      data.children_total_price = that.info.children.total
      data.children_unit_price = that.info.children.price
      data.adult = JSON.stringify(that.info.adultList)
      data.children = JSON.stringify(that.info.childrenList)
      if (this.or_id !== '') {
        url = '/Api/Order/saveOrder'
        data.or_id = that.or_id
      } else {
        url = '/Api/Order/addOrder'
      }
      console.log(data)
      ajax.post({
        url: url,
        userinfo: true,
        data: data
      }).then(res => {
        this.$Notice.success({
          title: '系统提示',
          duration: 3,
          desc: '提交成功'
        })
      })
    },

    // 下载回执单
    downloadReceipt () {
      let _this = this
      _this.loading = true
      ajax.get({
        url: '/Api/Order/downloadReceiptOrder',
        userinfo: true,
        exportFile: true,
        responseType: 'blob',
        params: {
          or_id: _this.or_id
        }
      }).then(res => {
        _this.loading = false
      })
    },
    // 下载确认件
    downloadConfirm () {
      let _this = this
      _this.loading1 = true
      ajax.get({
        url: '/Api/Order/downloadConfirmOrder',
        userinfo: true,
        exportFile: true,
        responseType: 'blob',
        params: {
          or_id: _this.or_id
        }
      }).then(res => {
        _this.loading1 = false
      })
    },
    // 下载确认件
    downloadConfirm2 () {
      let _this = this
      _this.loading2 = true
      ajax.get({
        url: '/Api/Order/downloadConnectOrder',
        userinfo: true,
        exportFile: true,
        responseType: 'blob',
        params: {
          or_id: _this.or_id
        }
      }).then(res => {
        _this.loading2 = false
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.fullPath !== from.fullPath) {
        this.reload()
      }
    }
  },
  created () {
    this.info.operator = store.state.admin.info.info.username
    this.getTravelAgencyAllList()
    this.getLineList()
    this.getPeopleList()
    this.or_id = means.getQueryString('or_id')

    this.detail = means.getQueryString('detail')
    if (this.or_id != '') {
      this.getOrderDetail()
    }
  }
}
</script>

<style scoped>
  .info {
    background: #ffffff;
    padding: 20px 10px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .info > .ivu-row {
    margin-top: 20px;
  }

  .info .adult > .ivu-row {
    margin-top: 20px;
  }

  .info .children > .ivu-row {
    margin-top: 20px;
  }

  .info .tab {
    margin-top: 30px;
  }

  .tit {
    color: #000;
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;
  }
</style>
