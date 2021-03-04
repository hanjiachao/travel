export default [{
  config: {
    url: '',
    primaryKey: ''
  },
  columns: [{}]
}, {
  config: {
    url: '',
    primaryKey: '',
    foreignKey: ''
  },
  controls: [{
    title: '添加',
    selection: 'none',
    // auth: 'User/add',
    icon: 'md-add',
    confirm: true,
    type: 'form', // form 表单按钮  del 删除按钮
    url: '/User/add',
    formItems: [
      {
        type: 'text',
        name: 'username',
        label: '管理员账号',
        rules: ['required']
      },
      // {
      //   type: 'password',
      //   name: 'password',
      //   label: '密码',
      //   rules: ['required']
      // },
      // {
      //   type: 'password',
      //   name: 'repeat_password',
      //   label: '确认密码',
      //   rules: ['required', 'equalTo:password']
      // },
      {
        type: 'select',
        name: 'role',
        label: '管理员角色',
        rules: ['required'],
        options: '/Role/getList',
        listPosition: ['result', 'list'],
        levelKey: 'children',
        labelKey: 'r_name',
        valueKey: 'r_id'
      },
      {
        type: 'textarea',
        name: 'remark',
        label: '备注'
      }
    ]
  },
  {
    title: '删除',
    selection: 'single',
    auth: 'User/delete',
    icon: 'md-trash',
    type: 'del',
    url: '/User/delete'
  },
  {
    title: '重置密码',
    selection: 'single',
    icon: 'md-refresh',
    auth: 'User/resetPassword',
    url: '/User/resetPassword',
    type: 'form',
    confirm: true,
    formItems: [
      {
        type: 'password',
        name: 'new_password',
        label: '新密码',
        rules: ['required']
      },
      {
        type: 'password',
        name: 'repeat_password',
        label: '确认密码',
        rules: ['required', 'equalTo:new_password']
      }
    ]
  }],
  columns: [{
    title: 'id',
    key: 'ad_id',
    sortable: true,
    fold: true,
    hide: true
  }, {
    title: '账号',
    key: 'username',
    fold: true,
    hideDisabled: true
  }, {
    title: '管理员角色',
    key: 'role',
    fold: true,
    hideDisabled: true
  }, {
    title: '备注',
    key: 'remark',
    fold: true,
    hideDisabled: true
  }],
  search: [
    {
      label: '分类名称',
      key: 'name',
      type: 'input',
      fold: false
    }
  ]
}]
