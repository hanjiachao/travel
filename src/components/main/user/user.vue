<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <span @click="$router.push('/home')" style="font-size: 16px;">{{ userName }}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          修改密码
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal :mask-closable="false" footer-hide v-model="modalShow" title="修改密码">
      <modify-pass></modify-pass>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import modifyPass from '@/view/modifyPass/index.vue'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  components: {
    'modify-pass': modifyPass
  },
  data () {
    return {
      modalShow: false
    }
  },
  computed: {
    userName () {
      if (this.$store.state.admin.info && this.$store.state.admin.info.info.username) {
        return this.$store.state.admin.info.info.username
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    modifyPass () {
      this.modalShow = true
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.modifyPass()
          break
      }
    }
  },
  created () {
    // this.modifyPass()
  }
}
</script>
