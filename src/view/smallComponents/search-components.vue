<template>
  <div class="search-form">
    <div>
      <div style="float: left;" :style="{width: width}">
        <div v-for="(searchItem,searchIndex) in searchList" style="float: left;width: 300px;margin: 10px 0"
             :key="searchIndex">
          <div class="fl form-label" :title="searchItem.label" style="width: 60px;line-height: 36px;text-align: right">
            {{searchItem.label}}
          </div>
          <div class="fr" style="width: calc(100% - 70px);">
            <Input v-if="searchItem.type == 'input'" v-model="formData[searchItem.value]" clearable
                   :placeholder="'请输入' + searchItem.label"></Input>
            <DatePicker v-else-if="searchItem.type == 'date'" format="yyyy/MM/dd" v-model="formData[searchItem.value]"
                        type="date" placement="bottom-end" :placeholder="'请选择' + searchItem.label"></DatePicker>
            <DatePicker v-else-if="searchItem.type == 'date'" format="yyyy/MM/dd" v-model="formData[searchItem.value]"
                        type="date" placement="bottom-end" :placeholder="'请选择' + searchItem.label"></DatePicker>
            <Select v-else-if="searchItem.type == 'select'" v-model="formData[searchItem.value]" clearable>
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div v-else style="height: 36px;display: flex;align-items: center">
              <RadioGroup v-model="formData[searchItem.value]">
                <Radio v-for="i in searchItem.item" :key="i" :label="i"></Radio>
              </RadioGroup>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="fl" style="margin-left: 100px;margin-top: 10px;">
        <Button type="primary" :loading="loading" @click="searchClick">搜索</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div class="currentQuery" style="margin-top: 20px;" v-if="currentQuery.length > 0">
      <div style="color: #2D8CF0;padding-right: 10px;display: inline-block; font-weight: bold;">
        当前筛选条件
      </div>
      <Tag v-for="(query, queryIndex) in currentQuery" :key="queryIndex"
           style="line-height: 24px; color: #333;height: 25px;" color="primary" type="border">
        <span>
          {{query.label}}:
          {{ query.value }}
        </span>
      </Tag>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'search-components',
    props: {
      searchs: {
        type: Array,
        default: () => []
      },
      width: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        loading: false,
        cityList: [
          {
            value: 'New York',
            label: 'New York'
          },
          {
            value: 'London',
            label: 'London'
          },
          {
            value: 'Sydney',
            label: 'Sydney'
          },
          {
            value: 'Ottawa',
            label: 'Ottawa'
          },
          {
            value: 'Paris',
            label: 'Paris'
          },
          {
            value: 'Canberra',
            label: 'Canberra'
          }
        ],
        formData: {},
        labelList: {},
        currentQuery: []
      }
    },
    methods: {
      changeDate(t) {
        if (t === undefined || t === '') {
          return t
        }
        var date = new Date(t),
          Y = date.getFullYear() + '-',
          M = (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-',
          D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
        return Y + M + D
      },
      searchClick() {
        let list = {...this.formData}
        let labelList = {...this.labelList}
        let start = this.changeDate(list.start)
        let end = this.changeDate(list.end)
        list.start = start
        list.end = end
        let currentQuery = []
        Object.keys(list).forEach((key) => {
          if (list[key] !== '' && list[key] !== undefined) {
            currentQuery.push({
              value: list[key],
              label: labelList[key]
            })
          }
        })
        this.currentQuery = currentQuery
        this.$emit('screening', list)
      }
    },
    computed: {
      searchList() {
        let list = [...this.searchs]
        list.map(item => {
          this.labelList[item.value] = item.label
        })
        return list
      }
    }
  }
</script>

<style scoped>
  .search-form {
    margin: 20px;
    background: #fff;
    padding: 20px;
    min-width: 900px;
  }
</style>
