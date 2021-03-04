<style lang="less" scoped>
  @import "./home.css";
  .echarts-bottom{
    margin-top: .4rem;
  }
</style>
<template>
  <div class="t_container">
    <header class="t_header">
      <span>概览</span>
    </header>
    <main class="t_main">
      <Row :gutter="20">
        <Col span="6">
          <div class="t_left_box">
            <img class="t_l_line" src="../../../assets/images/left_line.png" alt="">
            <div class="t_mbox t_rbox">
              <i></i>
              <span>工会数</span>
              <h2>{{ numberData.organization_num }}</h2>
            </div>
            <div class="t_mbox t_gbox">
              <i></i>
              <span>单位数</span>
              <h2>{{ numberData.company_num }}</h2>
            </div>
            <div class="t_mbox t_ybox">
              <i></i>
              <span>会员数</span>
              <h2>{{ numberData.staff_num }}</h2>
            </div>
            <img class="t_r_line" src="../../../assets/images/right_line.png" alt="">
          </div>
        </Col>
        <Col span="10">
          <div class="t_center_box">
            <div class="t_top_box">
              <img class="t_l_line" src="../../../assets/images/left_line.png" alt="">
              <ul class="t_nav">
                <li>
                  <span>用户数</span>
                  <h1>{{ numberData.user_num }}</h1>
                  <i></i>
                </li>
                <li>
                  <span>微信关注数</span>
                  <h1>{{ numberData.wechat_user_num }}</h1>
                  <i></i>
                </li>
                <li>
                  <span>关注占比</span>
                  <h1>{{ focusProportion }}</h1>
                </li>
              </ul>
              <img class="t_r_line" src="../../../assets/images/right_line.png" alt="">
            </div>
            <div class="t_bottom_box" style="font-size: 14px; color: #fff; padding: 10px 20px;">
              <img class="t_l_line" src="../../../assets/images/left_line.png" alt="">
              <div style="font-size: 15px;line-height: 20px;padding-top: 10px;">
                近期加入会员
              </div>
              <div style="width: 100%; box-sizing: border-box; height: 200px;padding-top:30px;">
                <div class="swiper-container" style="height: 100%;">
                  <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(recent, recentIndex) in nearestApplications" :key="recentIndex">
                    <span style="display: inline-block;width: 20%; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                      {{ recent.name }}
                    </span>
                      <span style="display: inline-block;width: 50%; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                        {{ recent.company_name }}
                      </span>
                      <span style="width: 30%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align: right">
                      {{ recent.join_time }}
                    </span>
                      <div class="clear"></div>
                    </div>
                  </div>
                </div>
              </div>
              <img class="t_r_line" src="../../../assets/images/right_line.png" alt="">
            </div>
          </div>
        </Col>
        <Col span="8">
          <div class="t_right_box">
            <img class="t_l_line" src="../../../assets/images/left_line.png" alt="">
            <h1 style="font-size: 15px;top: 20px; left: 20px" class="t_title">会员数量前五</h1>
            <table class="t_table" style="font-size: 15px;height: 70%;">
              <thead>
              <tr>
                <th>序号</th>
                <th>工会名称</th>
                <th>会员数</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(ff, ffIndex) in vanguard" :key="ffIndex">
                <td>
                  {{ ffIndex + 1 }}
                </td>
                <td>
                  {{ ff.name }}
                </td>
                <td>
                  {{ ff.staff_number }}
                </td>
              </tr >
              </tbody>
            </table>
            <img class="t_r_line" src="../../../assets/images/right_line.png" alt="">
          </div>
        </Col>
        <Col class="bottom-three-col" span="8">
          <div class="b_left_box">
            <img class="t_l_line" src="../../../assets/images/left_line.png" alt="">
            <div id="chart_1" class="echart" style="width: 100%; height: 100%;"></div>
            <img class="t_r_line" src="../../../assets/images/right_line.png" alt="">
          </div>
        </Col>
        <Col class="bottom-three-col" span="8">
          <div class="b_left_box">
            <img class="t_l_line" src="../../../assets/images/left_line.png" alt="">
            <div id="chart_2" class="echart" style="width: 100%; height: 100%;"></div>
            <img class="t_r_line" src="../../../assets/images/right_line.png" alt="">
          </div>
        </Col>
        <Col class="bottom-three-col" span="8">
          <div class="b_center_box">
            <img class="t_l_line" src="../../../assets/images/left_line.png" alt="">
            <div id="chart_3" class="echart" style="width: 100%; height: 100%;"></div>
            <img class="t_r_line" src="../../../assets/images/right_line.png" alt="">
          </div>
        </Col>
        <div>
          <!--<Col class="bottom-three-col" span="8">-->
            <!--<div class="b_right_box">-->
              <!--<img class="t_l_line" src="../../../assets/images/left_line.png" alt="">-->
              <!--<div style="position: absolute;left: 0;right: 20px;top: 0;bottom: 0;padding: 0 15px;">-->
                <!--<div style="font-size: 15px; color: #fff; line-height: 40px;">-->
                  <!--困难职工数-->
                  <!--<span style="font-size: 24px; color: #F0FF00;font-weight: 600;">-->
              <!--{{ numberData.difficult_all_num }}-->
            <!--</span>-->
                <!--</div>-->
                <!--<div style="height: calc(4rem - 50px);">-->
                  <!--<div id="chart_1" class="echart" style="width: 100%; height: 100%;"></div>-->
                <!--</div>-->
              <!--</div>-->
              <!--<img class="t_r_line" src="../../../assets/images/right_line.png" alt="">-->
            <!--</div>-->
          <!--</Col>-->
        </div>
      </Row>
    </main>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import $ from 'jquery'
