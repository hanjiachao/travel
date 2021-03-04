export default {
  config: {
    url: 'role/getList'
  },
  controls: [
    {
      title: '添加',
      // selection: 'none',
      icon: 'md-add',
      auth: 'addRole',
      confirm: true,
      type: 'form', // form 表单按钮  del 删除按钮  general 通用
      url: 'test2',
      formItems: [
        {
          type: 'text',
          name: 'name',
          label: '姓名',
          rules: ['required', 'stringLength:5,9']
        },
        {
          type: 'textarea',
          name: 'textarea',
          label: '文本域',
          rules: ['required', 'mobile']
        },
        {
          type: 'datetimerange',
          name: ['start_datetime', 'end_datetime'],
          label: '日期时间1',
          rules: []
        },
        {
          type: 'daterange',
          name: ['start_date', 'end_date'],
          label: '日期',
          rules: []
        },
        {
          type: 'date',
          name: 'date1',
          label: '日期',
          rules: []
        },
        {
          type: 'datetime',
          name: 'datetime',
          label: '日期时间',
          rules: []
        },
        {
          type: 'password',
          name: 'password',
          label: '密码',
          rules: ['required']
        },
        {
          type: 'password',
          name: 'rpassword',
          label: '重复密码',
          rules: ['required', 'equalTo:password']
        },
        {
          type: 'select',
          name: 'radio',
          label: '单选框',
          options: [
            {
              label: '哒哒哒哒哒哒多',
              value: 'ddddddd'
            },
            {
              label: 'cc哒哒哒哒哒哒多哒哒哒哒哒哒多哒哒哒哒哒哒多哒哒哒哒哒哒多哒哒哒哒哒哒多ccc',
              value: 'ccccc'
            },
            {
              label: 'cc哒哒哒哒哒哒哒哒哒哒多哒哒哒哒哒哒多ccc',
              value: 'dddd'
            },
            {
              label: 'cc哒哒哒哒哒哒多哒哒哒哒哒哒多哒哒哒哒哒哒多哒哒哒哒哒哒多哒哒哒哒哒哒多ccc',
              value: 'ccdddccc'
            },
            {
              label: 'cc哒哒哒哒哒哒哒哒哒哒多哒哒哒哒哒哒多ccc',
              value: 'ddcccdd'
            },
            {
              label: 'cc哒哒哒哒哒哒多哒哒哒哒多哒哒哒哒哒哒多ccc',
              value: 'cccc的c'
            }
          ]
        },
        {
          type: 'checkbox',
          name: 'checkbox',
          label: 'f复选框',
          options: [
            {
              label: '哒哒哒哒哒哒多',
              value: 'ddddddd'
            },
            {
              label: 'cc哒哒cc哒哒哒哒哒哒哒哒多ccc哒哒ccc',
              value: 'ccccc'
            },
            {
              label: 'cc哒哒哒哒哒多ccc',
              value: 'dddd'
            },
            {
              label: 'cc哒哒哒哒哒哒多哒哒哒哒多哒哒哒哒哒哒多ccc',
              value: 'cccc的c'
            }
          ],
          rules: ['required', 'arrayLength:2,3']
        }
      ]
    },
    {
      title: '添加',
      confirm: false,
      type: 'form',
      auth: 'addRole',
      selection: 'none',
      icon: 'md-add',
      url: 'role/add',
      formItems: [
        {
          type: 'text',
          name: 'name',
          label: '姓名',
          rules: ['required', 'stringLength:2,']
        }
      ]
    },
    {
      title: '编辑',
      selection: 'single',
      icon: 'ios-brush',
      url: 'test2',
      // auth: 'user_add1',
      type: 'form',
      confirm: true,
      formItems: [
        {
          type: 'text',
          name: 'name',
          label: '姓名',
          rules: ['required', 'stringLength:2,']
        }
        // {
        //   type: 'textarea',
        //   name: 'textarea',
        //   label: '文本域',
        //   rules: ['required', 'mobile']
        // },
        // {
        //   type: 'datetimerange',
        //   name: ['start_datetime', 'end_datetime'],
        //   label: '日期时间1',
        //   rules: ['required']
        // },
        // {
        //   type: 'daterange',
        //   name: ['start_date', 'end_date'],
        //   label: '日期',
        //   rules: ['required']
        // }
      ]
    },
    {
      title: '删除',
      selection: 'multiple',
      icon: 'md-trash',
      type: 'del',
      url: 'test2'
    }
  ],
  columns: [{
    title: 'id',
    key: 'id',
    sortable: true,
    hide: true
  }, {
    title: '角色名称',
    key: 'name',
    sortable: true,
    fold: true,
    hideDisabled: true
  }]
}
