<style scoped>
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
  .detail-box >>> .ivu-modal-body{
    height: 600px;
    overflow-y: auto;
  }
  .detail-box >>> .ivu-btn-text {
    display: none;
  }
</style>
<template>
  <Modal class="detail-box" :mask-closable="false" width="800" v-model="modalShow" :title="title">
    <div class="card-list">
      <Card style="margin-bottom: 10px;">
        <div slot="title" class="card-title" @click="showCase.baseCase = !showCase.baseCase">
          基本信息
          <Icon v-if="showCase.baseCase" class="title-icon" type="ios-arrow-down" />
          <Icon v-else class="title-icon" type="ios-arrow-forward" />
        </div>
        <div v-show="showCase.baseCase" class="card-body">
          <el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label-width="100px" v-for="(item, index) in hideItem" :label="item.label + ':'"  :key="index">
              <span>{{ data[item.value] || '未填' }}</span>
            </el-form-item>
          </el-form>
        </div>
      </Card>
      <Card style="margin-bottom: 10px;">
        <div slot="title" class="card-title" @click="showCase.materialCase = !showCase.materialCase">
          申报材料
          <Icon v-if="showCase.materialCase" class="title-icon" type="ios-arrow-down" />
          <Icon v-else class="title-icon" type="ios-arrow-forward" />
        </div>
        <div v-show="showCase.materialCase" class="card-body">
          <ul>
            <li class="material-item" v-for="(materialItem, materialIndex) in materialList" :key="materialIndex">
              <p>
                {{ materialItem.label }}
              </p>
              <p>
                <img @click="bigImage(materialItem.label, data[materialItem.value], imageIndex)" style="width: 30px;height: 30px;padding: 5px 10px; cursor: pointer" v-for="(materialImage, imageIndex) in data[materialItem.value]" :src="materialImage" :key="imageIndex">
              </p>
            </li>
          </ul>
        </div>
      </Card>
    </div>
    <image-modal ref="imageModal" :imageInfo="imageInfo"></image-modal>
  </Modal>
</template>

<script>
import imageModal from './image-modal.vue'
export default {
  name: 'materail-detail',
  components: {
    'image-modal': imageModal
  },
  props: {
    hideItem: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showCase: {
        baseCase: true,
        materialCase: true
      },
      imageInfo: {},
      modalShow: false,
      materialList: [{
        value: 'apply_file',
        label: '困难职工登记表照片'
      }, {
        value: 'diagnostic_proof_file',
        label: '诊断证明复印件'
      }, {
        value: 'family_idcards_file',
        label: '本人及主要家属身份证复印件'
      }, {
        value: 'household_registration_book_file',
        label: '户口本复印件'
      }, {
        value: 'personal_difficulty_application_file',
        label: '个人困难申请'
      }, {
        value: 'unit_proof_file',
        label: '本单位开具的证明'
      }, {
        value: 'hospital_bill_file',
        label: '医院单据'
      }, {
        value: 'publicity_materials_file',
        label: '公示材料复印件'
      }, {
        value: 'superior_unit_proof_file',
        label: '上级工会证明'
      }]
    }
  },
  methods: {
    bigImage (title, list, index) {
      this.imageInfo = {
        title: title,
        list: list,
        index: index
      }
      this.$refs.imageModal.modalShow = true
    }
  }
}
</script>
