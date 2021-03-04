export default [{
  config: {
    url: 'course/getList',
    primaryKey: 'id'
  },
  controls: [{
    title: '添加',
    selection: 'none',
    auth: 'addCourse',
    icon: 'md-add',
    confirm: true,
    type: 'form', // form 表单按钮  del 删除按钮
    url: 'course/add',
    formItems: [
      {
        type: 'text',
        name: 'name',
        label: '课程名称',
        rules: ['required']
      },
      {
        type: 'text',
        name: 'title',
        label: '课程介绍',
        rules: ['required']
      },
      // {
      //   type: 'ueditor',
      //   name: 'name1',
      //   label: '课程名称',
      //   rules: ['required', 'stringLength:5,9']
      // },
      // {
      //   type: 'ueditor',
      //   name: 'name2',
      //   label: '课程名称',
      //   rules: ['required', 'stringLength:5,9']
      // },
      {
        type: 'image',
        name: 'cover',
        label: '封面图',
        limit: 1,
        rules: ['required']
      },
      // {
      //   type: 'file',
      //   name: 'title3q',
      //   label: '标题2',
      //   limit: 5,
      //   rules: ['required', 'arrayLength:,3']
      // },
      // {
      //   type: 'file',
      //   name: 'titleq1',
      //   label: '标题113',
      //   limit: 2,
      //   uploadUrl: '/uploadFile',
      //   uploadField: 'file'
      //   // rules: ['required', 'mobile']
      // },
      {
        type: 'select',
        name: 'course_type_id',
        label: '课程分类',
        multiple: true,
        rules: ['required'],
        options: 'courseType/getList'
        // options: [
        //   {
        //     label: '分类1',
        //     value: 1
        //   },
        //   {
        //     label: '分类2',
        //     value: 2
        //   },
        //   {
        //     label: '分类3',
        //     value: 3
        //   },
        //   {
        //     label: '分类4',
        //     value: 4
        //   }
        // ]
      }
    ]
  },
  {
    title: '编辑',
    selection: 'single',
    icon: 'ios-brush',
    auth: 'editCourse',
    url: 'course/edit',
    type: 'form',
    confirm: true,
    formItems: [
      {
        type: 'text',
        name: 'name',
        label: '课程名称',
        rules: ['required']
      },
      {
        type: 'text',
        name: 'title',
        label: '课程介绍',
        rules: ['required']
      },
      {
        type: 'image',
        name: 'cover',
        label: '封面图',
        limit: 1,
        rules: ['required']
      },
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
      {
        type: 'select',
        name: 'course_type_id',
        label: '课程分类',
        rules: ['required'],
        options: 'courseType/getList',
        keyLabel: 'course_type.name'
      }
    ]
  },
  {
    title: '删除',
    selection: 'multiple',
    auth: 'deleteCourse',
    icon: 'md-trash',
    type: 'del',
    url: 'course/delete'
  }],
  columns: [{
    title: 'id',
    key: 'id',
    sortable: true,
    fold: true,
    hide: true
  }, {
    title: '课程名称',
    key: 'name',
    sortable: true,
    fold: true,
    hideDisabled: true,
    rules: ['required']
  }, {
    title: '课程分类',
    key: 'course_type.name',
    fold: true,
    rules: ['required']
  }, {
    title: '课程介绍',
    key: 'title',
    fold: true,
    rules: ['required']
  }, {
    title: '封面图',
    key: 'cover',
    test: true,
    type: 'image',
    rules: ['required']
  }],
  search: [
    {
      label: '课程名称',
      key: 'skey',
      type: 'input',
      fold: false
    },
    {
      label: '课程简介',
      key: 'title',
      type: 'input',
      fold: false
    }
  ]
}, {
  config: {
    url: 'childCourse/getList',
    primaryKey: 'id',
    foreignKey: 'course_id'
  },
  controls: [{
    title: '添加',
    selection: 'none',
    auth: 'addChildCourse',
    icon: 'md-add',
    confirm: true,
    type: 'form', // form 表单按钮  del 删除按钮
    url: 'childCourse/add',
    formItems: [
      {
        type: 'text',
        name: 'title',
        label: '子课程介绍',
        rules: ['required']
      },
      {
        type: 'image',
        name: 'cover',
        label: '封面图',
        limit: 1,
        rules: ['required']
      }
    ]
  },
  {
    title: '编辑',
    selection: 'single',
    icon: 'ios-brush',
    auth: 'editChildCourse',
    url: 'childCourse/edit',
    type: 'form',
    confirm: true,
    formItems: [
      {
        type: 'text',
        name: 'title',
        label: '子课程介绍',
        rules: ['required']
      },
      {
        type: 'image',
        name: 'cover',
        label: '封面图',
        limit: 1,
        rules: ['required']
      }
    ]
  },
  {
    title: '删除',
    selection: 'multiple',
    auth: 'deleteChildCourse',
    icon: 'md-trash',
    type: 'del',
    url: 'childCourse/delete'
  }],
  columns: [{
    title: 'id',
    key: 'id',
    sortable: true,
    fold: true,
    hide: true,
    rules: ['required']
  }, {
    title: '课程介绍',
    key: 'title',
    test: true,
    rules: ['required']
  }, {
    title: '封面图',
    key: 'cover',
    test: true,
    type: 'image',
    rules: ['required']
  }],
  search: [
    {
      label: '子课程介绍',
      key: 'title',
      type: 'input',
      fold: false
    }
  ]
}]
