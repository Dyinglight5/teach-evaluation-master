// components/ShowHours/ShowHours.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    hours: [],
    title: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToChange(e: any) {
      const hour = e.currentTarget.dataset.hour
      const name = e.currentTarget.dataset.name
      const index = e.currentTarget.dataset.index
      console.log(e.currentTarget.dataset);
      
      
      wx.navigateTo({
        url: '../../pages/change/change?name=' + name + '&index=' + index + '&hour=' + hour
      })
    }
  },
  lifetimes: {
    created() {
      // 在组件实例被创建时执行
      //获取本地的数据
      
      var that = this;
      wx.getStorage({
        key: 'title',
        success(res) {
          that.setData({
            title: res.data
          })
          wx.getStorage({
            key: 'hours',
            success(res) {
              that.setData({
                hours: res.data[that.data.title]
              }) 
            }
          })
        }
      })
      
      
    },
    attached() {
      // 在组件被添加到页面节点树中时执行
      // console.log('attached');
      
    },
    detached() {
      // 在组件被从页面节点树中移除时执行
    //  console.log('detached');
      
    },
    ready() {
      // 在组件布局完成后执行
      // console.log('ready');
      
    },
    moved() {
      // 在组件在页面节点树中的位置发生变化时执行
      // console.log('moved');
      
    }
  }
})