import '../../../../node_modules/echarts/map/js/province/tianjin.js'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
import ajax from '@/libs/ajax'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar
  },
  data () {
    return {
      // 最近的会员申请
      nearestApplications: [],
      // 会员数前五的工会
      vanguard: [],
      // 相关数字统计信息
      numberData: {},
      interval: ''
    }
  },
  methods: {
    // 获取去最新入会的职工列表
    getStaffNearest () {
      let _this = this
      ajax.get({
        url: 'overview/staff/nearest_applications',
        userinfo: true
      }).then(res => {
        let list = res.result
        if (list.length > 0) {
          for (let i = 0; i < 6; i++) {
            if (list.length > 5) {
              break
            }
            list = list.concat(list)
          }
        }
        _this.nearestApplications = list
        setTimeout(() => {
          _this.swiperInit()
        }, 300)
      })
    },
    // 获取职工数前五的工会
    getVanguard () {
      let _this = this
      ajax.get({
        url: 'overview/organization/members_max',
        userinfo: true
      }).then(res => {
        _this.vanguard = res.result
      })
    },
    // 获取相关数字统计信息
    getNumberData () {
      ajax.get({
        url: 'overview/number_data',
        userinfo: true
      }).then((res) => {
        this.numberData = res.result
      })
    },
    getMemberTrend () {
      ajax.get({
        url: 'overview/day_summary',
        userinfo: true
      }).then((res) => {
        this.echart1(res.result)
      })
    },
    getReceive () {
      ajax.get({
        url: 'overview/ticket/receive_chart',
        userinfo: true
      }).then((res) => {
        this.echart2(res.result)
      })
    },
    getVerification () {
      ajax.get({
        url: 'overview/ticket/use_chart',
        userinfo: true
      }).then((res) => {
        this.echart3(res.result)
      })
    },
    // 获取数据
    getData () {
      this.getStaffNearest()
      this.getVanguard()
      this.getNumberData()
      this.getReceive()
      this.getVerification()
      this.getMemberTrend()
    },
    // 职工日汇总
    echart1 (options) {
      let myChart = this.$echarts.init(document.getElementById('chart_1'))
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(options)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 福利券领取情况折线图
    echart2 (options) {
      let myChart = this.$echarts.init(document.getElementById('chart_2'))
      myChart.setOption(options)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 福利券核销情况折线图
    echart3 (options) {
      let myChart = this.$echarts.init(document.getElementById('chart_3'))
      myChart.setOption(options)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    swiperInit () {
      new Swiper('.swiper-container', {
        loop: true,
        direction: 'vertical',
        slidesPerView : 6,
        speed: 1000,
        autoplay: {
          delay: 0,
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        allowTouchMove: false
      })
    },
    // 检查数据是否已经返回了
    checkData () {
      return false
    }
  },
  mounted () {
    this.getData()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  created () {
    $(function () {
      let whdef = 100 / 1920 // 表示1920的设计图,使用100PX的默认值
      let wW = window.innerWidth // 当前窗口的宽度
      let rem = wW * whdef // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
      $('html').css('font-size', rem + 'px')
    })
    $(window).resize(function () { // 绑定到窗口的这个事件中
      let whdef = 100 / 1920 // 表示1920的设计图,使用100PX的默认值
      let wW = window.innerWidth // 当前窗口的宽度
      let rem = wW * whdef // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
      $('html').css('font-size', rem + 'px')
    })
  },
  computed: {
    focusProportion () {
      if (this.numberData.wechat_user_num === undefined) {
        return '--'
      }
      return Math.round(this.numberData.wechat_user_num / this.numberData.user_num * 100) + '%'
    }
  }
}
</script>
