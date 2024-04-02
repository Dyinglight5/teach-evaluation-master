// components/OtherHours/OtherHours.ts
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
    hours: [] as any,
    status: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event: any) {
      // console.log(event);
      // console.log(this.data.hours);
      const newHours = this.data.hours
      newHours[0].hour = event.detail
      this.setData({
        hours: newHours
      })
      //将修改的数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['other'] = newHours
          wx.setStorage({
            key: 'hours',
            data: hours,
            success() {
              const summationUtil = require('../../utils/summationUtil')
              summationUtil.default.sumAllHours()
            }
          })
        }
      })
    }
  },
  lifetimes: {
    created() {
      // 在组件实例被创建时执行
      var that = this;
      wx.getStorage({
        key: 'hours',
        success(res) {
          that.setData({
            hours: res.data.other
          }) 
          console.log(that.data);
          
        }
      })
      wx.getStorage({
        key: 'status',
        success(res) {
          that.setData({
            status: res.data
          })
        }
      })
    }
  }
})
