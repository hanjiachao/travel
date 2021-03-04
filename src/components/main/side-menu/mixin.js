import CommonIcon from '_c/common-icon'
// import { showTitle } from '@/libs/util'
export default {
  components: {
    CommonIcon
  },
  methods: {
    showTitle (item) {
      // return showTitle(item, this)
      return item.menu_name
    },
    showChildren (item) {
      return item.children && item.children.length > 0 && this.hasMenu(item.children)
    },
    hasMenu (item) {
      for (let i = 0; i < item.length; i++) {
        if (item[i].type === '菜单') {
          return true
        }
        // if (item[i].children) {
        //   console.log(item[i].children)
        //   let flag = this.hasMenu(item[i].children)
        //   if (flag) {
        //     return true
        //   }
        // }
      }
      return false
    },
    getNameOrHref (item, children0) {
      return item.name
      // return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  }
}
