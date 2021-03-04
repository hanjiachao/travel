<template>
  <div class="conts">
    <div class="tit">计调业绩</div>
    <div>
      <div class="top">
        <search-filter @screening="screening" :spanWidth="spanWidth" :searchs="searchs"></search-filter>
      </div>
    </div>
    <div id="chart_example"></div>
  </div>
</template>

<script>

import ajax from '@/libs/ajax'
import means from '@/libs/means'
import searchFilter from '../searchView/search-filter'
import $ from 'jquery'
import '../../../node_modules/echarts/map/js/province/tianjin.js'

export default {
  name: 'performance',
  components: {
    'search-filter': searchFilter,
  },
  data () {
    return {
      spanWidth: 24,
      means: means,
      // 筛选
      searchs: [
        {
          label: '日期',
          value: 'start_date',
          type: 'daterange'
        }
      ],
      searchShow: true,
      queryData: {},
      total: 0
    }
  },
  methods: {
    echart (x,y) {
      let this_ = this
      let myChart = this_.$echarts.init(document.getElementById('chart_example'))
      let option = {
        title: {
          text: `总利润（${this.total}元）`,
          left: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: x,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '总利润',
            type: 'bar',
            barWidth: '60%',
            data: y
          }
        ]
      }
      myChart.setOption(option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    getList() {
      let _this = this
      this.tableLoading = true
      let data = {}
      let queryData = this.queryData
      Object.keys(queryData).forEach((key) => {
        if (queryData[key].value  instanceof Array) {
          data[key] = JSON.stringify(queryData[key].value)
        }else {
          data[key] = queryData[key].value
        }
      })
      ajax.post({
        url: '/Api/PeopleStatistics/getOperatorList',
        userinfo: true,
        data: data
      }).then((res) => {
        var peopleList = []
        var numberList = []
        for (var i in res.result.list) {
          peopleList.push(res.result.list[i].ad_name)
          numberList.push(res.result.list[i].total_profit)
        }
        this.total = res.result.count_total_profit
        _this.echart(peopleList,numberList)
      })
    },
    screening (e) {
      this.page = 1
      this.queryData = e
      this.getList()
    },
  },
  mounted () {
    this.getList()
  }
}
</script>

<style scoped>
  .conts{
    background: #fff;
    border-radius: 10px;
    margin: 20px;

  }
  .conts .tit{
    color: #000;
    font-weight: bold;
    font-size: 20px;
    padding: 40px;
    border-bottom: 1px solid #ccc;
  }
  #chart_example{
    width: 100%;
    height: 500px;
    margin: 0 auto;
  }
</style>
