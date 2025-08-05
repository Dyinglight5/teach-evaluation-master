// components/TheoryCourse.ts
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
    modifyPermission: false,
    modifyPermissionOfResearch: false,
    status: '',
    permission: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event: any) {
      // console.log(event);
      // console.log(this.data.hours);
      
      const index = event.currentTarget.dataset.index;
      const newHours = this.data.hours;
      newHours[index].hour = event.detail
      this.setData({
        hours: newHours
      })
      //将修改的数据储存在本地
      wx.getStorage({
        key: 'hours',
        success(res) {
          let hours = res.data
          hours['theory_course'] = newHours
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
      // 在组件实例被创建时执行 - 优化版本
      let that = this
      
      // 使用Promise.all并行获取数据，减少等待时间
      const promises = [
        new Promise((resolve, reject) => {
          wx.getStorage({
            key: 'my_data',
            success: resolve,
            fail: reject
          })
        }),
        new Promise((resolve, reject) => {
          wx.getStorage({
            key: 'hours',
            success: resolve,
            fail: reject
          })
        }),
        new Promise((resolve, reject) => {
          wx.getStorage({
            key: 'status',
            success: resolve,
            fail: reject
          })
        })
      ]

      Promise.all(promises).then((results: any[]) => {
        const [myDataRes, hoursRes, statusRes] = results
        
        // 设置基础数据
        if (statusRes) {
          that.setData({
            status: statusRes.data
          })
        }
        
        if (hoursRes && hoursRes.data.theory_course) {
          that.setData({
            hours: hoursRes.data.theory_course
          })
        }

        // 获取权限信息
        if (myDataRes && myDataRes.data._id) {
          const _id = myDataRes.data._id
          const db = wx.cloud.database()
          db.collection('WorkhoursData').doc(_id).get({
            success(res) {
              that.setData({
                modifyPermission: res.data.modifyPermission,
                modifyPermissionOfResearch: res.data.modifyPermissionOfResearch
              })
              
              const status = that.data.status
              const doctor = res.data.modifyPermission
              const research = res.data.modifyPermissionOfResearch
              
              if ((status == '医生' && doctor == true) || 
                  (status == '教研室' && research == true) || 
                  (status == '教育教学部')) {
                that.setData({
                  permission: true
                })
              }
            },
            fail(error) {
              console.error('获取权限信息失败:', error)
            }
          })
        }
      }).catch((error) => {
        console.error('TheoryCourse组件数据加载失败:', error)
        // 如果并行加载失败，回退到逐个加载
        that.fallbackLoad()
      })
    },

    // 回退加载方法
    fallbackLoad() {
      let that = this
      wx.getStorage({
        key: 'hours',
        success(res) {
          that.setData({
            hours: res.data.theory_course
          })
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